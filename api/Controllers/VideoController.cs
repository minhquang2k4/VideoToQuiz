using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class VideoController : ControllerBase
{
  private readonly DatabaseService _databaseService;

  public VideoController()
  {
    _databaseService = DatabaseService.Instance;
  }

  [HttpPost]
  public async Task<IActionResult> PostVideo([FromBody] VideoRequest request)
  {
    var token = AuthHelper.ExtractTokenFromHeader(Request);
    Console.WriteLine(token);
    if (string.IsNullOrEmpty(token))
    {
      return Unauthorized(new { Message = "Missing or invalid Authorization header" });
    }

    var UserID = JwtHelper.DecodeToken(token);
    if (UserID == null)
    {
      return Unauthorized(new { Message = "Invalid token" });
    }

    using (var httpClient = new HttpClient())
    {
      var payload = new { videoUrl = request.Url };
      var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

      try
      {
        var response = await httpClient.PostAsync("http://localhost:8000/transcript", content);
        if (!response.IsSuccessStatusCode)
        {
          return StatusCode((int)response.StatusCode, new { Message = "Failed to fetch transcript or generate quiz" });
        }

        var responseData = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TranscriptResponse>(responseData, new JsonSerializerOptions
        {
          PropertyNameCaseInsensitive = true
        });

        int videoId;

        using (var connection = _databaseService.GetConnection())
        {
          await connection.OpenAsync();
          using (var transaction = connection.BeginTransaction())
          {
            try
            {
              var videoCommand = new SqlCommand(@"
                            INSERT INTO Videos (UserID, Title, Url) 
                            OUTPUT INSERTED.VideoID
                            VALUES (@UserID, @Title, @Url)", connection, transaction);

              videoCommand.Parameters.AddWithValue("@UserID", UserID);
              videoCommand.Parameters.AddWithValue("@Title", request.Title);
              videoCommand.Parameters.AddWithValue("@Url", request.Url);

              videoId = (int)videoCommand.ExecuteScalar();

              if (!string.IsNullOrEmpty(result?.Summary))
              {
                var transcriptCommand = new SqlCommand(@"
                                INSERT INTO Transcripts (VideoID, Summary) 
                                VALUES (@VideoID, @Summary)", connection, transaction);

                transcriptCommand.Parameters.AddWithValue("@VideoID", videoId);
                transcriptCommand.Parameters.AddWithValue("@Summary", result.Summary);

                transcriptCommand.ExecuteNonQuery();
              }

              if (result?.Quizs != null)
              {
                foreach (var quiz in result.Quizs)
                {
                  var quizCommand = new SqlCommand(@"
                                    INSERT INTO QuizQuestions (VideoID, Question, CorrectAnswer) 
                                    OUTPUT INSERTED.QuestionID
                                    VALUES (@VideoID, @Question, @CorrectAnswer)", connection, transaction);

                  quizCommand.Parameters.AddWithValue("@VideoID", videoId);
                  quizCommand.Parameters.AddWithValue("@Question", quiz.Question);
                  quizCommand.Parameters.AddWithValue("@CorrectAnswer", quiz.CorrectAnswer);

                  int questionId = (int)quizCommand.ExecuteScalar();

                  foreach (var option in quiz.Options)
                  {
                    var optionCommand = new SqlCommand(@"
                                        INSERT INTO QuizOptions (QuestionID, OptionText) 
                                        VALUES (@QuestionID, @OptionText)", connection, transaction);

                    optionCommand.Parameters.AddWithValue("@QuestionID", questionId);
                    optionCommand.Parameters.AddWithValue("@OptionText", option);

                    optionCommand.ExecuteNonQuery();
                  }
                }
              }

              transaction.Commit();
            }
            catch (Exception ex)
            {
              transaction.Rollback();
              throw new Exception("Lỗi khi lưu dữ liệu vào database: " + ex.Message);
            }
          }
        }

        return Ok(new
        {
          Message = "Video and transcript saved successfully",
          VideoID = videoId
        });
      }
      catch (Exception ex)
      {
        return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
      }
    }
  }

[HttpGet]
public async Task<IActionResult> GetVideosByUser()
{
    var token = AuthHelper.ExtractTokenFromHeader(Request);
    if (string.IsNullOrEmpty(token))
    {
        return Unauthorized(new { Message = "Missing or invalid Authorization header" });
    }

    var UserID = JwtHelper.DecodeToken(token);
    if (UserID == null)
    {
        return Unauthorized(new { Message = "Invalid token" });
    }

    try
    {
        var videos = new List<VideoResponse>();

        using (var connection = _databaseService.GetConnection())
        {
            await connection.OpenAsync();
            var command = new SqlCommand(@"
                SELECT VideoID, Title, Url, UploadDate 
                FROM Videos 
                WHERE UserID = @UserID", connection);

            command.Parameters.AddWithValue("@UserID", UserID);

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    videos.Add(new VideoResponse
                    {
                        VideoID = reader.GetInt32(0),
                        Title = reader.GetString(1),
                        Url = reader.GetString(2),
                        UploadDate = reader.GetDateTime(3) // Lấy dữ liệu từ SQL
                    });
                }
            }
        }

        return Ok(videos);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
    }
}

}

public class VideoRequest
{
  public string Title { get; set; }
  public string Url { get; set; }
}

public class TranscriptResponse
{
  public string Summary { get; set; }
  public List<QuizQuestion> Quizs { get; set; }
}

public class QuizQuestion
{
  public string Question { get; set; }
  public List<string> Options { get; set; }
  public string CorrectAnswer { get; set; }
}

public class VideoResponse
{
    public int VideoID { get; set; }
    public string Title { get; set; }
    public string Url { get; set; }
    public DateTime UploadDate { get; set; }
}
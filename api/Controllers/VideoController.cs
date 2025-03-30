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

  [HttpPost("note")]
  public async Task<IActionResult> PostNote([FromBody] NoteRequest request)
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
      int noteId;
      using (var connection = _databaseService.GetConnection())
      {
        await connection.OpenAsync();

        // Verify that the video belongs to the user
        var verifyCommand = new SqlCommand(@"
                    SELECT COUNT(*) 
                    FROM Videos 
                    WHERE VideoID = @VideoID AND UserID = @UserID", connection);

        verifyCommand.Parameters.AddWithValue("@VideoID", request.VideoID);
        verifyCommand.Parameters.AddWithValue("@UserID", UserID);

        int count = (int)await verifyCommand.ExecuteScalarAsync();
        if (count == 0)
        {
          return NotFound(new { Message = "Video not found or you do not have access to this video." });
        }

        // Insert the note
        var noteCommand = new SqlCommand(@"
                    INSERT INTO Notes (VideoID, Content) 
                    OUTPUT INSERTED.NoteID
                    VALUES (@VideoID, @Content)", connection);

        noteCommand.Parameters.AddWithValue("@VideoID", request.VideoID);
        noteCommand.Parameters.AddWithValue("@Content", request.Content);

        // Lấy NoteID vừa được tạo
        noteId = (int)await noteCommand.ExecuteScalarAsync();
      }
      return Ok(new NoteResponse
      {
        NoteID = noteId, // Trả về NoteID vừa được tạo
        Content = request.Content,
        CreatedAt = DateTime.UtcNow // Thời gian tạo ghi chú
      });
    }
    catch (Exception ex)
    {
      return StatusCode(500, new { Message = "An error occurred", Error = ex.Message });
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

  [HttpGet("{id}")]
  public async Task<IActionResult> GetVideoById(int id)
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
      using (var connection = _databaseService.GetConnection())
      {
        await connection.OpenAsync();

        // Truy vấn Video + Summary
        var command = new SqlCommand(@"
                SELECT v.VideoID, v.Title, v.Url, v.UploadDate, t.Summary
                FROM Videos v
                LEFT JOIN Transcripts t ON v.VideoID = t.VideoID
                WHERE v.VideoID = @VideoID AND v.UserID = @UserID", connection);

        command.Parameters.AddWithValue("@VideoID", id);
        command.Parameters.AddWithValue("@UserID", UserID);

        VideoResponse video = null;
        TranscriptResponse transcript = null;

        using (var reader = await command.ExecuteReaderAsync())
        {
          if (await reader.ReadAsync())
          {
            video = new VideoResponse
            {
              VideoID = reader.GetInt32(0),
              Title = reader.GetString(1),
              Url = reader.GetString(2),
              UploadDate = reader.GetDateTime(3)
            };

            transcript = new TranscriptResponse
            {
              Summary = reader.IsDBNull(4) ? null : reader.GetString(4),
              Quizs = new List<QuizQuestion>()
            };
          }
          else
          {
            return NotFound(new { Message = "Video not found or you do not have access to this video." });
          }
        }

        // Truy vấn câu hỏi và đáp án
        var quizCommand = new SqlCommand(@"
                SELECT q.Question, q.CorrectAnswer, o.OptionText
                FROM QuizQuestions q
                LEFT JOIN QuizOptions o ON q.QuestionID = o.QuestionID
                WHERE q.VideoID = @VideoID", connection);

        quizCommand.Parameters.AddWithValue("@VideoID", id);

        var quizDict = new Dictionary<string, QuizQuestion>();

        using (var reader = await quizCommand.ExecuteReaderAsync())
        {
          while (await reader.ReadAsync())
          {
            string questionText = reader.GetString(0);
            string correctAnswer = reader.GetString(1);
            string optionText = reader.GetString(2);

            if (!quizDict.ContainsKey(questionText))
            {
              quizDict[questionText] = new QuizQuestion
              {
                Question = questionText,
                CorrectAnswer = correctAnswer,
                Options = new List<string>()
              };
              transcript.Quizs.Add(quizDict[questionText]);
            }

            quizDict[questionText].Options.Add(optionText);
          }
        }

        // Truy vấn ghi chú
        var notesCommand = new SqlCommand(@"
                SELECT NoteID, Content, CreatedAt
                FROM Notes
                WHERE VideoID = @VideoID", connection);

        notesCommand.Parameters.AddWithValue("@VideoID", id);

        var notes = new List<NoteResponse>();

        using (var reader = await notesCommand.ExecuteReaderAsync())
        {
          while (await reader.ReadAsync())
          {
            notes.Add(new NoteResponse
            {
              NoteID = reader.GetInt32(0),
              Content = reader.GetString(1),
              CreatedAt = reader.GetDateTime(2)
            });
          }
        }

        return Ok(new
        {
          video.VideoID,
          video.Title,
          video.Url,
          video.UploadDate,
          Summary = transcript.Summary,
          Quizs = transcript.Quizs,
          Notes = notes
        });
      }
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

public class NoteRequest
{
  public int VideoID { get; set; }
  public string Content { get; set; }
}

public class NoteResponse
{
  public int NoteID { get; set; }
  public string Content { get; set; }
  public DateTime CreatedAt { get; set; }
}
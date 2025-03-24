using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    public AuthController()
    {
        _databaseService = new DatabaseService("Server=localhost;Database=VideoToQuiz;User Id=sa;Password=admin;");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        using (var connection = _databaseService.GetConnection())
        {
            var command = new SqlCommand("SELECT COUNT(*) FROM Users WHERE Email = @Email AND Password = @Password", connection);
            command.Parameters.AddWithValue("@Email", request.Email);
            command.Parameters.AddWithValue("@Password", request.Password);

            var userExists = (int)command.ExecuteScalar() > 0;
            if (userExists)
            {
                return Ok(new { Message = "Login successful", Token = "dummy-jwt-token" });
            }
        }
        return Unauthorized(new { Message = "Invalid credentials" });
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new { Message = "Email and password are required" });
        }

        using (var connection = _databaseService.GetConnection())
        {
            var command = new SqlCommand("INSERT INTO Users (Email, Password, FullName) VALUES (@Email, @Password, @FullName)", connection);
            command.Parameters.AddWithValue("@Email", request.Email);
            command.Parameters.AddWithValue("@Password", request.Password);
            command.Parameters.AddWithValue("@FullName", request.FullName);

            command.ExecuteNonQuery();
        }
        return Ok(new { Message = "Registration successful" });
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly DatabaseService _databaseService;

    public AuthController()
    {
        _databaseService = new DatabaseService();
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        using (var connection = _databaseService.GetConnection())
        {
            var command = new SqlCommand("SELECT * FROM Users WHERE Email = @Email", connection);
            command.Parameters.AddWithValue("@Email", request.Email);

            var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var passwordHash = reader.GetString(3);
                
                if (BCrypt.Net.BCrypt.Verify(request.Password, passwordHash))
                {
                    var token = JwtHelper.GenerateToken(request.Email);
                    return Ok(new { Message = "Login successful", Token = token });
                }
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

        // hash password
        request.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

        using (var connection = _databaseService.GetConnection())
        {
            var command = new SqlCommand("INSERT INTO Users (Email, PasswordHash, FullName) VALUES (@Email, @Password, @FullName)", connection);
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
 
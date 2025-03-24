using Microsoft.Data.SqlClient;

public class DatabaseService
{
    private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=VIDEOTOQUIZ;User Id=sa;Password=admin;TrustServerCertificate=True;";

    public SqlConnection GetConnection()
    {
        var connection = new SqlConnection(_connectionString);
        connection.Open();
        return connection;
    }
}

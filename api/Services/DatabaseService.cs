using Microsoft.Data.SqlClient;

public class DatabaseService
{
    private static readonly Lazy<DatabaseService> _instance = new Lazy<DatabaseService>(() => new DatabaseService());

    public static DatabaseService Instance => _instance.Value;

    private readonly string _connectionString = "Server=localhost\\SQLEXPRESS;Database=VIDEOTOQUIZ;User Id=sa;Password=admin;TrustServerCertificate=True;";

    private DatabaseService()
    {
        // Private constructor to prevent instantiation
    }

    public SqlConnection GetConnection()
    {
        var connection = new SqlConnection(_connectionString);
        return connection;
    }
}

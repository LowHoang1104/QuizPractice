namespace QuizServer.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Gender { get; set; }
    public string? Mobile { get; set; }
    public string? GoogleId { get; set; }
    public string? AvatarUrl { get; set; }
    public int RoleId { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Role Role { get; set; } = null!;
    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
    public ICollection<QuizResult> QuizResults { get; set; } = new List<QuizResult>();
    public ICollection<SubjectRegistration> Registrations { get; set; } = new List<SubjectRegistration>();
}

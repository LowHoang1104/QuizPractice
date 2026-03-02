namespace QuizServer.Domain.Entities;

public class Quiz
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? SubjectId { get; set; }
    public int? QuizTemplateId { get; set; }
    public QuizType Type { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }

    public User User { get; set; } = null!;
    public Subject? Subject { get; set; }
    public QuizTemplate? QuizTemplate { get; set; }
    public ICollection<QuizResult> QuizResults { get; set; } = new List<QuizResult>();
}

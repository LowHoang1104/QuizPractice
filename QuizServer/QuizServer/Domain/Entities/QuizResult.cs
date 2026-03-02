namespace QuizServer.Domain.Entities;

public class QuizResult
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public int UserId { get; set; }
    public decimal ScorePercent { get; set; }
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public Quiz Quiz { get; set; } = null!;
    public User User { get; set; } = null!;
    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}

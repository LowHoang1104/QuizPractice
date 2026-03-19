namespace QuizServer.Domain.Entities;

public class Question
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public int? DimensionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public QuestionLevel Level { get; set; }
    public string Status { get; set; } = "Active"; // Active, Inactive

    public Subject Subject { get; set; } = null!;
    public Dimension? Dimension { get; set; }
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}

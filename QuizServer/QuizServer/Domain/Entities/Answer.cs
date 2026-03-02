namespace QuizServer.Domain.Entities;

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int OrderIndex { get; set; }

    public Question Question { get; set; } = null!;
    public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
}

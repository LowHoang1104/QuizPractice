namespace QuizServer.Domain.Entities;

public class UserAnswer
{
    public int Id { get; set; }
    public int QuizResultId { get; set; }
    public int QuestionId { get; set; }
    public int AnswerId { get; set; }
    public bool IsCorrect { get; set; }

    public QuizResult QuizResult { get; set; } = null!;
    public Question Question { get; set; } = null!;
    public Answer Answer { get; set; } = null!;
}

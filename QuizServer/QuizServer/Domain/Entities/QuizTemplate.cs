namespace QuizServer.Domain.Entities;

public class QuizTemplate
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public QuestionLevel Level { get; set; }
    public int QuestionCount { get; set; }
    public int DurationMinutes { get; set; }
    public decimal PassRate { get; set; }
    public string Type { get; set; } = "Simulation"; // Simulation, LessonQuiz

    public Subject Subject { get; set; } = null!;
}

namespace QuizServer.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Lesson"; // SubjectTopic, Lesson, Quiz
    public string? VideoLink { get; set; }
    public string? HtmlContent { get; set; }
    public int? QuizTemplateId { get; set; }
    public int OrderIndex { get; set; }
    public string Status { get; set; } = "Active";

    public Subject Subject { get; set; } = null!;
    public QuizTemplate? QuizTemplate { get; set; }
}

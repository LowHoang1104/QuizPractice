namespace QuizServer.Domain.Entities;

public class Dimension
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Type { get; set; } = "Group"; // Domain, Group
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Subject Subject { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}

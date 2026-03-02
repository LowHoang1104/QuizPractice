namespace QuizServer.Domain.Entities;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? TagLine { get; set; }
    public string? Thumbnail { get; set; }
    public string? Category { get; set; }
    public bool IsFeatured { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Published, Unpublished
    public int? OwnerId { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User? Owner { get; set; }
    public ICollection<PricePackage> PricePackages { get; set; } = new List<PricePackage>();
    public ICollection<Dimension> Dimensions { get; set; } = new List<Dimension>();
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
    public ICollection<SubjectRegistration> Registrations { get; set; } = new List<SubjectRegistration>();
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<QuizTemplate> QuizTemplates { get; set; } = new List<QuizTemplate>();
}

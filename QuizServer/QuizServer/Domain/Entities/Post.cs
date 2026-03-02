namespace QuizServer.Domain.Entities;

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? BriefInfo { get; set; }
    public string? Content { get; set; }
    public string? Thumbnail { get; set; }
    public string? Category { get; set; }
    public bool IsFeatured { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

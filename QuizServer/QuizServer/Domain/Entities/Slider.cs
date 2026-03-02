namespace QuizServer.Domain.Entities;

public class Slider
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Backlink { get; set; }
    public string Status { get; set; } = "Active";
    public string? Notes { get; set; }
}

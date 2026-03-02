namespace QuizServer.Domain.Entities;

public class Setting
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int Order { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = "Active";
}

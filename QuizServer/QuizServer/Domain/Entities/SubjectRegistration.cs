namespace QuizServer.Domain.Entities;

public class SubjectRegistration
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SubjectId { get; set; }
    public int PricePackageId { get; set; }
    public decimal TotalCost { get; set; }
    public string Status { get; set; } = "Submitted"; // Submitted, Paid, Cancelled
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public int? SaleId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? LastUpdatedBy { get; set; }
    public string? Notes { get; set; }

    public User User { get; set; } = null!;
    public Subject Subject { get; set; } = null!;
    public PricePackage PricePackage { get; set; } = null!;
}

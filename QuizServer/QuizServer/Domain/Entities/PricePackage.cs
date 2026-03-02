namespace QuizServer.Domain.Entities;

public class PricePackage
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal ListPrice { get; set; }
    public decimal SalePrice { get; set; }
    public int DurationMonths { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = "Active";

    public Subject Subject { get; set; } = null!;
    public ICollection<SubjectRegistration> Registrations { get; set; } = new List<SubjectRegistration>();
}

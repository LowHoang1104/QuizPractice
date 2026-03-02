using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SubjectsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var list = await _db.Subjects
            .Where(s => s.Status == "Published")
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Description,
                s.TagLine,
                s.Thumbnail,
                s.IsFeatured,
                LowestPrice = _db.PricePackages.Where(p => p.SubjectId == s.Id && p.Status == "Active").Min(p => (decimal?)p.SalePrice)
            })
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var s = await _db.Subjects
            .Include(x => x.PricePackages)
            .FirstOrDefaultAsync(x => x.Id == id && x.Status == "Published", ct);
        if (s == null) return NotFound();
        var lowest = s.PricePackages.Where(p => p.Status == "Active").OrderBy(p => p.SalePrice).FirstOrDefault();
        return Ok(new
        {
            s.Id,
            s.Name,
            s.Description,
            s.TagLine,
            s.Thumbnail,
            LowestPackage = lowest == null ? null : new { lowest.Id, lowest.Name, lowest.ListPrice, lowest.SalePrice, lowest.DurationMonths }
        });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin,Expert,Sale")]
    public async Task<IActionResult> GetListAdmin([FromQuery] string? status, [FromQuery] int? ownerId, CancellationToken ct)
    {
        var q = _db.Subjects.Include(s => s.Owner).AsQueryable();
        if (!string.IsNullOrEmpty(status)) q = q.Where(s => s.Status == status);
        if (ownerId.HasValue) q = q.Where(s => s.OwnerId == ownerId);
        var list = await q
            .OrderByDescending(s => s.UpdatedAt)
            .Select(s => new SubjectAdminDto(s.Id, s.Name, s.Description, s.TagLine, s.Thumbnail, s.Category, s.IsFeatured, s.Status, s.OwnerId, s.UpdatedAt))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("admin/{id:int}")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> GetByIdAdmin(int id, CancellationToken ct)
    {
        var s = await _db.Subjects.Include(x => x.Owner).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (s == null) return NotFound();
        return Ok(new SubjectAdminDto(s.Id, s.Name, s.Description, s.TagLine, s.Thumbnail, s.Category, s.IsFeatured, s.Status, s.OwnerId, s.UpdatedAt));
    }

    [HttpPost("admin")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> Create([FromBody] CreateSubjectRequest req, CancellationToken ct)
    {
        var s = new Domain.Entities.Subject
        {
            Name = req.Name,
            Description = req.Description,
            TagLine = req.TagLine,
            Thumbnail = req.Thumbnail,
            Category = req.Category,
            IsFeatured = req.IsFeatured,
            OwnerId = req.OwnerId,
            Status = "Draft"
        };
        _db.Subjects.Add(s);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetByIdAdmin), new { id = s.Id }, new { id = s.Id });
    }

    [HttpPut("admin/{id:int}")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubjectRequest req, CancellationToken ct)
    {
        var s = await _db.Subjects.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        s.Name = req.Name;
        s.Description = req.Description;
        s.TagLine = req.TagLine;
        s.Thumbnail = req.Thumbnail;
        s.Category = req.Category;
        s.IsFeatured = req.IsFeatured;
        s.Status = req.Status;
        s.OwnerId = req.OwnerId;
        s.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpGet("admin/{id:int}/dimensions")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> GetDimensions(int id, CancellationToken ct)
    {
        var list = await _db.Dimensions
            .Where(d => d.SubjectId == id)
            .Select(d => new DimensionDto(d.Id, d.SubjectId, d.Type, d.Name, d.Description))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpPost("admin/{id:int}/dimensions")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> CreateDimension(int id, [FromBody] CreateDimensionRequest req, CancellationToken ct)
    {
        req = req with { SubjectId = id };
        var d = new Domain.Entities.Dimension { SubjectId = req.SubjectId, Type = req.Type, Name = req.Name, Description = req.Description };
        _db.Dimensions.Add(d);
        await _db.SaveChangesAsync(ct);
        return Created("", new { id = d.Id });
    }

    [HttpPut("admin/dimensions/{dimId:int}")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> UpdateDimension(int dimId, [FromBody] UpdateDimensionRequest req, CancellationToken ct)
    {
        var d = await _db.Dimensions.FindAsync(new object[] { dimId }, ct);
        if (d == null) return NotFound();
        d.Type = req.Type;
        d.Name = req.Name;
        d.Description = req.Description;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpGet("admin/{id:int}/price-packages")]
    [Authorize(Roles = "Admin,Expert,Sale")]
    public async Task<IActionResult> GetPricePackages(int id, CancellationToken ct)
    {
        var list = await _db.PricePackages
            .Where(p => p.SubjectId == id)
            .Select(p => new PricePackageDto(p.Id, p.SubjectId, p.Name, p.ListPrice, p.SalePrice, p.DurationMonths, p.Description, p.Status))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpPost("admin/{id:int}/price-packages")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> CreatePricePackage(int id, [FromBody] CreatePricePackageRequest req, CancellationToken ct)
    {
        req = req with { SubjectId = id };
        var p = new Domain.Entities.PricePackage
        {
            SubjectId = req.SubjectId,
            Name = req.Name,
            ListPrice = req.ListPrice,
            SalePrice = req.SalePrice,
            DurationMonths = req.DurationMonths,
            Description = req.Description,
            Status = "Active"
        };
        _db.PricePackages.Add(p);
        await _db.SaveChangesAsync(ct);
        return Created("", new { id = p.Id });
    }

    [HttpPut("admin/price-packages/{pkgId:int}")]
    [Authorize(Roles = "Admin,Expert")]
    public async Task<IActionResult> UpdatePricePackage(int pkgId, [FromBody] UpdatePricePackageRequest req, CancellationToken ct)
    {
        var p = await _db.PricePackages.FindAsync(new object[] { pkgId }, ct);
        if (p == null) return NotFound();
        p.Name = req.Name;
        p.ListPrice = req.ListPrice;
        p.SalePrice = req.SalePrice;
        p.DurationMonths = req.DurationMonths;
        p.Description = req.Description;
        p.Status = req.Status;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

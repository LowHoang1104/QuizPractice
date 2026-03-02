using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public RegistrationsController(ApplicationDbContext db) => _db = db;

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyRegistrations(CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var list = await _db.SubjectRegistrations
            .Include(r => r.User)
            .Include(r => r.Subject)
            .Include(r => r.PricePackage)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RegistrationDto(r.Id, r.UserId, r.User.Email, r.User.FullName, r.SubjectId, r.Subject.Name, r.PricePackageId, r.PricePackage.Name, r.TotalCost, r.Status, r.ValidFrom, r.ValidTo, r.CreatedAt))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Sale")]
    public async Task<IActionResult> GetList([FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.SubjectRegistrations
            .Include(r => r.User)
            .Include(r => r.Subject)
            .Include(r => r.PricePackage)
            .AsQueryable();
        if (!string.IsNullOrEmpty(status)) q = q.Where(r => r.Status == status);

        var list = await q
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RegistrationDto(r.Id, r.UserId, r.User.Email, r.User.FullName, r.SubjectId, r.Subject.Name, r.PricePackageId, r.PricePackage.Name, r.TotalCost, r.Status, r.ValidFrom, r.ValidTo, r.CreatedAt))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Sale")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var r = await _db.SubjectRegistrations
            .Include(x => x.User)
            .Include(x => x.Subject)
            .Include(x => x.PricePackage)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (r == null) return NotFound();
        return Ok(new RegistrationDto(r.Id, r.UserId, r.User.Email, r.User.FullName, r.SubjectId, r.Subject.Name, r.PricePackageId, r.PricePackage.Name, r.TotalCost, r.Status, r.ValidFrom, r.ValidTo, r.CreatedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Sale")]
    public async Task<IActionResult> Create([FromBody] CreateRegistrationRequest req, CancellationToken ct)
    {
        var r = new Domain.Entities.SubjectRegistration
        {
            UserId = req.UserId,
            SubjectId = req.SubjectId,
            PricePackageId = req.PricePackageId,
            TotalCost = req.TotalCost,
            ValidFrom = req.ValidFrom,
            ValidTo = req.ValidTo,
            Notes = req.Notes,
            Status = "Submitted"
        };
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userId, out var saleId)) r.SaleId = saleId;
        _db.SubjectRegistrations.Add(r);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = r.Id }, new { id = r.Id });
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin,Sale")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRegistrationStatusRequest req, CancellationToken ct)
    {
        var r = await _db.SubjectRegistrations.FindAsync(new object[] { id }, ct);
        if (r == null) return NotFound();
        r.Status = req.Status;
        r.Notes = req.Notes;
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userId, out var uid)) r.LastUpdatedBy = uid;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

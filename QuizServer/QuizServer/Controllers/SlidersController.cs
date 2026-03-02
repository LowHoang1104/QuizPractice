using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlidersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SlidersController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.Sliders.AsQueryable();
        if (!string.IsNullOrEmpty(status)) q = q.Where(s => s.Status == status);
        var list = await q
            .Select(s => new SliderDto(s.Id, s.Title, s.ImageUrl, s.Backlink, s.Status, s.Notes))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var s = await _db.Sliders.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        return Ok(new SliderDto(s.Id, s.Title, s.ImageUrl, s.Backlink, s.Status, s.Notes));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Create([FromBody] CreateSliderRequest req, CancellationToken ct)
    {
        var s = new Domain.Entities.Slider
        {
            Title = req.Title,
            ImageUrl = req.ImageUrl,
            Backlink = req.Backlink,
            Notes = req.Notes,
            Status = "Active"
        };
        _db.Sliders.Add(s);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = s.Id }, new { id = s.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSliderRequest req, CancellationToken ct)
    {
        var s = await _db.Sliders.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        s.Title = req.Title;
        s.ImageUrl = req.ImageUrl;
        s.Backlink = req.Backlink;
        s.Status = req.Status;
        s.Notes = req.Notes;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var s = await _db.Sliders.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        _db.Sliders.Remove(s);
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

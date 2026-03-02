using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public SettingsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList(CancellationToken ct)
    {
        var list = await _db.Settings
            .OrderBy(s => s.Order)
            .Select(s => new SettingDto(s.Id, s.Type, s.Value, s.Order, s.Description, s.Status))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var s = await _db.Settings.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        return Ok(new SettingDto(s.Id, s.Type, s.Value, s.Order, s.Description, s.Status));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateSettingRequest req, CancellationToken ct)
    {
        var s = new Domain.Entities.Setting
        {
            Type = req.Type,
            Value = req.Value,
            Order = req.Order,
            Description = req.Description,
            Status = "Active"
        };
        _db.Settings.Add(s);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = s.Id }, new { id = s.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSettingRequest req, CancellationToken ct)
    {
        var s = await _db.Settings.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        s.Type = req.Type;
        s.Value = req.Value;
        s.Order = req.Order;
        s.Description = req.Description;
        s.Status = req.Status;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var s = await _db.Settings.FindAsync(new object[] { id }, ct);
        if (s == null) return NotFound();
        _db.Settings.Remove(s);
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

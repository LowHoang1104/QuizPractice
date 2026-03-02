using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Expert")]
public class QuizTemplatesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public QuizTemplatesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] int? subjectId, CancellationToken ct)
    {
        var q = _db.QuizTemplates.AsQueryable();
        if (subjectId.HasValue) q = q.Where(x => x.SubjectId == subjectId);

        var list = await q
            .OrderBy(x => x.SubjectId).ThenBy(x => x.Name)
            .Select(x => new QuizTemplateDto(x.Id, x.SubjectId, x.Name, x.Level, x.QuestionCount, x.DurationMinutes, x.PassRate, x.Type))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var x = await _db.QuizTemplates.FindAsync(new object[] { id }, ct);
        if (x == null) return NotFound();
        return Ok(new QuizTemplateDto(x.Id, x.SubjectId, x.Name, x.Level, x.QuestionCount, x.DurationMinutes, x.PassRate, x.Type));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateQuizTemplateRequest req, CancellationToken ct)
    {
        var x = new Domain.Entities.QuizTemplate
        {
            SubjectId = req.SubjectId,
            Name = req.Name,
            Level = req.Level,
            QuestionCount = req.QuestionCount,
            DurationMinutes = req.DurationMinutes,
            PassRate = req.PassRate,
            Type = req.Type
        };
        _db.QuizTemplates.Add(x);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = x.Id }, new { id = x.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateQuizTemplateRequest req, CancellationToken ct)
    {
        var x = await _db.QuizTemplates.FindAsync(new object[] { id }, ct);
        if (x == null) return NotFound();
        x.Name = req.Name;
        x.Level = req.Level;
        x.QuestionCount = req.QuestionCount;
        x.DurationMinutes = req.DurationMinutes;
        x.PassRate = req.PassRate;
        x.Type = req.Type;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

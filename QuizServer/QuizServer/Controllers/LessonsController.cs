using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Expert")]
public class LessonsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public LessonsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] int? subjectId, [FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.Lessons.AsQueryable();
        if (subjectId.HasValue) q = q.Where(x => x.SubjectId == subjectId);
        if (!string.IsNullOrEmpty(status)) q = q.Where(x => x.Status == status);

        var list = await q
            .OrderBy(x => x.SubjectId).ThenBy(x => x.OrderIndex)
            .Select(x => new LessonDto(x.Id, x.SubjectId, x.Name, x.Type, x.VideoLink, x.HtmlContent, x.QuizTemplateId, x.OrderIndex, x.Status))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var x = await _db.Lessons.FindAsync(new object[] { id }, ct);
        if (x == null) return NotFound();
        return Ok(new LessonDto(x.Id, x.SubjectId, x.Name, x.Type, x.VideoLink, x.HtmlContent, x.QuizTemplateId, x.OrderIndex, x.Status));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLessonRequest req, CancellationToken ct)
    {
        var x = new Domain.Entities.Lesson
        {
            SubjectId = req.SubjectId,
            Name = req.Name,
            Type = req.Type,
            VideoLink = req.VideoLink,
            HtmlContent = req.HtmlContent,
            QuizTemplateId = req.QuizTemplateId,
            OrderIndex = req.OrderIndex,
            Status = "Active"
        };
        _db.Lessons.Add(x);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = x.Id }, new { id = x.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLessonRequest req, CancellationToken ct)
    {
        var x = await _db.Lessons.FindAsync(new object[] { id }, ct);
        if (x == null) return NotFound();
        x.Name = req.Name;
        x.Type = req.Type;
        x.VideoLink = req.VideoLink;
        x.HtmlContent = req.HtmlContent;
        x.QuizTemplateId = req.QuizTemplateId;
        x.OrderIndex = req.OrderIndex;
        x.Status = req.Status;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

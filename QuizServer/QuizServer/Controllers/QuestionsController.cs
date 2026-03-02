using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Expert")]
public class QuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public QuestionsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] int? subjectId, [FromQuery] int? dimensionId, CancellationToken ct)
    {
        var q = _db.Questions.Include(x => x.Answers).AsQueryable();
        if (subjectId.HasValue) q = q.Where(x => x.SubjectId == subjectId);
        if (dimensionId.HasValue) q = q.Where(x => x.DimensionId == dimensionId);

        var list = await q
            .OrderBy(x => x.Id)
            .Select(x => new QuestionAdminDto(x.Id, x.SubjectId, x.DimensionId, x.Content, x.Explanation, x.Level))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var q = await _db.Questions.Include(x => x.Answers)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (q == null) return NotFound();
        var answers = q.Answers.OrderBy(a => a.OrderIndex).Select(a => new AnswerAdminDto(a.Id, a.QuestionId, a.Content, a.IsCorrect, a.OrderIndex)).ToList();
        return Ok(new QuestionWithAnswersAdminDto(q.Id, q.SubjectId, q.DimensionId, q.Content, q.Explanation, q.Level, answers));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateQuestionRequest req, CancellationToken ct)
    {
        var q = new Domain.Entities.Question
        {
            SubjectId = req.SubjectId,
            DimensionId = req.DimensionId,
            Content = req.Content,
            Explanation = req.Explanation,
            Level = req.Level
        };
        _db.Questions.Add(q);
        await _db.SaveChangesAsync(ct);
        foreach (var a in req.Answers.OrderBy(x => x.OrderIndex))
        {
            _db.Answers.Add(new Domain.Entities.Answer { QuestionId = q.Id, Content = a.Content, IsCorrect = a.IsCorrect, OrderIndex = a.OrderIndex });
        }
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = q.Id }, new { id = q.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateQuestionRequest req, CancellationToken ct)
    {
        var q = await _db.Questions.FindAsync(new object[] { id }, ct);
        if (q == null) return NotFound();
        q.DimensionId = req.DimensionId;
        q.Content = req.Content;
        q.Explanation = req.Explanation;
        q.Level = req.Level;
        if (req.Answers != null)
        {
            var existing = await _db.Answers.Where(a => a.QuestionId == id).ToListAsync(ct);
            _db.Answers.RemoveRange(existing);
            int idx = 0;
            foreach (var a in req.Answers.OrderBy(x => x.OrderIndex))
            {
                _db.Answers.Add(new Domain.Entities.Answer { QuestionId = id, Content = a.Content, IsCorrect = a.IsCorrect, OrderIndex = a.OrderIndex });
                idx++;
            }
        }
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

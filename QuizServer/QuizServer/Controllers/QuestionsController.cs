using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;
using QuizServer.Domain.Entities;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Expert")]
public class QuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public QuestionsController(ApplicationDbContext db) => _db = db;

    public class ImportQuestionsForm
    {
        public IFormFile File { get; set; } = null!;
    }

    [HttpGet]
    public async Task<IActionResult> GetList(
        [FromQuery] int? subjectId,
        [FromQuery] int? dimensionId,
        [FromQuery] QuestionLevel? level,
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken ct)
    {
        var query = _db.Questions.Include(x => x.Answers).AsQueryable();
        if (subjectId.HasValue) query = query.Where(x => x.SubjectId == subjectId);
        if (dimensionId.HasValue) query = query.Where(x => x.DimensionId == dimensionId);
        if (level.HasValue) query = query.Where(x => x.Level == level);
        if (!string.IsNullOrEmpty(status)) query = query.Where(x => x.Status == status);
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(x => x.Content.Contains(search));

        var list = await query
            .OrderBy(x => x.Id)
            .Select(x => new QuestionAdminDto(x.Id, x.SubjectId, x.DimensionId, x.Content, x.Explanation, x.Level, x.Status))
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
        return Ok(new QuestionWithAnswersAdminDto(q.Id, q.SubjectId, q.DimensionId, q.Content, q.Explanation, q.Level, q.Status, answers));
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
            Level = req.Level,
            Status = "Active"
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
        q.Status = req.Status;
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

    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Import([FromForm] ImportQuestionsForm form, [FromQuery] int subjectId, CancellationToken ct)
    {
        var file = form.File;
        if (file.Length == 0) return BadRequest("File rỗng.");
        if (subjectId <= 0) return BadRequest("subjectId không hợp lệ.");

        var errors = new List<string>();
        int total = 0, success = 0, failed = 0;

        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);
        string? line;
        int row = 0;
        while ((line = await reader.ReadLineAsync(ct)) != null)
        {
            row++;
            if (row == 1 && line.Contains("Content", StringComparison.OrdinalIgnoreCase))
                continue; // header
            if (string.IsNullOrWhiteSpace(line)) continue;
            total++;

            // CSV format:
            // Content,Explanation,Level(Easy|Medium|Hard),Status,DimensionId(optional),A1,A2,A3,A4,CorrectIndex(1-4)
            var cols = line.Split(',');
            if (cols.Length < 9)
            {
                failed++;
                errors.Add($"Row {row}: thiếu cột (cần >=9).");
                continue;
            }

            try
            {
                var content = cols[0].Trim();
                var explanation = cols[1].Trim();
                var levelStr = cols[2].Trim();
                var status = cols[3].Trim();
                var dimStr = cols[4].Trim();
                var a1 = cols[5].Trim();
                var a2 = cols[6].Trim();
                var a3 = cols[7].Trim();
                var a4 = cols[8].Trim();
                var correctIdx = cols.Length >= 10 ? int.Parse(cols[9].Trim()) : 1;

                if (string.IsNullOrWhiteSpace(content)) throw new Exception("Content rỗng");

                var level = Enum.Parse<QuestionLevel>(levelStr, ignoreCase: true);
                int? dimId = int.TryParse(dimStr, out var di) ? di : null;

                var qn = new Domain.Entities.Question
                {
                    SubjectId = subjectId,
                    DimensionId = dimId,
                    Content = content,
                    Explanation = string.IsNullOrWhiteSpace(explanation) ? null : explanation,
                    Level = level,
                    Status = string.IsNullOrWhiteSpace(status) ? "Active" : status
                };
                _db.Questions.Add(qn);
                await _db.SaveChangesAsync(ct);

                var answers = new[]
                {
                    new Domain.Entities.Answer { QuestionId = qn.Id, Content = a1, IsCorrect = correctIdx == 1, OrderIndex = 1 },
                    new Domain.Entities.Answer { QuestionId = qn.Id, Content = a2, IsCorrect = correctIdx == 2, OrderIndex = 2 },
                    new Domain.Entities.Answer { QuestionId = qn.Id, Content = a3, IsCorrect = correctIdx == 3, OrderIndex = 3 },
                    new Domain.Entities.Answer { QuestionId = qn.Id, Content = a4, IsCorrect = correctIdx == 4, OrderIndex = 4 },
                };
                _db.Answers.AddRange(answers);
                await _db.SaveChangesAsync(ct);
                success++;
            }
            catch (Exception ex)
            {
                failed++;
                errors.Add($"Row {row}: {ex.Message}");
            }
        }

        return Ok(new ImportQuestionsResult(total, success, failed, errors));
    }
}

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizServer.Application.DTOs;
using QuizServer.Application.Services;
using QuizServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using QuizServer.Domain.Entities;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;
    private readonly ApplicationDbContext _db;

    public QuizController(IQuizService quizService, ApplicationDbContext db)
    {
        _quizService = quizService;
        _db = db;
    }

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    [HttpPost("start")]
    public async Task<IActionResult> GetQuiz([FromBody] GetQuizRequest request, CancellationToken ct)
    {
        try
        {
            var quiz = await _quizService.GetQuizAsync(UserId, request, ct);
            if (quiz == null)
                return BadRequest("Ban chua dang ky mon nay hoac goi da het han. Vui long dang ky truoc khi luyen tap.");
            return Ok(quiz);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizRequest request, CancellationToken ct)
    {
        var result = await _quizService.SubmitQuizAsync(UserId, request, ct);
        return result == null ? BadRequest() : Ok(result);
    }

    [HttpGet("result/{quizResultId:int}")]
    public async Task<IActionResult> GetResult(int quizResultId, CancellationToken ct)
    {
        var detail = await _quizService.GetQuizResultDetailAsync(UserId, quizResultId, ct);
        return detail == null ? NotFound() : Ok(detail);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] int? subjectId, [FromQuery] QuizType? type, CancellationToken ct)
    {
        var q = _db.Quizzes
            .Where(x => x.UserId == UserId)
            .AsQueryable();
        if (subjectId.HasValue) q = q.Where(x => x.SubjectId == subjectId);
        if (type.HasValue) q = q.Where(x => x.Type == type);

        var list = await q
            .OrderByDescending(x => x.StartTime)
            .Select(x => new QuizAttemptDto(
                x.Id,
                x.SubjectId,
                x.QuizTemplateId,
                x.Type,
                x.StartTime,
                x.DurationMinutes,
                x.QuizResults.Select(r => (int?)r.Id).FirstOrDefault(),
                x.QuizResults.Select(r => (decimal?)r.ScorePercent).FirstOrDefault(),
                x.QuizResults.Select(r => (DateTime?)r.SubmittedAt).FirstOrDefault()
            ))
            .ToListAsync(ct);

        return Ok(list);
    }
}

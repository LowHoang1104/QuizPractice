using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizServer.Application.DTOs;
using QuizServer.Application.Services;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService) => _quizService = quizService;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    [HttpPost("start")]
    public async Task<IActionResult> GetQuiz([FromBody] GetQuizRequest request, CancellationToken ct)
    {
        var quiz = await _quizService.GetQuizAsync(UserId, request, ct);
        if (quiz == null)
            return BadRequest("Bạn chưa đăng ký môn này hoặc gói đã hết hạn. Vui lòng đăng ký trước khi luyện tập.");
        return Ok(quiz);
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
}

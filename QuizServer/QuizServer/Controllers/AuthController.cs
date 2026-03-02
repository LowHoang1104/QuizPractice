using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuizServer.Application.DTOs;
using QuizServer.Application.Services;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);
        return result == null ? Unauthorized() : Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var result = await _authService.RegisterAsync(request, ct);
        return result == null ? BadRequest("Email đã tồn tại.") : Ok(result);
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request, CancellationToken ct)
    {
        var result = await _authService.GoogleLoginAsync(request, ct);
        return result == null ? Unauthorized() : Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { User.Identity?.Name });

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var profile = await _authService.GetProfileAsync(userId, ct);
        return profile == null ? NotFound() : Ok(profile);
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request, CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var ok = await _authService.UpdateProfileAsync(userId, request, ct);
        return ok ? Ok() : BadRequest();
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var ok = await _authService.ChangePasswordAsync(userId, request, ct);
        return ok ? Ok() : BadRequest("Mật khẩu hiện tại không đúng.");
    }
}

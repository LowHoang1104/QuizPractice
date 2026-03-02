namespace QuizServer.Application.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Email, string Password, string FullName, string? Gender = null, string? Mobile = null);

public record GoogleLoginRequest(string IdToken);

public record AuthResponse(string Token, string Email, string FullName, string Role, int UserId);

public record UserProfileDto(int Id, string Email, string FullName, string? Gender, string? Mobile, string? AvatarUrl, string Role);

public record UpdateProfileRequest(string FullName, string? Gender, string? Mobile);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

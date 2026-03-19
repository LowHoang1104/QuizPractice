using QuizServer.Application.DTOs;

namespace QuizServer.Application.Services;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthResponse?> GoogleLoginAsync(GoogleLoginRequest request, CancellationToken ct = default);
    Task<UserProfileDto?> GetProfileAsync(int userId, CancellationToken ct = default);
    Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequest request, CancellationToken ct = default);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request, CancellationToken ct = default);
    Task<ForgotPasswordResponse?> CreatePasswordResetTokenAsync(ForgotPasswordRequest request, CancellationToken ct = default);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken ct = default);
}

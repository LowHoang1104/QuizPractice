using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QuizServer.Application.DTOs;
using QuizServer.Domain.Entities;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Application.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly JwtSettings _jwt;

    public AuthService(ApplicationDbContext db, IOptions<JwtSettings> jwt)
    {
        _db = db;
        _jwt = jwt.Value;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email, ct);
        if (user?.PasswordHash == null) return null;
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) return null;
        return BuildResponse(user);
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email, ct))
            return null;
        var customerRoleId = await _db.Roles.Where(r => r.Name == "Customer").Select(r => r.Id).FirstAsync(ct);
        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Gender = request.Gender,
            Mobile = request.Mobile,
            RoleId = customerRoleId,
            CreatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
        await _db.Entry(user).Reference(u => u.Role).LoadAsync(ct);
        return BuildResponse(user);
    }

    public async Task<AuthResponse?> GoogleLoginAsync(GoogleLoginRequest request, CancellationToken ct = default)
    {
        try
        {
            var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(request.IdToken);
            var email = payload.Email;
            var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email || u.GoogleId == payload.Subject, ct);
            if (user != null)
            {
                if (user.GoogleId == null) { user.GoogleId = payload.Subject; user.AvatarUrl = payload.Picture; await _db.SaveChangesAsync(ct); }
                return BuildResponse(user);
            }
            var customerRoleId = await _db.Roles.Where(r => r.Name == "Customer").Select(r => r.Id).FirstAsync(ct);
            user = new User
            {
                Email = email,
                FullName = payload.Name ?? email,
                GoogleId = payload.Subject,
                AvatarUrl = payload.Picture,
                RoleId = customerRoleId,
                CreatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);
            await _db.Entry(user).Reference(u => u.Role).LoadAsync(ct);
            return BuildResponse(user);
        }
        catch { return null; }
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId, CancellationToken ct = default)
    {
        var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId, ct);
        return user == null ? null : new UserProfileDto(user.Id, user.Email, user.FullName, user.Gender, user.Mobile, user.AvatarUrl, user.Role.Name);
    }

    public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null) return false;
        user.FullName = request.FullName;
        user.Gender = request.Gender;
        user.Mobile = request.Mobile;
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user?.PasswordHash == null) return false;
        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash)) return false;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    private AuthResponse BuildResponse(User user)
    {
        var token = GenerateJwt(user);
        return new AuthResponse(token, user.Email, user.FullName, user.Role.Name, user.Id);
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.Name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var token = new JwtSecurityToken(
            _jwt.Issuer,
            _jwt.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_jwt.ExpiryMinutes),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class JwtSettings
{
    public string Key { get; set; } = "";
    public string Issuer { get; set; } = "";
    public string Audience { get; set; } = "";
    public int ExpiryMinutes { get; set; } = 60;
}

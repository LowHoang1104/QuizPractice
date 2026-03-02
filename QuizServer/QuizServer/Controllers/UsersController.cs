using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public UsersController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] string? role, [FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.Users.Include(u => u.Role).AsQueryable();
        if (!string.IsNullOrEmpty(role)) q = q.Where(u => u.Role.Name == role);
        if (!string.IsNullOrEmpty(status)) q = q.Where(u => u.Status == status);

        var list = await q
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserListDto(u.Id, u.Email, u.FullName, u.Role.Name, u.Status, u.CreatedAt))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var u = await _db.Users.Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u == null) return NotFound();
        return Ok(new UserDetailDto(u.Id, u.Email, u.FullName, u.Gender, u.Mobile, u.AvatarUrl, u.RoleId, u.Role.Name, u.Status, u.CreatedAt));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest req, CancellationToken ct)
    {
        if (await _db.Users.AnyAsync(x => x.Email == req.Email, ct))
            return BadRequest("Email đã tồn tại.");
        var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        var user = new Domain.Entities.User
        {
            Email = req.Email,
            PasswordHash = hash,
            FullName = req.FullName,
            Gender = req.Gender,
            Mobile = req.Mobile,
            RoleId = req.RoleId,
            Status = "Active"
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, new { id = user.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync(new object[] { id }, ct);
        if (user == null) return NotFound();
        user.FullName = req.FullName;
        user.Gender = req.Gender;
        user.Mobile = req.Mobile;
        user.RoleId = req.RoleId;
        user.Status = req.Status;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var user = await _db.Users.FindAsync(new object[] { id }, ct);
        if (user == null) return NotFound();
        _db.Users.Remove(user);
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

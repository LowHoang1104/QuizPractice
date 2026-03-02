using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public PostsController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.Posts.AsQueryable();
        if (!string.IsNullOrEmpty(status)) q = q.Where(p => p.Status == status);
        var list = await q
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDto(p.Id, p.Title, p.BriefInfo, p.Content, p.Thumbnail, p.Category, p.IsFeatured, p.Status, p.CreatedAt))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var p = await _db.Posts.FindAsync(new object[] { id }, ct);
        if (p == null) return NotFound();
        return Ok(new PostDto(p.Id, p.Title, p.BriefInfo, p.Content, p.Thumbnail, p.Category, p.IsFeatured, p.Status, p.CreatedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Create([FromBody] CreatePostRequest req, CancellationToken ct)
    {
        var p = new Domain.Entities.Post
        {
            Title = req.Title,
            BriefInfo = req.BriefInfo,
            Content = req.Content,
            Thumbnail = req.Thumbnail,
            Category = req.Category,
            IsFeatured = req.IsFeatured,
            Status = "Active"
        };
        _db.Posts.Add(p);
        await _db.SaveChangesAsync(ct);
        return CreatedAtAction(nameof(GetById), new { id = p.Id }, new { id = p.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePostRequest req, CancellationToken ct)
    {
        var p = await _db.Posts.FindAsync(new object[] { id }, ct);
        if (p == null) return NotFound();
        p.Title = req.Title;
        p.BriefInfo = req.BriefInfo;
        p.Content = req.Content;
        p.Thumbnail = req.Thumbnail;
        p.Category = req.Category;
        p.IsFeatured = req.IsFeatured;
        p.Status = req.Status;
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return Ok();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Marketing")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var p = await _db.Posts.FindAsync(new object[] { id }, ct);
        if (p == null) return NotFound();
        _db.Posts.Remove(p);
        await _db.SaveChangesAsync(ct);
        return Ok();
    }
}

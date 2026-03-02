using Microsoft.EntityFrameworkCore;
using QuizServer.Application.DTOs;
using QuizServer.Domain.Entities;
using QuizServer.Infrastructure.Data;

namespace QuizServer.Application.Services;

public class QuizService : IQuizService
{
    private readonly ApplicationDbContext _db;

    public QuizService(ApplicationDbContext db) => _db = db;

    public async Task<QuizDto?> GetQuizAsync(int userId, GetQuizRequest request, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var hasValidRegistration = await _db.SubjectRegistrations
            .AnyAsync(r => r.UserId == userId && r.SubjectId == request.SubjectId
                && r.Status == "Paid" && r.ValidFrom <= now && r.ValidTo >= now, ct);
        if (!hasValidRegistration)
            return null;

        var allIds = await _db.Questions
            .Where(q => q.SubjectId == request.SubjectId)
            .Select(q => q.Id)
            .ToListAsync(ct);
        var questionIds = allIds.OrderBy(_ => Guid.NewGuid()).Take(request.QuestionCount).ToList();
        if (questionIds.Count == 0) return null;

        var quiz = new Quiz
        {
            UserId = userId,
            SubjectId = request.SubjectId,
            Type = request.Type,
            StartTime = DateTime.UtcNow,
            DurationMinutes = request.QuestionCount
        };
        _db.Quizzes.Add(quiz);
        await _db.SaveChangesAsync(ct);

        var questions = await _db.Questions
            .Include(q => q.Answers.OrderBy(a => a.OrderIndex))
            .Where(q => questionIds.Contains(q.Id))
            .ToListAsync(ct);
        questions = questions.OrderBy(q => questionIds.IndexOf(q.Id)).ToList();

        var questionDtos = questions.Select(q => new QuestionDto(
            q.Id,
            q.Content,
            null,
            q.Level.ToString(),
            q.Answers.Select(a => new AnswerOptionDto(a.Id, a.Content)).ToList()
        )).ToList();

        return new QuizDto(quiz.Id, quiz.DurationMinutes, questionDtos);
    }

    public async Task<QuizResultDto?> SubmitQuizAsync(int userId, SubmitQuizRequest request, CancellationToken ct = default)
    {
        var quiz = await _db.Quizzes
            .Include(q => q.QuizResults)
            .FirstOrDefaultAsync(q => q.Id == request.QuizId && q.UserId == userId, ct);
        if (quiz == null) return null;
        if (quiz.QuizResults.Any()) return null;

        var questionIds = request.Answers.Select(x => x.QuestionId).Distinct().ToList();
        var correctAnswers = await _db.Answers
            .Where(a => questionIds.Contains(a.QuestionId) && a.IsCorrect)
            .Select(a => new { a.QuestionId, a.Id })
            .ToDictionaryAsync(a => a.QuestionId, a => a.Id, ct);

        int correct = 0;
        var userAnswers = new List<UserAnswer>();
        foreach (var a in request.Answers)
        {
            var isCorrect = correctAnswers.TryGetValue(a.QuestionId, out var correctId) && correctId == a.AnswerId;
            if (isCorrect) correct++;
            userAnswers.Add(new UserAnswer
            {
                QuizResultId = 0,
                QuestionId = a.QuestionId,
                AnswerId = a.AnswerId,
                IsCorrect = isCorrect
            });
        }

        int total = request.Answers.Count;
        var scorePercent = total > 0 ? Math.Round((decimal)correct / total * 100, 2) : 0;

        var result = new QuizResult
        {
            QuizId = quiz.Id,
            UserId = userId,
            ScorePercent = scorePercent,
            CorrectCount = correct,
            TotalCount = total,
            SubmittedAt = DateTime.UtcNow
        };
        _db.QuizResults.Add(result);
        await _db.SaveChangesAsync(ct);

        foreach (var ua in userAnswers)
        {
            ua.QuizResultId = result.Id;
            _db.UserAnswers.Add(ua);
        }
        await _db.SaveChangesAsync(ct);

        return new QuizResultDto(result.Id, result.ScorePercent, result.CorrectCount, result.TotalCount, result.SubmittedAt);
    }

    public async Task<QuizResultDetailDto?> GetQuizResultDetailAsync(int userId, int quizResultId, CancellationToken ct = default)
    {
        var result = await _db.QuizResults
            .Include(r => r.UserAnswers).ThenInclude(ua => ua.Question).ThenInclude(q => q!.Answers.OrderBy(x => x.OrderIndex))
            .Include(r => r.UserAnswers).ThenInclude(ua => ua.Answer)
            .FirstOrDefaultAsync(r => r.Id == quizResultId && r.UserId == userId, ct);
        if (result == null) return null;

        var correctAnswerIds = await _db.Answers
            .Where(a => result.UserAnswers.Select(ua => ua.QuestionId).Contains(a.QuestionId) && a.IsCorrect)
            .Select(a => new { a.QuestionId, a.Id })
            .ToDictionaryAsync(x => x.QuestionId, x => x.Id, ct);

        var reviews = result.UserAnswers.Select(ua => new QuestionReviewDto(
            ua.QuestionId,
            ua.Question.Content,
            ua.Question.Explanation,
            ua.AnswerId,
            correctAnswerIds.GetValueOrDefault(ua.QuestionId, 0),
            ua.IsCorrect,
            ua.Question.Answers.OrderBy(a => a.OrderIndex).Select(a => new AnswerOptionDto(a.Id, a.Content)).ToList()
        )).ToList();

        var resultDto = new QuizResultDto(result.Id, result.ScorePercent, result.CorrectCount, result.TotalCount, result.SubmittedAt);
        return new QuizResultDetailDto(resultDto, reviews);
    }
}

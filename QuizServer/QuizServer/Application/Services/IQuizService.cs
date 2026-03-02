using QuizServer.Application.DTOs;

namespace QuizServer.Application.Services;

public interface IQuizService
{
    Task<QuizDto?> GetQuizAsync(int userId, GetQuizRequest request, CancellationToken ct = default);
    Task<QuizResultDto?> SubmitQuizAsync(int userId, SubmitQuizRequest request, CancellationToken ct = default);
    Task<QuizResultDetailDto?> GetQuizResultDetailAsync(int userId, int quizResultId, CancellationToken ct = default);
}

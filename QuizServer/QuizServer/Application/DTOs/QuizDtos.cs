using QuizServer.Domain.Entities;

namespace QuizServer.Application.DTOs;

public record QuestionDto(int Id, string Content, string? Explanation, string Level, List<AnswerOptionDto> Answers);

public record AnswerOptionDto(int Id, string Content)
{
    /// <summary>Không gửi IsCorrect cho client khi làm bài.</summary>
}

public record GetQuizRequest(int SubjectId, int QuestionCount, QuizType Type);

public record QuizDto(int QuizId, int DurationMinutes, List<QuestionDto> Questions);

public record SubmitAnswerDto(int QuestionId, int AnswerId);

public record SubmitQuizRequest(int QuizId, List<SubmitAnswerDto> Answers);

public record QuizResultDto(int QuizResultId, decimal ScorePercent, int CorrectCount, int TotalCount, DateTime SubmittedAt);

public record QuizAttemptDto(int QuizId, int? SubjectId, int? QuizTemplateId, QuizType Type, DateTime StartTime, int DurationMinutes, int? QuizResultId, decimal? ScorePercent, DateTime? SubmittedAt);

public record QuestionReviewDto(int QuestionId, string Content, string? Explanation, int SelectedAnswerId, int CorrectAnswerId, bool IsCorrect, List<AnswerOptionDto> Answers);

public record QuizResultDetailDto(QuizResultDto Result, List<QuestionReviewDto> Reviews);

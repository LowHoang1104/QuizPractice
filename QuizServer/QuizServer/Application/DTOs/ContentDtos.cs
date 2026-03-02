using QuizServer.Domain.Entities;

namespace QuizServer.Application.DTOs;

// Subject (admin/expert)
public record SubjectAdminDto(int Id, string Name, string? Description, string? TagLine, string? Thumbnail, string? Category, bool IsFeatured, string Status, int? OwnerId, DateTime UpdatedAt);
public record CreateSubjectRequest(string Name, string? Description, string? TagLine, string? Thumbnail, string? Category, bool IsFeatured, int? OwnerId);
public record UpdateSubjectRequest(string Name, string? Description, string? TagLine, string? Thumbnail, string? Category, bool IsFeatured, string Status, int? OwnerId);

// Dimension
public record DimensionDto(int Id, int SubjectId, string Type, string Name, string? Description);
public record CreateDimensionRequest(int SubjectId, string Type, string Name, string? Description);
public record UpdateDimensionRequest(string Type, string Name, string? Description);

// PricePackage
public record PricePackageDto(int Id, int SubjectId, string Name, decimal ListPrice, decimal SalePrice, int DurationMonths, string? Description, string Status);
public record CreatePricePackageRequest(int SubjectId, string Name, decimal ListPrice, decimal SalePrice, int DurationMonths, string? Description);
public record UpdatePricePackageRequest(string Name, decimal ListPrice, decimal SalePrice, int DurationMonths, string? Description, string Status);

// Question (admin/expert - distinct from QuizDtos.QuestionDto)
public record QuestionAdminDto(int Id, int SubjectId, int? DimensionId, string Content, string? Explanation, QuestionLevel Level);
public record QuestionWithAnswersAdminDto(int Id, int SubjectId, int? DimensionId, string Content, string? Explanation, QuestionLevel Level, List<AnswerAdminDto> Answers);
public record CreateQuestionRequest(int SubjectId, int? DimensionId, string Content, string? Explanation, QuestionLevel Level, List<CreateAnswerRequest> Answers);
public record UpdateQuestionRequest(int? DimensionId, string Content, string? Explanation, QuestionLevel Level, List<UpdateAnswerRequest>? Answers);
public record AnswerAdminDto(int Id, int QuestionId, string Content, bool IsCorrect, int OrderIndex);
public record CreateAnswerRequest(string Content, bool IsCorrect, int OrderIndex);
public record UpdateAnswerRequest(int? Id, string Content, bool IsCorrect, int OrderIndex);

// QuizTemplate
public record QuizTemplateDto(int Id, int SubjectId, string Name, QuestionLevel Level, int QuestionCount, int DurationMinutes, decimal PassRate, string Type);
public record CreateQuizTemplateRequest(int SubjectId, string Name, QuestionLevel Level, int QuestionCount, int DurationMinutes, decimal PassRate, string Type);
public record UpdateQuizTemplateRequest(string Name, QuestionLevel Level, int QuestionCount, int DurationMinutes, decimal PassRate, string Type);

// Lesson
public record LessonDto(int Id, int SubjectId, string Name, string Type, string? VideoLink, string? HtmlContent, int? QuizTemplateId, int OrderIndex, string Status);
public record CreateLessonRequest(int SubjectId, string Name, string Type, string? VideoLink, string? HtmlContent, int? QuizTemplateId, int OrderIndex);
public record UpdateLessonRequest(string Name, string Type, string? VideoLink, string? HtmlContent, int? QuizTemplateId, int OrderIndex, string Status);

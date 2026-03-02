namespace QuizServer.Application.DTOs;

// Users
public record UserListDto(int Id, string Email, string FullName, string RoleName, string Status, DateTime CreatedAt);
public record UserDetailDto(int Id, string Email, string FullName, string? Gender, string? Mobile, string? AvatarUrl, int RoleId, string RoleName, string Status, DateTime CreatedAt);
public record CreateUserRequest(string Email, string Password, string FullName, string? Gender, string? Mobile, int RoleId);
public record UpdateUserRequest(string FullName, string? Gender, string? Mobile, int RoleId, string Status);

// Settings
public record SettingDto(int Id, string Type, string Value, int Order, string? Description, string Status);
public record CreateSettingRequest(string Type, string Value, int Order, string? Description);
public record UpdateSettingRequest(string Type, string Value, int Order, string? Description, string Status);

// Posts
public record PostDto(int Id, string Title, string? BriefInfo, string? Content, string? Thumbnail, string? Category, bool IsFeatured, string Status, DateTime CreatedAt);
public record CreatePostRequest(string Title, string? BriefInfo, string? Content, string? Thumbnail, string? Category, bool IsFeatured);
public record UpdatePostRequest(string Title, string? BriefInfo, string? Content, string? Thumbnail, string? Category, bool IsFeatured, string Status);

// Sliders
public record SliderDto(int Id, string Title, string? ImageUrl, string? Backlink, string Status, string? Notes);
public record CreateSliderRequest(string Title, string? ImageUrl, string? Backlink, string? Notes);
public record UpdateSliderRequest(string Title, string? ImageUrl, string? Backlink, string Status, string? Notes);

// Registrations
public record RegistrationDto(int Id, int UserId, string UserEmail, string UserFullName, int SubjectId, string SubjectName, int PricePackageId, string PricePackageName, decimal TotalCost, string Status, DateTime ValidFrom, DateTime ValidTo, DateTime CreatedAt);
public record CreateRegistrationRequest(int UserId, int SubjectId, int PricePackageId, decimal TotalCost, DateTime ValidFrom, DateTime ValidTo, string? Notes);
public record UpdateRegistrationStatusRequest(string Status, string? Notes);

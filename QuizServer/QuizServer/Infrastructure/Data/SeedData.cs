using Microsoft.EntityFrameworkCore;
using QuizServer.Domain.Entities;

namespace QuizServer.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        var baseTime = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Roles
        var adminRole = new Role { Id = 1, Name = "Admin" };
        var expertRole = new Role { Id = 2, Name = "Expert" };
        var marketingRole = new Role { Id = 3, Name = "Marketing" };
        var saleRole = new Role { Id = 4, Name = "Sale" };
        var customerRole = new Role { Id = 5, Name = "Customer" };
        modelBuilder.Entity<Role>().HasData(adminRole, expertRole, marketingRole, saleRole, customerRole);

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("123456");
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Email = "admin@gmail.com", PasswordHash = passwordHash, FullName = "Administrator", RoleId = 1, Status = "Active", CreatedAt = baseTime },
            new User { Id = 2, Email = "expert@gmail.com", PasswordHash = passwordHash, FullName = "Expert User", RoleId = 2, Status = "Active", CreatedAt = baseTime },
            new User { Id = 3, Email = "marketing@gmail.com", PasswordHash = passwordHash, FullName = "Marketing User", RoleId = 3, Status = "Active", CreatedAt = baseTime },
            new User { Id = 4, Email = "sale@gmail.com", PasswordHash = passwordHash, FullName = "Sale User", RoleId = 4, Status = "Active", CreatedAt = baseTime },
            new User { Id = 5, Email = "customer@gmail.com", PasswordHash = passwordHash, FullName = "Sample Customer", RoleId = 5, Status = "Active", CreatedAt = baseTime }
        );

        // Subjects
        modelBuilder.Entity<Subject>().HasData(
            new Subject { Id = 1, Name = "Toán học", Description = "Môn Toán cao cấp", TagLine = "Ôn tập Toán hiệu quả", Category = "Khoa học tự nhiên", IsFeatured = true, Status = "Published", OwnerId = 2, UpdatedAt = baseTime },
            new Subject { Id = 2, Name = "Vật lý", Description = "Môn Vật lý đại cương", TagLine = "Luyện Vật lý từ cơ bản", Category = "Khoa học tự nhiên", IsFeatured = true, Status = "Published", OwnerId = 2, UpdatedAt = baseTime },
            new Subject { Id = 3, Name = "Hóa học", Description = "Môn Hóa học hữu cơ", TagLine = "Hóa học dễ hiểu", Category = "Khoa học tự nhiên", IsFeatured = false, Status = "Published", OwnerId = 2, UpdatedAt = baseTime }
        );

        // Dimensions (chủ đề/chương)
        modelBuilder.Entity<Dimension>().HasData(
            new Dimension { Id = 1, SubjectId = 1, Type = "Group", Name = "Đại số", Description = "Chương đại số" },
            new Dimension { Id = 2, SubjectId = 1, Type = "Group", Name = "Hình học", Description = "Chương hình học" },
            new Dimension { Id = 3, SubjectId = 2, Type = "Group", Name = "Cơ học", Description = "Chương cơ học" },
            new Dimension { Id = 4, SubjectId = 2, Type = "Group", Name = "Điện từ", Description = "Chương điện từ" },
            new Dimension { Id = 5, SubjectId = 3, Type = "Group", Name = "Hóa vô cơ", Description = "Chương hóa vô cơ" }
        );

        // PricePackages
        modelBuilder.Entity<PricePackage>().HasData(
            new PricePackage { Id = 1, SubjectId = 1, Name = "Gói 1 tháng", ListPrice = 100000, SalePrice = 80000, DurationMonths = 1, Description = "Truy cập 1 tháng", Status = "Active" },
            new PricePackage { Id = 2, SubjectId = 1, Name = "Gói 3 tháng", ListPrice = 250000, SalePrice = 200000, DurationMonths = 3, Description = "Truy cập 3 tháng - tiết kiệm 20%", Status = "Active" },
            new PricePackage { Id = 3, SubjectId = 2, Name = "Gói 1 tháng", ListPrice = 100000, SalePrice = 90000, DurationMonths = 1, Description = "Truy cập 1 tháng", Status = "Active" },
            new PricePackage { Id = 4, SubjectId = 3, Name = "Gói 1 tháng", ListPrice = 100000, SalePrice = 85000, DurationMonths = 1, Description = "Truy cập 1 tháng", Status = "Active" }
        );

        // QuizTemplates
        modelBuilder.Entity<QuizTemplate>().HasData(
            new QuizTemplate { Id = 1, SubjectId = 1, Name = "Đề thi thử Toán 15 câu", Level = QuestionLevel.Medium, QuestionCount = 15, DurationMinutes = 20, PassRate = 60, Type = "Simulation" },
            new QuizTemplate { Id = 2, SubjectId = 2, Name = "Đề thi thử Vật lý 20 câu", Level = QuestionLevel.Medium, QuestionCount = 20, DurationMinutes = 25, PassRate = 60, Type = "Simulation" },
            new QuizTemplate { Id = 3, SubjectId = 3, Name = "Bài tập Hóa 10 câu", Level = QuestionLevel.Easy, QuestionCount = 10, DurationMinutes = 15, PassRate = 70, Type = "LessonQuiz" }
        );

        // Questions
        var questions = new List<Question>();
        for (int s = 1; s <= 3; s++)
        {
            for (int i = 1; i <= 10; i++)
            {
                int id = (s - 1) * 10 + i;
                int? dimId = s == 1 && i <= 5 ? 1 : (s == 1 && i <= 10 ? 2 : (s == 2 && i <= 5 ? 3 : (s == 2 ? 4 : 5)));
                questions.Add(new Question
                {
                    Id = id,
                    SubjectId = s,
                    DimensionId = dimId,
                    Content = $"Câu hỏi mẫu {i} - Môn {s}",
                    Level = (QuestionLevel)((i - 1) % 3),
                    Explanation = $"Giải thích đáp án câu {i}"
                });
            }
        }
        modelBuilder.Entity<Question>().HasData(questions);

        // Answers
        var answers = new List<Answer>();
        int answerId = 1;
        foreach (var q in questions)
        {
            for (int a = 1; a <= 4; a++)
            {
                answers.Add(new Answer
                {
                    Id = answerId,
                    QuestionId = q.Id,
                    Content = $"Đáp án {a} - Câu {q.Id}",
                    IsCorrect = a == 1,
                    OrderIndex = a
                });
                answerId++;
            }
        }
        modelBuilder.Entity<Answer>().HasData(answers);

        // Lessons
        modelBuilder.Entity<Lesson>().HasData(
            new Lesson { Id = 1, SubjectId = 1, Name = "Bài 1: Số phức", Type = "Lesson", OrderIndex = 1, Status = "Active", QuizTemplateId = null },
            new Lesson { Id = 2, SubjectId = 1, Name = "Bài 2: Hàm số", Type = "Lesson", OrderIndex = 2, Status = "Active", QuizTemplateId = 1 },
            new Lesson { Id = 3, SubjectId = 2, Name = "Bài 1: Động học", Type = "Lesson", OrderIndex = 1, Status = "Active", QuizTemplateId = null },
            new Lesson { Id = 4, SubjectId = 2, Name = "Bài 2: Động lực học", Type = "Lesson", OrderIndex = 2, Status = "Active", QuizTemplateId = 2 },
            new Lesson { Id = 5, SubjectId = 3, Name = "Bài 1: Bảng tuần hoàn", Type = "Lesson", OrderIndex = 1, Status = "Active", QuizTemplateId = 3 }
        );

        // Posts
        modelBuilder.Entity<Post>().HasData(
            new Post { Id = 1, Title = "Giới thiệu hệ thống ôn tập", BriefInfo = "Hệ thống ôn tập trắc nghiệm trực tuyến", Content = "Nội dung bài viết...", Category = "Tin tức", IsFeatured = true, Status = "Active", CreatedAt = baseTime, UpdatedAt = baseTime },
            new Post { Id = 2, Title = "Lịch thi thử tháng 1", BriefInfo = "Lịch thi thử các môn", Content = "Nội dung...", Category = "Sự kiện", IsFeatured = false, Status = "Active", CreatedAt = baseTime, UpdatedAt = baseTime },
            new Post { Id = 3, Title = "Hướng dẫn sử dụng", BriefInfo = "Hướng dẫn chi tiết", Content = "Nội dung...", Category = "Hướng dẫn", IsFeatured = true, Status = "Active", CreatedAt = baseTime, UpdatedAt = baseTime }
        );

        // Sliders
        modelBuilder.Entity<Slider>().HasData(
            new Slider { Id = 1, Title = "Banner chào mừng", ImageUrl = "/images/banner1.jpg", Backlink = "/subjects", Status = "Active", Notes = "Banner chính" },
            new Slider { Id = 2, Title = "Khuyến mãi tháng 1", ImageUrl = "/images/banner2.jpg", Backlink = "/subjects", Status = "Active", Notes = "Khuyến mãi" }
        );

        // Settings
        modelBuilder.Entity<Setting>().HasData(
            new Setting { Id = 1, Type = "SiteName", Value = "Quiz Practicing System", Order = 1, Description = "Tên website", Status = "Active" },
            new Setting { Id = 2, Type = "ContactEmail", Value = "support@quiz.com", Order = 2, Description = "Email liên hệ", Status = "Active" },
            new Setting { Id = 3, Type = "ContactPhone", Value = "1900xxxx", Order = 3, Description = "Số điện thoại", Status = "Active" }
        );

        // SubjectRegistrations (customer 5 đăng ký môn 1, sale 4 xử lý)
        var validFrom = baseTime;
        var validTo = baseTime.AddMonths(1);
        modelBuilder.Entity<SubjectRegistration>().HasData(
            new SubjectRegistration { Id = 1, UserId = 5, SubjectId = 1, PricePackageId = 1, TotalCost = 80000, Status = "Paid", ValidFrom = validFrom, ValidTo = validTo, SaleId = 4, CreatedAt = baseTime },
            new SubjectRegistration { Id = 2, UserId = 5, SubjectId = 2, PricePackageId = 3, TotalCost = 90000, Status = "Submitted", ValidFrom = validFrom, ValidTo = validTo, SaleId = null, CreatedAt = baseTime }
        );
    }
}

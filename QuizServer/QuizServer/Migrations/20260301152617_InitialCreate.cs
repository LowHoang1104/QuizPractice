using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QuizServer.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    BriefInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Thumbnail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sliders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Backlink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sliders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Mobile = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    GoogleId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TagLine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Thumbnail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subjects_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Dimensions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dimensions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dimensions_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PricePackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ListPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SalePrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DurationMonths = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricePackages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricePackages_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    QuestionCount = table.Column<int>(type: "int", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    PassRate = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizTemplates_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    DimensionId = table.Column<int>(type: "int", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Explanation = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Level = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Dimensions_DimensionId",
                        column: x => x.DimensionId,
                        principalTable: "Dimensions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Questions_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubjectRegistrations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    PricePackageId = table.Column<int>(type: "int", nullable: false),
                    TotalCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SaleId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdatedBy = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectRegistrations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubjectRegistrations_PricePackages_PricePackageId",
                        column: x => x.PricePackageId,
                        principalTable: "PricePackages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubjectRegistrations_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubjectRegistrations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VideoLink = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HtmlContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuizTemplateId = table.Column<int>(type: "int", nullable: true),
                    OrderIndex = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_QuizTemplates_QuizTemplateId",
                        column: x => x.QuizTemplateId,
                        principalTable: "QuizTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Lessons_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quizzes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SubjectId = table.Column<int>(type: "int", nullable: true),
                    QuizTemplateId = table.Column<int>(type: "int", nullable: true),
                    Type = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizzes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Quizzes_QuizTemplates_QuizTemplateId",
                        column: x => x.QuizTemplateId,
                        principalTable: "QuizTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Quizzes_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quizzes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    OrderIndex = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Answers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ScorePercent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    CorrectCount = table.Column<int>(type: "int", nullable: false),
                    TotalCount = table.Column<int>(type: "int", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizResults_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizResults_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuizResultId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerId = table.Column<int>(type: "int", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAnswers_Answers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "Answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserAnswers_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserAnswers_QuizResults_QuizResultId",
                        column: x => x.QuizResultId,
                        principalTable: "QuizResults",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "BriefInfo", "Category", "Content", "CreatedAt", "IsFeatured", "Status", "Thumbnail", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Hệ thống ôn tập trắc nghiệm trực tuyến", "Tin tức", "Nội dung bài viết...", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "Active", null, "Giới thiệu hệ thống ôn tập", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Lịch thi thử các môn", "Sự kiện", "Nội dung...", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "Active", null, "Lịch thi thử tháng 1", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "Hướng dẫn chi tiết", "Hướng dẫn", "Nội dung...", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "Active", null, "Hướng dẫn sử dụng", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Expert" },
                    { 3, "Marketing" },
                    { 4, "Sale" },
                    { 5, "Customer" }
                });

            migrationBuilder.InsertData(
                table: "Settings",
                columns: new[] { "Id", "Description", "Order", "Status", "Type", "Value" },
                values: new object[,]
                {
                    { 1, "Tên website", 1, "Active", "SiteName", "Quiz Practicing System" },
                    { 2, "Email liên hệ", 2, "Active", "ContactEmail", "support@quiz.com" },
                    { 3, "Số điện thoại", 3, "Active", "ContactPhone", "1900xxxx" }
                });

            migrationBuilder.InsertData(
                table: "Sliders",
                columns: new[] { "Id", "Backlink", "ImageUrl", "Notes", "Status", "Title" },
                values: new object[,]
                {
                    { 1, "/subjects", "/images/banner1.jpg", "Banner chính", "Active", "Banner chào mừng" },
                    { 2, "/subjects", "/images/banner2.jpg", "Khuyến mãi", "Active", "Khuyến mãi tháng 1" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "Email", "FullName", "Gender", "GoogleId", "Mobile", "PasswordHash", "RoleId", "Status" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@gmail.com", "Administrator", null, null, null, "$2a$11$nTuecSCNv88haB9/Dh15WeSpIp/ya7AMvqINgAOQlSB.NBWoE6IYW", 1, "Active" },
                    { 2, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "expert@gmail.com", "Expert User", null, null, null, "$2a$11$nTuecSCNv88haB9/Dh15WeSpIp/ya7AMvqINgAOQlSB.NBWoE6IYW", 2, "Active" },
                    { 3, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "marketing@gmail.com", "Marketing User", null, null, null, "$2a$11$nTuecSCNv88haB9/Dh15WeSpIp/ya7AMvqINgAOQlSB.NBWoE6IYW", 3, "Active" },
                    { 4, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "sale@gmail.com", "Sale User", null, null, null, "$2a$11$nTuecSCNv88haB9/Dh15WeSpIp/ya7AMvqINgAOQlSB.NBWoE6IYW", 4, "Active" },
                    { 5, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "customer@gmail.com", "Sample Customer", null, null, null, "$2a$11$nTuecSCNv88haB9/Dh15WeSpIp/ya7AMvqINgAOQlSB.NBWoE6IYW", 5, "Active" }
                });

            migrationBuilder.InsertData(
                table: "Subjects",
                columns: new[] { "Id", "Category", "Description", "IsFeatured", "Name", "OwnerId", "Status", "TagLine", "Thumbnail", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Khoa học tự nhiên", "Môn Toán cao cấp", true, "Toán học", 2, "Published", "Ôn tập Toán hiệu quả", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Khoa học tự nhiên", "Môn Vật lý đại cương", true, "Vật lý", 2, "Published", "Luyện Vật lý từ cơ bản", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "Khoa học tự nhiên", "Môn Hóa học hữu cơ", false, "Hóa học", 2, "Published", "Hóa học dễ hiểu", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Dimensions",
                columns: new[] { "Id", "Description", "Name", "SubjectId", "Type" },
                values: new object[,]
                {
                    { 1, "Chương đại số", "Đại số", 1, "Group" },
                    { 2, "Chương hình học", "Hình học", 1, "Group" },
                    { 3, "Chương cơ học", "Cơ học", 2, "Group" },
                    { 4, "Chương điện từ", "Điện từ", 2, "Group" },
                    { 5, "Chương hóa vô cơ", "Hóa vô cơ", 3, "Group" }
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "Id", "HtmlContent", "Name", "OrderIndex", "QuizTemplateId", "Status", "SubjectId", "Type", "VideoLink" },
                values: new object[,]
                {
                    { 1, null, "Bài 1: Số phức", 1, null, "Active", 1, "Lesson", null },
                    { 3, null, "Bài 1: Động học", 1, null, "Active", 2, "Lesson", null }
                });

            migrationBuilder.InsertData(
                table: "PricePackages",
                columns: new[] { "Id", "Description", "DurationMonths", "ListPrice", "Name", "SalePrice", "Status", "SubjectId" },
                values: new object[,]
                {
                    { 1, "Truy cập 1 tháng", 1, 100000m, "Gói 1 tháng", 80000m, "Active", 1 },
                    { 2, "Truy cập 3 tháng - tiết kiệm 20%", 3, 250000m, "Gói 3 tháng", 200000m, "Active", 1 },
                    { 3, "Truy cập 1 tháng", 1, 100000m, "Gói 1 tháng", 90000m, "Active", 2 },
                    { 4, "Truy cập 1 tháng", 1, 100000m, "Gói 1 tháng", 85000m, "Active", 3 }
                });

            migrationBuilder.InsertData(
                table: "QuizTemplates",
                columns: new[] { "Id", "DurationMinutes", "Level", "Name", "PassRate", "QuestionCount", "SubjectId", "Type" },
                values: new object[,]
                {
                    { 1, 20, 1, "Đề thi thử Toán 15 câu", 60m, 15, 1, "Simulation" },
                    { 2, 25, 1, "Đề thi thử Vật lý 20 câu", 60m, 20, 2, "Simulation" },
                    { 3, 15, 0, "Bài tập Hóa 10 câu", 70m, 10, 3, "LessonQuiz" }
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "Id", "HtmlContent", "Name", "OrderIndex", "QuizTemplateId", "Status", "SubjectId", "Type", "VideoLink" },
                values: new object[,]
                {
                    { 2, null, "Bài 2: Hàm số", 2, 1, "Active", 1, "Lesson", null },
                    { 4, null, "Bài 2: Động lực học", 2, 2, "Active", 2, "Lesson", null },
                    { 5, null, "Bài 1: Bảng tuần hoàn", 1, 3, "Active", 3, "Lesson", null }
                });

            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Content", "DimensionId", "Explanation", "Level", "SubjectId" },
                values: new object[,]
                {
                    { 1, "Câu hỏi mẫu 1 - Môn 1", 1, "Giải thích đáp án câu 1", 0, 1 },
                    { 2, "Câu hỏi mẫu 2 - Môn 1", 1, "Giải thích đáp án câu 2", 1, 1 },
                    { 3, "Câu hỏi mẫu 3 - Môn 1", 1, "Giải thích đáp án câu 3", 2, 1 },
                    { 4, "Câu hỏi mẫu 4 - Môn 1", 1, "Giải thích đáp án câu 4", 0, 1 },
                    { 5, "Câu hỏi mẫu 5 - Môn 1", 1, "Giải thích đáp án câu 5", 1, 1 },
                    { 6, "Câu hỏi mẫu 6 - Môn 1", 2, "Giải thích đáp án câu 6", 2, 1 },
                    { 7, "Câu hỏi mẫu 7 - Môn 1", 2, "Giải thích đáp án câu 7", 0, 1 },
                    { 8, "Câu hỏi mẫu 8 - Môn 1", 2, "Giải thích đáp án câu 8", 1, 1 },
                    { 9, "Câu hỏi mẫu 9 - Môn 1", 2, "Giải thích đáp án câu 9", 2, 1 },
                    { 10, "Câu hỏi mẫu 10 - Môn 1", 2, "Giải thích đáp án câu 10", 0, 1 },
                    { 11, "Câu hỏi mẫu 1 - Môn 2", 3, "Giải thích đáp án câu 1", 0, 2 },
                    { 12, "Câu hỏi mẫu 2 - Môn 2", 3, "Giải thích đáp án câu 2", 1, 2 },
                    { 13, "Câu hỏi mẫu 3 - Môn 2", 3, "Giải thích đáp án câu 3", 2, 2 },
                    { 14, "Câu hỏi mẫu 4 - Môn 2", 3, "Giải thích đáp án câu 4", 0, 2 },
                    { 15, "Câu hỏi mẫu 5 - Môn 2", 3, "Giải thích đáp án câu 5", 1, 2 },
                    { 16, "Câu hỏi mẫu 6 - Môn 2", 4, "Giải thích đáp án câu 6", 2, 2 },
                    { 17, "Câu hỏi mẫu 7 - Môn 2", 4, "Giải thích đáp án câu 7", 0, 2 },
                    { 18, "Câu hỏi mẫu 8 - Môn 2", 4, "Giải thích đáp án câu 8", 1, 2 },
                    { 19, "Câu hỏi mẫu 9 - Môn 2", 4, "Giải thích đáp án câu 9", 2, 2 },
                    { 20, "Câu hỏi mẫu 10 - Môn 2", 4, "Giải thích đáp án câu 10", 0, 2 },
                    { 21, "Câu hỏi mẫu 1 - Môn 3", 5, "Giải thích đáp án câu 1", 0, 3 },
                    { 22, "Câu hỏi mẫu 2 - Môn 3", 5, "Giải thích đáp án câu 2", 1, 3 },
                    { 23, "Câu hỏi mẫu 3 - Môn 3", 5, "Giải thích đáp án câu 3", 2, 3 },
                    { 24, "Câu hỏi mẫu 4 - Môn 3", 5, "Giải thích đáp án câu 4", 0, 3 },
                    { 25, "Câu hỏi mẫu 5 - Môn 3", 5, "Giải thích đáp án câu 5", 1, 3 },
                    { 26, "Câu hỏi mẫu 6 - Môn 3", 5, "Giải thích đáp án câu 6", 2, 3 },
                    { 27, "Câu hỏi mẫu 7 - Môn 3", 5, "Giải thích đáp án câu 7", 0, 3 },
                    { 28, "Câu hỏi mẫu 8 - Môn 3", 5, "Giải thích đáp án câu 8", 1, 3 },
                    { 29, "Câu hỏi mẫu 9 - Môn 3", 5, "Giải thích đáp án câu 9", 2, 3 },
                    { 30, "Câu hỏi mẫu 10 - Môn 3", 5, "Giải thích đáp án câu 10", 0, 3 }
                });

            migrationBuilder.InsertData(
                table: "SubjectRegistrations",
                columns: new[] { "Id", "CreatedAt", "LastUpdatedBy", "Notes", "PricePackageId", "SaleId", "Status", "SubjectId", "TotalCost", "UserId", "ValidFrom", "ValidTo" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, 1, 4, "Paid", 1, 80000m, 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, 3, null, "Submitted", 2, 90000m, 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Answers",
                columns: new[] { "Id", "Content", "IsCorrect", "OrderIndex", "QuestionId" },
                values: new object[,]
                {
                    { 1, "Đáp án 1 - Câu 1", true, 1, 1 },
                    { 2, "Đáp án 2 - Câu 1", false, 2, 1 },
                    { 3, "Đáp án 3 - Câu 1", false, 3, 1 },
                    { 4, "Đáp án 4 - Câu 1", false, 4, 1 },
                    { 5, "Đáp án 1 - Câu 2", true, 1, 2 },
                    { 6, "Đáp án 2 - Câu 2", false, 2, 2 },
                    { 7, "Đáp án 3 - Câu 2", false, 3, 2 },
                    { 8, "Đáp án 4 - Câu 2", false, 4, 2 },
                    { 9, "Đáp án 1 - Câu 3", true, 1, 3 },
                    { 10, "Đáp án 2 - Câu 3", false, 2, 3 },
                    { 11, "Đáp án 3 - Câu 3", false, 3, 3 },
                    { 12, "Đáp án 4 - Câu 3", false, 4, 3 },
                    { 13, "Đáp án 1 - Câu 4", true, 1, 4 },
                    { 14, "Đáp án 2 - Câu 4", false, 2, 4 },
                    { 15, "Đáp án 3 - Câu 4", false, 3, 4 },
                    { 16, "Đáp án 4 - Câu 4", false, 4, 4 },
                    { 17, "Đáp án 1 - Câu 5", true, 1, 5 },
                    { 18, "Đáp án 2 - Câu 5", false, 2, 5 },
                    { 19, "Đáp án 3 - Câu 5", false, 3, 5 },
                    { 20, "Đáp án 4 - Câu 5", false, 4, 5 },
                    { 21, "Đáp án 1 - Câu 6", true, 1, 6 },
                    { 22, "Đáp án 2 - Câu 6", false, 2, 6 },
                    { 23, "Đáp án 3 - Câu 6", false, 3, 6 },
                    { 24, "Đáp án 4 - Câu 6", false, 4, 6 },
                    { 25, "Đáp án 1 - Câu 7", true, 1, 7 },
                    { 26, "Đáp án 2 - Câu 7", false, 2, 7 },
                    { 27, "Đáp án 3 - Câu 7", false, 3, 7 },
                    { 28, "Đáp án 4 - Câu 7", false, 4, 7 },
                    { 29, "Đáp án 1 - Câu 8", true, 1, 8 },
                    { 30, "Đáp án 2 - Câu 8", false, 2, 8 },
                    { 31, "Đáp án 3 - Câu 8", false, 3, 8 },
                    { 32, "Đáp án 4 - Câu 8", false, 4, 8 },
                    { 33, "Đáp án 1 - Câu 9", true, 1, 9 },
                    { 34, "Đáp án 2 - Câu 9", false, 2, 9 },
                    { 35, "Đáp án 3 - Câu 9", false, 3, 9 },
                    { 36, "Đáp án 4 - Câu 9", false, 4, 9 },
                    { 37, "Đáp án 1 - Câu 10", true, 1, 10 },
                    { 38, "Đáp án 2 - Câu 10", false, 2, 10 },
                    { 39, "Đáp án 3 - Câu 10", false, 3, 10 },
                    { 40, "Đáp án 4 - Câu 10", false, 4, 10 },
                    { 41, "Đáp án 1 - Câu 11", true, 1, 11 },
                    { 42, "Đáp án 2 - Câu 11", false, 2, 11 },
                    { 43, "Đáp án 3 - Câu 11", false, 3, 11 },
                    { 44, "Đáp án 4 - Câu 11", false, 4, 11 },
                    { 45, "Đáp án 1 - Câu 12", true, 1, 12 },
                    { 46, "Đáp án 2 - Câu 12", false, 2, 12 },
                    { 47, "Đáp án 3 - Câu 12", false, 3, 12 },
                    { 48, "Đáp án 4 - Câu 12", false, 4, 12 },
                    { 49, "Đáp án 1 - Câu 13", true, 1, 13 },
                    { 50, "Đáp án 2 - Câu 13", false, 2, 13 },
                    { 51, "Đáp án 3 - Câu 13", false, 3, 13 },
                    { 52, "Đáp án 4 - Câu 13", false, 4, 13 },
                    { 53, "Đáp án 1 - Câu 14", true, 1, 14 },
                    { 54, "Đáp án 2 - Câu 14", false, 2, 14 },
                    { 55, "Đáp án 3 - Câu 14", false, 3, 14 },
                    { 56, "Đáp án 4 - Câu 14", false, 4, 14 },
                    { 57, "Đáp án 1 - Câu 15", true, 1, 15 },
                    { 58, "Đáp án 2 - Câu 15", false, 2, 15 },
                    { 59, "Đáp án 3 - Câu 15", false, 3, 15 },
                    { 60, "Đáp án 4 - Câu 15", false, 4, 15 },
                    { 61, "Đáp án 1 - Câu 16", true, 1, 16 },
                    { 62, "Đáp án 2 - Câu 16", false, 2, 16 },
                    { 63, "Đáp án 3 - Câu 16", false, 3, 16 },
                    { 64, "Đáp án 4 - Câu 16", false, 4, 16 },
                    { 65, "Đáp án 1 - Câu 17", true, 1, 17 },
                    { 66, "Đáp án 2 - Câu 17", false, 2, 17 },
                    { 67, "Đáp án 3 - Câu 17", false, 3, 17 },
                    { 68, "Đáp án 4 - Câu 17", false, 4, 17 },
                    { 69, "Đáp án 1 - Câu 18", true, 1, 18 },
                    { 70, "Đáp án 2 - Câu 18", false, 2, 18 },
                    { 71, "Đáp án 3 - Câu 18", false, 3, 18 },
                    { 72, "Đáp án 4 - Câu 18", false, 4, 18 },
                    { 73, "Đáp án 1 - Câu 19", true, 1, 19 },
                    { 74, "Đáp án 2 - Câu 19", false, 2, 19 },
                    { 75, "Đáp án 3 - Câu 19", false, 3, 19 },
                    { 76, "Đáp án 4 - Câu 19", false, 4, 19 },
                    { 77, "Đáp án 1 - Câu 20", true, 1, 20 },
                    { 78, "Đáp án 2 - Câu 20", false, 2, 20 },
                    { 79, "Đáp án 3 - Câu 20", false, 3, 20 },
                    { 80, "Đáp án 4 - Câu 20", false, 4, 20 },
                    { 81, "Đáp án 1 - Câu 21", true, 1, 21 },
                    { 82, "Đáp án 2 - Câu 21", false, 2, 21 },
                    { 83, "Đáp án 3 - Câu 21", false, 3, 21 },
                    { 84, "Đáp án 4 - Câu 21", false, 4, 21 },
                    { 85, "Đáp án 1 - Câu 22", true, 1, 22 },
                    { 86, "Đáp án 2 - Câu 22", false, 2, 22 },
                    { 87, "Đáp án 3 - Câu 22", false, 3, 22 },
                    { 88, "Đáp án 4 - Câu 22", false, 4, 22 },
                    { 89, "Đáp án 1 - Câu 23", true, 1, 23 },
                    { 90, "Đáp án 2 - Câu 23", false, 2, 23 },
                    { 91, "Đáp án 3 - Câu 23", false, 3, 23 },
                    { 92, "Đáp án 4 - Câu 23", false, 4, 23 },
                    { 93, "Đáp án 1 - Câu 24", true, 1, 24 },
                    { 94, "Đáp án 2 - Câu 24", false, 2, 24 },
                    { 95, "Đáp án 3 - Câu 24", false, 3, 24 },
                    { 96, "Đáp án 4 - Câu 24", false, 4, 24 },
                    { 97, "Đáp án 1 - Câu 25", true, 1, 25 },
                    { 98, "Đáp án 2 - Câu 25", false, 2, 25 },
                    { 99, "Đáp án 3 - Câu 25", false, 3, 25 },
                    { 100, "Đáp án 4 - Câu 25", false, 4, 25 },
                    { 101, "Đáp án 1 - Câu 26", true, 1, 26 },
                    { 102, "Đáp án 2 - Câu 26", false, 2, 26 },
                    { 103, "Đáp án 3 - Câu 26", false, 3, 26 },
                    { 104, "Đáp án 4 - Câu 26", false, 4, 26 },
                    { 105, "Đáp án 1 - Câu 27", true, 1, 27 },
                    { 106, "Đáp án 2 - Câu 27", false, 2, 27 },
                    { 107, "Đáp án 3 - Câu 27", false, 3, 27 },
                    { 108, "Đáp án 4 - Câu 27", false, 4, 27 },
                    { 109, "Đáp án 1 - Câu 28", true, 1, 28 },
                    { 110, "Đáp án 2 - Câu 28", false, 2, 28 },
                    { 111, "Đáp án 3 - Câu 28", false, 3, 28 },
                    { 112, "Đáp án 4 - Câu 28", false, 4, 28 },
                    { 113, "Đáp án 1 - Câu 29", true, 1, 29 },
                    { 114, "Đáp án 2 - Câu 29", false, 2, 29 },
                    { 115, "Đáp án 3 - Câu 29", false, 3, 29 },
                    { 116, "Đáp án 4 - Câu 29", false, 4, 29 },
                    { 117, "Đáp án 1 - Câu 30", true, 1, 30 },
                    { 118, "Đáp án 2 - Câu 30", false, 2, 30 },
                    { 119, "Đáp án 3 - Câu 30", false, 3, 30 },
                    { 120, "Đáp án 4 - Câu 30", false, 4, 30 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_QuestionId",
                table: "Answers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Dimensions_SubjectId",
                table: "Dimensions",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_QuizTemplateId",
                table: "Lessons",
                column: "QuizTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SubjectId",
                table: "Lessons",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_PricePackages_SubjectId",
                table: "PricePackages",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_DimensionId",
                table: "Questions",
                column: "DimensionId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_SubjectId",
                table: "Questions",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_QuizId",
                table: "QuizResults",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizResults_UserId",
                table: "QuizResults",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizTemplates_SubjectId",
                table: "QuizTemplates",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_QuizTemplateId",
                table: "Quizzes",
                column: "QuizTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_SubjectId",
                table: "Quizzes",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_UserId",
                table: "Quizzes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectRegistrations_PricePackageId",
                table: "SubjectRegistrations",
                column: "PricePackageId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectRegistrations_SubjectId",
                table: "SubjectRegistrations",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectRegistrations_UserId",
                table: "SubjectRegistrations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_OwnerId",
                table: "Subjects",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAnswers_AnswerId",
                table: "UserAnswers",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAnswers_QuestionId",
                table: "UserAnswers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAnswers_QuizResultId",
                table: "UserAnswers",
                column: "QuizResultId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "Sliders");

            migrationBuilder.DropTable(
                name: "SubjectRegistrations");

            migrationBuilder.DropTable(
                name: "UserAnswers");

            migrationBuilder.DropTable(
                name: "PricePackages");

            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "QuizResults");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Quizzes");

            migrationBuilder.DropTable(
                name: "Dimensions");

            migrationBuilder.DropTable(
                name: "QuizTemplates");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}

using Microsoft.EntityFrameworkCore;
using QuizServer.Domain.Entities;

namespace QuizServer.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<PricePackage> PricePackages => Set<PricePackage>();
    public DbSet<Dimension> Dimensions => Set<Dimension>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizResult> QuizResults => Set<QuizResult>();
    public DbSet<UserAnswer> UserAnswers => Set<UserAnswer>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Slider> Sliders => Set<Slider>();
    public DbSet<Setting> Settings => Set<Setting>();
    public DbSet<SubjectRegistration> SubjectRegistrations => Set<SubjectRegistration>();
    public DbSet<QuizTemplate> QuizTemplates => Set<QuizTemplate>();
    public DbSet<Lesson> Lessons => Set<Lesson>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Role
        modelBuilder.Entity<Role>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(50);
        });

        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.PasswordHash).HasMaxLength(500);
            e.Property(x => x.FullName).HasMaxLength(200);
            e.Property(x => x.Gender).HasMaxLength(20);
            e.Property(x => x.Mobile).HasMaxLength(20);
            e.Property(x => x.GoogleId).HasMaxLength(100);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasOne(x => x.Role).WithMany(r => r.Users).HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Restrict);
        });

        // Subject
        modelBuilder.Entity<Subject>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.HasOne(x => x.Owner).WithMany().HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.SetNull);
        });

        // PricePackage
        modelBuilder.Entity<PricePackage>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.ListPrice).HasPrecision(18, 2);
            e.Property(x => x.SalePrice).HasPrecision(18, 2);
            e.HasOne(x => x.Subject).WithMany(s => s.PricePackages).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Cascade);
        });

        // Dimension
        modelBuilder.Entity<Dimension>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.HasOne(x => x.Subject).WithMany(s => s.Dimensions).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Cascade);
        });

        // Question - Restrict Subject để tránh multiple cascade paths (Subject->Questions vs Subject->Dimensions->Questions)
        modelBuilder.Entity<Question>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).HasMaxLength(2000);
            e.Property(x => x.Explanation).HasMaxLength(2000);
            e.HasOne(x => x.Subject).WithMany(s => s.Questions).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Dimension).WithMany(d => d.Questions).HasForeignKey(x => x.DimensionId).OnDelete(DeleteBehavior.SetNull);
        });

        // Answer
        modelBuilder.Entity<Answer>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).HasMaxLength(1000);
            e.HasOne(x => x.Question).WithMany(q => q.Answers).HasForeignKey(x => x.QuestionId).OnDelete(DeleteBehavior.Cascade);
        });

        // Quiz
        modelBuilder.Entity<Quiz>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany(u => u.Quizzes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Subject).WithMany(s => s.Quizzes).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.QuizTemplate).WithMany().HasForeignKey(x => x.QuizTemplateId).OnDelete(DeleteBehavior.SetNull);
        });

        // QuizResult
        modelBuilder.Entity<QuizResult>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.ScorePercent).HasPrecision(5, 2);
            e.HasOne(x => x.Quiz).WithMany(q => q.QuizResults).HasForeignKey(x => x.QuizId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany(u => u.QuizResults).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        // UserAnswer
        modelBuilder.Entity<UserAnswer>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.QuizResult).WithMany(r => r.UserAnswers).HasForeignKey(x => x.QuizResultId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Question).WithMany(q => q.UserAnswers).HasForeignKey(x => x.QuestionId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Answer).WithMany(a => a.UserAnswers).HasForeignKey(x => x.AnswerId).OnDelete(DeleteBehavior.Restrict);
        });

        // Post
        modelBuilder.Entity<Post>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(500);
        });

        // Slider
        modelBuilder.Entity<Slider>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(200);
        });

        // Setting
        modelBuilder.Entity<Setting>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Type).HasMaxLength(100);
            e.Property(x => x.Value).HasMaxLength(500);
        });

        // SubjectRegistration
        modelBuilder.Entity<SubjectRegistration>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.TotalCost).HasPrecision(18, 2);
            e.HasOne(x => x.User).WithMany(u => u.Registrations).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Subject).WithMany(s => s.Registrations).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.PricePackage).WithMany(p => p.Registrations).HasForeignKey(x => x.PricePackageId).OnDelete(DeleteBehavior.Restrict);
        });

        // QuizTemplate
        modelBuilder.Entity<QuizTemplate>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.PassRate).HasPrecision(5, 2);
            e.HasOne(x => x.Subject).WithMany(s => s.QuizTemplates).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Cascade);
        });

        // Lesson
        modelBuilder.Entity<Lesson>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(200);
            e.HasOne(x => x.Subject).WithMany(s => s.Lessons).HasForeignKey(x => x.SubjectId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.QuizTemplate).WithMany().HasForeignKey(x => x.QuizTemplateId).OnDelete(DeleteBehavior.SetNull);
        });

        SeedData.Seed(modelBuilder);
    }
}

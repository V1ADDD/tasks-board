using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Issue> Issues { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Project>(entity => {
            entity.ToTable("Projects");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(p => p.Code)
                .HasMaxLength(10)
                .IsRequired();
                
            entity.Property(p => p.OwnerId)
                .IsRequired();
        });

        builder.Entity<Issue>(entity => {
            entity.ToTable("Issues");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Title)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(p => p.Description)
                .HasMaxLength(2000);

            entity.Property(i => i.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(i => i.Priority)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.HasOne(i => i.Project)
                .WithMany(p => p.Issues)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Comment>(entity => {
            entity.ToTable("Comments");
            entity.HasKey(p => p.Id);

            entity.Property(p => p.Content)
                .IsRequired()
                .HasMaxLength(1000);
                
            entity.HasOne(c => c.Issue)
                .WithMany(i => i.Comments)
                .HasForeignKey(c => c.IssueId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
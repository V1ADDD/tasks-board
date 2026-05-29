using System;

namespace TaskFlow.Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid IssueId { get; set; }
    public string AuthorId { get; set; } = string.Empty;

    public Issue Issue { get; set; } = null!;
}
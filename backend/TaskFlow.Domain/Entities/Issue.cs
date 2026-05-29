using System;
using System.Collections.Generic;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Domain.Entities;

public class Issue
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public IssueStatus Status { get; set; } = IssueStatus.ToDo;
    public IssuePriority Priority { get; set; } = IssuePriority.Medium;

    public Guid ProjectId { get; set; }
    public string? AssigneeId { get; set; }

    public Project Project { get; set; } = null!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    
}
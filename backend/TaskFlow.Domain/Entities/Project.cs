using System;
using System.Collections.Generic;

namespace TaskFlow.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string ownerId { get; set; } = string.Empty;

    public ICollection<Issue> Issues { get; set; } = new List<Issue>();
}
using Microsoft.EntityFrameworkCore;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Project> Projects { get; }  
    DbSet<Issue> Issues { get; }   
    DbSet<Comment> Comments { get; }     

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
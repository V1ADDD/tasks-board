using MediatR;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Issues.Commands;

public record CreateIssueCommand(
    string Title,
    string Description,
    Guid ProjectId,
    IssuePriority Priority,
    string? AssigneeId) : IRequest<Guid>;

public class CreateIssueCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateIssueCommand, Guid>
{
    public async Task<Guid> Handle(CreateIssueCommand request, CancellationToken cancellationToken)
    {
        var issue = new Issue
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            Priority = request.Priority,
            AssigneeId = request.AssigneeId,
            Status = IssueStatus.ToDo
        };
        context.Issues.Add(issue);
        await context.SaveChangesAsync(cancellationToken);
        return issue.Id;
    }
}
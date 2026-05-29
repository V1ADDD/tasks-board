using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Issues.Commands;

public record UpdateIssueStatusCommand(
    Guid IssueId,
    IssueStatus Status
) : IRequest<bool>;

public class UpdateIssueStatusCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateIssueStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateIssueStatusCommand request, CancellationToken cancellationToken)
    {
        var issue = await context.Issues.SingleOrDefaultAsync(i => i.Id == request.IssueId, cancellationToken);
        if (issue == null) {
            return false;
        }
        issue.Status = request.Status;
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
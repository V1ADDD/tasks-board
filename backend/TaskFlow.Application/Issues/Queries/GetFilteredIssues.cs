using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Application.Common.Models;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Issues.Queries;

public record IssueDto(
    Guid Id,
    string Title,
    string Description,
    string Priority,
    string Status,
    string? AssigneeId,
    Guid ProjectId
);

public record GetFilteredIssuesQuery(
    Guid ProjectId,
    IssueStatus? Status,
    string? SearchTerm,
    int PageNumber = 1,
    int PageSize = 10
) : IRequest<PaginatedList<IssueDto>>;

public class GetFilteredIssuesQueryHandler(IApplicationDbContext context) : IRequestHandler<GetFilteredIssuesQuery, PaginatedList<IssueDto>>
{
    public async Task<PaginatedList<IssueDto>> Handle(GetFilteredIssuesQuery request, CancellationToken cancellationToken)
    {
        var query = context.Issues
            .Where(i => i.ProjectId == request.ProjectId);
        
        if (request.Status.HasValue) 
        {
            query = query.Where(i => i.Status == request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm)) 
        {
            query = query.Where(i => i.Title.Contains(request.SearchTerm) || i.Description.Contains(request.SearchTerm));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(i => i.Title)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new IssueDto(
                i.Id,
                i.Title,
                i.Description,
                i.Priority.ToString(),
                i.Status.ToString(),
                i.AssigneeId,
                i.ProjectId
            ))
            .ToListAsync(cancellationToken);

        return new PaginatedList<IssueDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
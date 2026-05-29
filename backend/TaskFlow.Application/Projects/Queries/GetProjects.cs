using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Common.Interfaces;

namespace TaskFlow.Application.Projects.Queries;

public record ProjectDto(Guid Id, string Name, string Code, string OwnerId);

public record GetProjectsQuery : IRequest<List<ProjectDto>>;

public class GetProjectsQueryHandler(IApplicationDbContext context) : IRequestHandler<GetProjectsQuery, List<ProjectDto>>
{
    public async Task<List<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        return await context.Projects.Select(p => new ProjectDto(p.Id, p.Name, p.Code, p.OwnerId))
            .ToListAsync(cancellationToken);
    }
}
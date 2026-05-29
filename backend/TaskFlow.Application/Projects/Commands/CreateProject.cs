using MediatR;
using TaskFlow.Application.Common.Interfaces;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.Projects.Commands;

public record CreateProjectCommand(string Name, string Code, string OwnerId) : IRequest<Guid>;

public class CreateProjectCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateProjectCommand, Guid>
{
    public async Task<Guid> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Code = request.Code,
            OwnerId = request.OwnerId
        };

        context.Projects.Add(project);
        await context.SaveChangesAsync(cancellationToken);
        return project.Id;
    }
}
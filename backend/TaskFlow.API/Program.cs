using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskFlow.Infrastructure.Data;
using dotenv.net;
using MediatR;
using TaskFlow.Application.Projects.Commands;
using TaskFlow.Application.Projects.Queries;
using TaskFlow.Application.Common.Interfaces;

DotEnv.Load(options: new DotEnvOptions(probeForEnv: true, probeLevelsToSearch: 6));

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(TaskFlow.Application.Projects.Commands.CreateProjectCommand).Assembly));

builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

builder.Services.AddIdentityCore<IdentityUser>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

//sign up
app.MapPost("/api/auth/register", async (RegisterRequest request, UserManager<IdentityUser> userManager) => {
    var user = new IdentityUser { UserName = request.Email, Email = request.Email };
    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded) {
        return Results.BadRequest(result.Errors);
    }
    return Results.Ok(new { Message = "User registered successfully" });
});

//sign in
app.MapPost("/api/auth/login", async (LoginRequest request, UserManager<IdentityUser> userManager, HttpContext context) => {
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null || !await userManager.CheckPasswordAsync(user, request.Password)) {
        return Results.Unauthorized();
    }
    
    var tokenHandler = new JwtSecurityTokenHandler();
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] 
        { 
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!)
        }),
        Expires = DateTime.UtcNow.AddMinutes(15),
        Issuer = jwtSettings["Issuer"],
        Audience = jwtSettings["Audience"],
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var accessToken = tokenHandler.WriteToken(token);
    
    var refreshToken = Guid.NewGuid().ToString();

    context.Response.Cookies.Append("X-Refresh-Token", refreshToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(7)
    });
    return Results.Ok(new { Token = accessToken, Email = user.Email });
});

var projectGroup = app.MapGroup("/api/projects").RequireAuthorization();

// get: /api/projects
projectGroup.MapGet("/", async (IMediator mediator) => {
    var query = new GetProjectsQuery();
    var result = await mediator.Send(query);
    return Results.Ok(result);
});

// post: /api/projects
projectGroup.MapPost("/", async (CreateProjectRequest request, IMediator mediator, ClaimsPrincipal user) => {
    var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId)) return Results.Unauthorized();

    var command = new CreateProjectCommand(
        request.Name,
        request.Code,
        userId
    );
    var projectId = await mediator.Send(command);

    return Results.Created($"/api/projects/{projectId}", new { Id = projectId });

});


app.Run();

public record CreateProjectRequest(string Name, string Code);
public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);

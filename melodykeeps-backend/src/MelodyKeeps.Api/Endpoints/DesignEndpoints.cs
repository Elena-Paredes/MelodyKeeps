using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MelodyKeeps.Domain.Entities;
using MelodyKeeps.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace MelodyKeeps.Api.Endpoints;

public record CreateDesignRequest(Guid SongId, DesignTemplate Template, DesignVariant Variant = DesignVariant.Dark);

public static class DesignEndpoints
{
    public static void MapDesignEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/designs").RequireAuthorization();

        group.MapPost("", async (CreateDesignRequest req, AppDbContext db, ClaimsPrincipal user, CancellationToken ct) =>
        {
            var songExists = await db.Songs.AnyAsync(s => s.Id == req.SongId, ct);
            if (!songExists)
                return Results.NotFound("song not found");

            var design = new Design
            {
                Id = Guid.NewGuid(),
                UserId = user.FindFirstValue(JwtRegisteredClaimNames.Sub)!,
                SongId = req.SongId,
                Template = req.Template,
                Variant = req.Variant
            };
            db.Designs.Add(design);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/designs/{design.Id}", design);
        });

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db, ClaimsPrincipal user, CancellationToken ct) =>
        {
            var (design, forbidden) = await FindOwnedDesignAsync(id, db, user, ct);
            if (design is null) return Results.NotFound();
            if (forbidden) return Results.Forbid();
            return Results.Ok(design);
        });

        group.MapGet("/{id:guid}/print", async (Guid id, AppDbContext db, ClaimsPrincipal user, PrintFileGenerator generator, CancellationToken ct) =>
        {
            var (design, forbidden) = await FindOwnedDesignAsync(id, db, user, ct);
            if (design is null) return Results.NotFound();
            if (forbidden) return Results.Forbid();

            var png = await generator.GenerateAsync(design, design.Song!, ct);
            return Results.File(png, "image/png");
        });
    }

    private static async Task<(Design? Design, bool Forbidden)> FindOwnedDesignAsync(
        Guid id, AppDbContext db, ClaimsPrincipal user, CancellationToken ct)
    {
        var design = await db.Designs.Include(d => d.Song).FirstOrDefaultAsync(d => d.Id == id, ct);
        if (design is null) return (null, false);
        var owns = design.UserId == user.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return (design, !owns);
    }
}

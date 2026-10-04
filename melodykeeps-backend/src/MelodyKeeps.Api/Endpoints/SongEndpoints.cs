using MelodyKeeps.Domain.Entities;
using MelodyKeeps.Infrastructure;

namespace MelodyKeeps.Api.Endpoints;

public record CreateSongRequest(string Title, string Artist, string? CoverUrl, string Link);

public static class SongEndpoints
{
    public static void MapSongEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/songs");

        group.MapGet("/search", async (string? q, SpotifyClient spotify, CancellationToken ct) =>
            string.IsNullOrWhiteSpace(q)
                ? Results.BadRequest("q is required")
                : Results.Ok(await spotify.SearchAsync(q, ct)));

        group.MapGet("/spotify/{trackId}", async (string trackId, SpotifyClient spotify, CancellationToken ct) =>
        {
            var track = await spotify.GetTrackAsync(trackId, ct);
            if (track == null) return Results.NotFound();

            return Results.Ok(new
            {
                title = track.Title,
                artist = track.Artist,
                coverUrl = track.CoverUrl,
                spotifyLink = track.SpotifyLink
            });
        });

        group.MapPost("", async (CreateSongRequest req, AppDbContext db, CancellationToken ct) =>
        {
            if (string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.Artist) || string.IsNullOrWhiteSpace(req.Link))
                return Results.BadRequest("title, artist and link are required");

            var song = new Song
            {
                Id = Guid.NewGuid(),
                Title = req.Title,
                Artist = req.Artist,
                CoverUrl = req.CoverUrl,
                Link = req.Link
            };
            db.Songs.Add(song);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/songs/{song.Id}", song);
        });
    }
}

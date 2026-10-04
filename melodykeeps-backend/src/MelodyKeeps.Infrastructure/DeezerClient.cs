using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace MelodyKeeps.Infrastructure;

public record SongSearchResult(string Title, string Artist, string CoverUrl, string SpotifyLink);

public class DeezerClient(HttpClient http)
{
    public async Task<List<SongSearchResult>> SearchAsync(string query, CancellationToken ct = default)
    {
        var response = await http.GetFromJsonAsync<DeezerSearchResponse>(
            $"search?q={Uri.EscapeDataString(query)}", ct);

        return response?.Data
            .Select(t => new SongSearchResult(t.Title, t.Artist.Name, t.Album.CoverMedium, SpotifySearchLink(t.Title, t.Artist.Name)))
            .ToList() ?? [];
    }

    // ponytail: search link, not the exact track - getting the real track link needs the Spotify API,
    // which we're deliberately not depending on. Upgrade if that constraint ever changes.
    private static string SpotifySearchLink(string title, string artist) =>
        $"https://open.spotify.com/search/{Uri.EscapeDataString($"{title} {artist}")}";

    private record DeezerSearchResponse([property: JsonPropertyName("data")] List<DeezerTrack> Data);
    private record DeezerTrack(
        [property: JsonPropertyName("title")] string Title,
        [property: JsonPropertyName("artist")] DeezerArtist Artist,
        [property: JsonPropertyName("album")] DeezerAlbum Album,
        [property: JsonPropertyName("link")] string Link);
    private record DeezerArtist([property: JsonPropertyName("name")] string Name);
    private record DeezerAlbum([property: JsonPropertyName("cover_medium")] string CoverMedium);
}

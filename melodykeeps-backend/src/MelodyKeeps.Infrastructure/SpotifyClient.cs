using System.Net.Http.Json;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace MelodyKeeps.Infrastructure;

public class SpotifyClient
{
    private readonly HttpClient http;
    private readonly string clientId;
    private readonly string clientSecret;
    private string? accessToken;
    private DateTime tokenExpiry;

    public SpotifyClient(HttpClient http, IConfiguration config)
    {
        this.http = http;
        clientId = config["Spotify:ClientId"] ?? throw new InvalidOperationException("Spotify:ClientId not configured");
        clientSecret = config["Spotify:ClientSecret"] ?? throw new InvalidOperationException("Spotify:ClientSecret not configured");
    }

    public async Task<List<SongSearchResult>> SearchAsync(string query, CancellationToken ct = default)
    {
        await EnsureTokenAsync(ct);
        Console.WriteLine($"Token: {accessToken?.Substring(0, 20)}...");

        var url = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(query)}&type=track&limit=10";
        Console.WriteLine($"URL: {url}");
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        var response = await http.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"Error {response.StatusCode}: {errorContent}");
            response.EnsureSuccessStatusCode();
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var result = System.Text.Json.JsonSerializer.Deserialize<SpotifySearchResponse>(json, options);

        return result?.Tracks?.Items
            .Select(t => new SongSearchResult(
                t.Name,
                string.Join(", ", t.Artists.Select(a => a.Name)),
                t.Album?.Images?.FirstOrDefault()?.Url ?? "",
                t.Uri))
            .ToList() ?? [];
    }

    public async Task<SongSearchResult?> GetTrackAsync(string trackId, CancellationToken ct = default)
    {
        await EnsureTokenAsync(ct);

        var url = $"https://api.spotify.com/v1/tracks/{trackId}";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
        var response = await http.SendAsync(request, ct);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(ct);
            Console.WriteLine($"[Spotify] GetTrackAsync error {response.StatusCode}: {errorContent}");
            return null;
        }

        var json = await response.Content.ReadAsStringAsync(ct);
        var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var track = System.Text.Json.JsonSerializer.Deserialize<TrackItem>(json, options);

        return track == null ? null : new SongSearchResult(
            track.Name,
            string.Join(", ", track.Artists.Select(a => a.Name)),
            track.Album?.Images?.FirstOrDefault()?.Url ?? "",
            track.Uri);
    }

    private async Task EnsureTokenAsync(CancellationToken ct)
    {
        if (!string.IsNullOrEmpty(accessToken) && DateTime.UtcNow < tokenExpiry)
            return;

        var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));
        var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token")
        {
            Content = new FormUrlEncodedContent(new[] { new KeyValuePair<string, string>("grant_type", "client_credentials") }),
            Headers = { { "Authorization", $"Basic {auth}" } }
        };

        var response = await http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
        var tokenData = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken: ct) ?? throw new InvalidOperationException("Failed to get token from Spotify");
        accessToken = tokenData.AccessToken;
        tokenExpiry = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn - 60);

        http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
    }

    private record TokenResponse(
        [property: JsonPropertyName("access_token")] string AccessToken,
        [property: JsonPropertyName("expires_in")] int ExpiresIn);

    private record SpotifySearchResponse([property: JsonPropertyName("tracks")] TrackList Tracks);
    private record TrackList([property: JsonPropertyName("items")] List<TrackItem> Items);
    private record TrackItem(
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("uri")] string Uri,
        [property: JsonPropertyName("artists")] List<Artist> Artists,
        [property: JsonPropertyName("album")] Album Album);
    private record Artist([property: JsonPropertyName("name")] string Name);
    private record Album([property: JsonPropertyName("images")] List<Image> Images);
    private record Image([property: JsonPropertyName("url")] string Url);
}

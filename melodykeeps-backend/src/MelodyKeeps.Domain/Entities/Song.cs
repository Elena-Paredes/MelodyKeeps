namespace MelodyKeeps.Domain.Entities;

public class Song
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Artist { get; set; }
    public string? CoverUrl { get; set; }
    public required string Link { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace MelodyKeeps.Domain.Entities;

public enum DesignTemplate
{
    Keychain,
    Sticker,
    Card
}

public enum DesignVariant
{
    Dark,
    Pastel
}

public class Design
{
    public Guid Id { get; set; }
    public required string UserId { get; set; }
    public Guid SongId { get; set; }
    public Song? Song { get; set; }
    public DesignTemplate Template { get; set; }
    public DesignVariant Variant { get; set; }
    public string? PrintFileUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

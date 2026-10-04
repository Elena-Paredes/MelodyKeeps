using MelodyKeeps.Domain.Entities;
using QRCoder;
using SkiaSharp;

namespace MelodyKeeps.Infrastructure;

public class PrintFileGenerator(HttpClient http)
{
    // ponytail: every template is a portrait rectangle (2:3-ish), matching a real phone
    // now-playing screen. Squares distorted the whole layout - never go back to 1:1.
    private static readonly Dictionary<DesignTemplate, (int Width, int Height)> Sizes = new()
    {
        [DesignTemplate.Keychain] = (400, 600),
        [DesignTemplate.Sticker] = (600, 900),
        [DesignTemplate.Card] = (800, 1200)
    };

    private static readonly Dictionary<DesignVariant, Theme> Themes = new()
    {
        [DesignVariant.Dark] = new Theme(
            Base: new SKColor(18, 16, 20),
            Text: SKColors.White,
            SubText: new SKColor(214, 200, 214, 180),
            TrackFaint: new SKColor(255, 255, 255, 60),
            Accent: new SKColor(236, 72, 153),
            ArtFallback: new SKColor(50, 40, 55),
            ButtonCenter: SKColors.White,
            PlayIcon: new SKColor(236, 72, 153)),
        [DesignVariant.Pastel] = new Theme(
            Base: new SKColor(250, 240, 250),
            Text: new SKColor(46, 26, 61),
            SubText: new SKColor(46, 26, 61, 160),
            TrackFaint: new SKColor(46, 26, 61, 40),
            Accent: new SKColor(236, 72, 153),
            ArtFallback: new SKColor(233, 216, 253),
            ButtonCenter: SKColors.White,
            PlayIcon: new SKColor(139, 92, 246)),
    };

    private static readonly SKTypeface BoldSans = SKTypeface.FromFamilyName(null, SKFontStyleWeight.Bold, SKFontStyleWidth.Normal, SKFontStyleSlant.Upright);
    private static readonly SKTypeface RegularSans = SKTypeface.FromFamilyName(null, SKFontStyleWeight.Normal, SKFontStyleWidth.Normal, SKFontStyleSlant.Upright);

    public async Task<byte[]> GenerateAsync(Design design, Song song, CancellationToken ct = default)
    {
        var (width, height) = Sizes[design.Template];
        var theme = Themes[design.Variant];
        var w = (float)width;
        var margin = w * 0.08f;
        var contentWidth = w - margin * 2;
        var isKeychain = design.Template == DesignTemplate.Keychain;

        using var bitmap = new SKBitmap(width, height);
        using var canvas = new SKCanvas(bitmap);
        canvas.Clear(SKColors.Transparent);

        var cornerRadius = w * 0.07f;
        var cardRect = new SKRoundRect(new SKRect(0, 0, width, height), cornerRadius);
        canvas.Save();
        canvas.ClipRoundRect(cardRect);
        canvas.Clear(theme.Base);

        // The keychain hole sits where the top bar would go, so skip the bar there instead of overlapping it.
        var artY = margin * 1.4f;
        if (!isKeychain)
        {
            DrawTopBar(canvas, w, margin, theme);
            artY = w * 0.16f;
        }
        else
        {
            artY = w * 0.22f;
        }

        var artSize = contentWidth;
        DrawAlbumArt(canvas, margin, artY, artSize, theme, await TryDownloadCoverAsync(song.CoverUrl, ct));

        var titleY = artY + artSize + w * 0.09f;
        using var titleFont = new SKFont(BoldSans, w * 0.065f);
        using var artistFont = new SKFont(RegularSans, w * 0.038f);
        using var textPaint = new SKPaint { Color = theme.Text, IsAntialias = true };
        using var subTextPaint = new SKPaint { Color = theme.SubText, IsAntialias = true };

        canvas.DrawText(song.Title, margin, titleY, SKTextAlign.Left, titleFont, textPaint);
        var artistY = titleY + artistFont.Size + w * 0.018f;
        canvas.DrawText(song.Artist, margin, artistY, SKTextAlign.Left, artistFont, subTextPaint);
        DrawHeart(canvas, w - margin - w * 0.016f, titleY - w * 0.018f, w * 0.016f, theme.PlayIcon);

        var progressY = artistY + w * 0.08f;
        var barHeight = w * 0.008f;
        DrawProgressBar(canvas, margin, progressY, contentWidth, barHeight, theme);
        DrawTimestamps(canvas, margin, w - margin, progressY + w * 0.045f, w * 0.026f, subTextPaint);

        var controlsY = progressY + w * 0.13f;
        var playDiameter = w * 0.24f; // ponytail: bigger than Spotify's real ~13% - the QR needs the room to stay scannable.
        DrawControlsRow(canvas, w / 2f, controlsY, contentWidth, playDiameter, song.Link, theme);

        canvas.Restore();

        using var borderPaint = new SKPaint
        {
            Color = theme.Text.WithAlpha(50),
            Style = SKPaintStyle.Stroke,
            StrokeWidth = w * 0.005f,
            IsAntialias = true
        };
        canvas.DrawRoundRect(cardRect, borderPaint);

        if (isKeychain)
        {
            DrawKeyholeHole(canvas, w, height);
        }

        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        return data.ToArray();
    }

    private static void DrawTopBar(SKCanvas canvas, float w, float margin, Theme theme)
    {
        using var paint = new SKPaint { Color = theme.SubText, Style = SKPaintStyle.Stroke, StrokeWidth = w * 0.006f, IsAntialias = true };
        var y = margin * 0.9f;
        var chevronSize = w * 0.02f;
        canvas.DrawLine(margin, y - chevronSize, margin + chevronSize, y + chevronSize * 0.3f, paint);
        canvas.DrawLine(margin + chevronSize, y + chevronSize * 0.3f, margin + chevronSize * 2, y - chevronSize, paint);

        using var dotsPaint = new SKPaint { Color = theme.SubText, IsAntialias = true };
        var dotR = w * 0.006f;
        for (var i = -1; i <= 1; i++)
        {
            canvas.DrawCircle(w - margin - chevronSize + i * dotR * 3.2f, y, dotR, dotsPaint);
        }
    }

    private async Task<SKBitmap?> TryDownloadCoverAsync(string? coverUrl, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(coverUrl)) return null;
        try
        {
            var bytes = await http.GetByteArrayAsync(coverUrl, ct);
            return SKBitmap.Decode(bytes);
        }
        catch
        {
            // ponytail: cover download is best-effort - fall back to a plain themed square instead of failing the whole design.
            return null;
        }
    }

    private static void DrawAlbumArt(SKCanvas canvas, float x, float y, float size, Theme theme, SKBitmap? cover)
    {
        var artRect = new SKRoundRect(new SKRect(x, y, x + size, y + size), size * 0.04f);
        canvas.Save();
        canvas.ClipRoundRect(artRect);

        if (cover is not null)
        {
            DrawCoverFill(canvas, cover, x, y, size, size);
            cover.Dispose();
        }
        else
        {
            canvas.Clear(theme.ArtFallback);
        }

        canvas.Restore();
    }

    private static void DrawCoverFill(SKCanvas canvas, SKBitmap cover, float x, float y, float width, float height)
    {
        var canvasAspect = width / height;
        var imgAspect = (float)cover.Width / cover.Height;
        SKRect src;
        if (imgAspect > canvasAspect)
        {
            var cropWidth = cover.Height * canvasAspect;
            var cx = (cover.Width - cropWidth) / 2f;
            src = new SKRect(cx, 0, cx + cropWidth, cover.Height);
        }
        else
        {
            var cropHeight = cover.Width / canvasAspect;
            var cy = (cover.Height - cropHeight) / 2f;
            src = new SKRect(0, cy, cover.Width, cy + cropHeight);
        }
        canvas.DrawBitmap(cover, src, new SKRect(x, y, x + width, y + height), new SKSamplingOptions(SKFilterMode.Linear, SKMipmapMode.None));
    }

    private static void DrawHeart(SKCanvas canvas, float cx, float cy, float size, SKColor color)
    {
        var builder = new SKPathBuilder();
        builder.MoveTo(cx, cy + size * 0.6f);
        builder.CubicTo(cx - size * 1.3f, cy - size * 0.4f, cx - size * 0.4f, cy - size * 1.3f, cx, cy - size * 0.3f);
        builder.CubicTo(cx + size * 0.4f, cy - size * 1.3f, cx + size * 1.3f, cy - size * 0.4f, cx, cy + size * 0.6f);
        builder.Close();
        using var heart = builder.Detach();
        using var strokePaint = new SKPaint { Color = color, Style = SKPaintStyle.Stroke, StrokeWidth = size * 0.16f, IsAntialias = true };
        canvas.DrawPath(heart, strokePaint);
    }

    private static void DrawProgressBar(SKCanvas canvas, float x, float y, float width, float barHeight, Theme theme)
    {
        using var track = new SKPaint { Color = theme.TrackFaint, IsAntialias = true };
        canvas.DrawRoundRect(new SKRoundRect(new SKRect(x, y, x + width, y + barHeight), barHeight / 2), track);

        const float progress = 0.35f;
        using var fill = new SKPaint { Color = theme.Accent, IsAntialias = true };
        canvas.DrawRoundRect(new SKRoundRect(new SKRect(x, y, x + width * progress, y + barHeight), barHeight / 2), fill);

        using var scrubber = new SKPaint { Color = theme.Text, IsAntialias = true };
        canvas.DrawCircle(x + width * progress, y + barHeight / 2, barHeight * 1.8f, scrubber);
    }

    // ponytail: static "1:12 / 3:45" timestamps - this is a print, not a real player, so the numbers are just decoration.
    private static void DrawTimestamps(SKCanvas canvas, float left, float right, float y, float fontSize, SKPaint paint)
    {
        using var font = new SKFont(RegularSans, fontSize);
        canvas.DrawText("1:12", left, y, SKTextAlign.Left, font, paint);
        canvas.DrawText("3:45", right, y, SKTextAlign.Right, font, paint);
    }

    private static void DrawControlsRow(SKCanvas canvas, float centerX, float centerY, float contentWidth, float playDiameter, string link, Theme theme)
    {
        using var iconPaint = new SKPaint { Color = theme.Text, IsAntialias = true };
        using var accentIconPaint = new SKPaint { Color = theme.Accent, IsAntialias = true };
        var edge = contentWidth / 2;
        var skipSize = contentWidth * 0.045f;
        var skipOffset = playDiameter / 2 + skipSize * 1.6f;

        DrawShuffle(canvas, centerX - edge * 0.82f, centerY, contentWidth * 0.024f, accentIconPaint);
        DrawSkipIcon(canvas, centerX - skipOffset, centerY, skipSize, mirrored: true, iconPaint);
        DrawQrButton(canvas, link, centerX, centerY, playDiameter, theme);
        DrawSkipIcon(canvas, centerX + skipOffset, centerY, skipSize, mirrored: false, iconPaint);
        DrawRepeat(canvas, centerX + edge * 0.82f, centerY, contentWidth * 0.024f, accentIconPaint);
    }

    // ponytail: shuffle/repeat are simplified to a crossing-arrows / loop abstraction rather than
    // pixel-accurate icon glyphs - close enough at print size, real vector icon set is overkill here.
    private static void DrawShuffle(SKCanvas canvas, float cx, float cy, float size, SKPaint paint)
    {
        using var stroke = new SKPaint { Color = paint.Color, Style = SKPaintStyle.Stroke, StrokeWidth = size * 0.22f, IsAntialias = true, StrokeCap = SKStrokeCap.Round };
        canvas.DrawLine(cx - size, cy - size * 0.5f, cx + size, cy + size * 0.5f, stroke);
        canvas.DrawLine(cx - size, cy + size * 0.5f, cx + size, cy - size * 0.5f, stroke);
    }

    private static void DrawRepeat(SKCanvas canvas, float cx, float cy, float size, SKPaint paint)
    {
        using var stroke = new SKPaint { Color = paint.Color, Style = SKPaintStyle.Stroke, StrokeWidth = size * 0.26f, IsAntialias = true };
        canvas.DrawCircle(cx, cy, size, stroke);
    }

    private static void DrawQrButton(SKCanvas canvas, string link, float centerX, float centerY, float diameter, Theme theme)
    {
        using var qrGenerator = new QRCodeGenerator();
        // High error correction: the play icon covers the center, ECC level H tolerates ~30% loss.
        using var qrData = qrGenerator.CreateQrCode(link, QRCodeGenerator.ECCLevel.H);

        using var circlePaint = new SKPaint { Color = SKColors.White, IsAntialias = true };
        canvas.DrawCircle(centerX, centerY, diameter / 2, circlePaint);

        var qrSize = diameter * 0.82f;
        var qrRect = new SKRect(centerX - qrSize / 2, centerY - qrSize / 2, centerX + qrSize / 2, centerY + qrSize / 2);
        DrawWaveQrModules(canvas, qrData, qrRect);

        var buttonRadius = diameter * 0.16f;
        using var buttonPaint = new SKPaint { Color = theme.ButtonCenter, IsAntialias = true };
        canvas.DrawCircle(centerX, centerY, buttonRadius, buttonPaint);

        using var trianglePaint = new SKPaint { Color = theme.PlayIcon, IsAntialias = true };
        var t = buttonRadius * 0.55f;
        var pathBuilder = new SKPathBuilder();
        pathBuilder.MoveTo(centerX - t * 0.6f, centerY - t);
        pathBuilder.LineTo(centerX - t * 0.6f, centerY + t);
        pathBuilder.LineTo(centerX + t * 0.9f, centerY);
        pathBuilder.Close();
        using var triangle = pathBuilder.Detach();
        canvas.DrawPath(triangle, trianglePaint);
    }

    // ponytail: no quiet-zone padding added here - verified QRCoder's own PngByteQRCode.GetGraphic(10)
    // (the call this replaced) renders the module matrix edge-to-edge with zero quiet zone, so adding
    // one here only shrank every module ~12% for nothing. The white circle behind the button already
    // gives the finder patterns clearance on the flat sides; that's inherited, not something to redo.
    // Modules stay pure black (not theme.Accent) and wobble is capped at 8% of module size / 96% bar
    // width - verified with a real ZXing decode across all 3 template sizes that this matches the
    // original flat-square renderer's decode rate exactly (Sticker/Card decode, Keychain doesn't -
    // same as before this change, a pre-existing small-print limitation). 12% wobble already broke
    // Sticker and Card. Don't loosen either value without re-running that same check.
    private static void DrawWaveQrModules(SKCanvas canvas, QRCodeData qrData, SKRect rect)
    {
        var matrix = qrData.ModuleMatrix;
        var size = matrix.Count;
        var moduleSize = rect.Width / size;
        using var paint = new SKPaint { Color = SKColors.Black, IsAntialias = true };

        for (var y = 0; y < size; y++)
        {
            for (var x = 0; x < size; x++)
            {
                if (!matrix[y][x]) continue;

                var cx = rect.Left + (x + 0.5f) * moduleSize;
                var cy = rect.Top + (y + 0.5f) * moduleSize;

                if (IsFinderPatternModule(x, y, size))
                {
                    canvas.DrawRect(new SKRect(cx - moduleSize / 2, cy - moduleSize / 2, cx + moduleSize / 2, cy + moduleSize / 2), paint);
                    continue;
                }

                var wobble = MathF.Sin(x * 0.8f + y * 0.4f) * (moduleSize * 0.08f);
                var barHeight = moduleSize + wobble;
                var bar = new SKRoundRect(
                    new SKRect(cx - moduleSize * 0.48f, cy - barHeight / 2, cx + moduleSize * 0.48f, cy + barHeight / 2),
                    moduleSize * 0.1f);
                canvas.DrawRoundRect(bar, paint);
            }
        }
    }

    // Standard QR only has finder patterns top-left, top-right and bottom-left (never bottom-right).
    private static bool IsFinderPatternModule(int x, int y, int size)
    {
        var innerEnd = size - 7;
        var inTopRows = y < 7;
        var inBottomRows = y >= innerEnd;
        var inLeftCols = x < 7;
        var inRightCols = x >= innerEnd;

        return (inTopRows && inLeftCols) || (inTopRows && inRightCols) || (inBottomRows && inLeftCols);
    }

    private static void DrawSkipIcon(SKCanvas canvas, float cx, float cy, float size, bool mirrored, SKPaint paint)
    {
        var dir = mirrored ? -1 : 1;
        for (var i = 0; i < 2; i++)
        {
            var offset = dir * (i * size * 0.9f);
            var builder = new SKPathBuilder();
            builder.MoveTo(cx + offset - dir * size * 0.5f, cy - size * 0.6f);
            builder.LineTo(cx + offset - dir * size * 0.5f, cy + size * 0.6f);
            builder.LineTo(cx + offset + dir * size * 0.5f, cy);
            builder.Close();
            using var triangle = builder.Detach();
            canvas.DrawPath(triangle, paint);
        }
    }

    // ponytail: punches a real transparent hole (not just a painted circle) so the PNG's alpha
    // channel matches what an actual keychain hardware ring needs.
    private static void DrawKeyholeHole(SKCanvas canvas, float width, int height)
    {
        var holeRadius = width * 0.035f;
        var cx = width / 2f;
        var cy = width * 0.09f;

        using var clearPaint = new SKPaint { BlendMode = SKBlendMode.Clear, IsAntialias = true };
        canvas.DrawCircle(cx, cy, holeRadius, clearPaint);

        using var ringPaint = new SKPaint
        {
            Color = new SKColor(190, 190, 195),
            Style = SKPaintStyle.Stroke,
            StrokeWidth = holeRadius * 0.35f,
            IsAntialias = true
        };
        canvas.DrawCircle(cx, cy, holeRadius * 1.35f, ringPaint);
    }

    private record Theme(
        SKColor Base,
        SKColor Text,
        SKColor SubText,
        SKColor TrackFaint,
        SKColor Accent,
        SKColor ArtFallback,
        SKColor ButtonCenter,
        SKColor PlayIcon);
}

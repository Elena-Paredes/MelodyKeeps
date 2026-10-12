# WaveKeeps — BACK Design Architecture

> STATUS: ACTIVE / AUTHORITATIVE for general BACK architecture and rules.
> SPRING DAY MASTER GEOMETRY: PENDING VISUAL APPROVAL.
> DOCUMENTATION ONLY: no BACK decoration, manifest or asset is defined by this file.

This file is the general authority for every song-specific BACK design.
Shared method (asset types, manifest rules, folder structure): `../../03-DESIGN-METHOD.md`.
Print/export placement on the sheet: `../../05-PRINT-LAYOUTS.md`.

Terminology: the functional element on the BACK is the **Spotify Code**
(song-specific scannable waveform), not a QR code.

## 1. Official physical size

```text
38 mm × 49 mm
3.8 cm × 4.9 cm
aspect ratio = 38:49 ≈ 0.77551
```

`3.8 mm × 4.9 mm` was an error and is NOT a valid dimension.

## 2. BACK logical canvas

The BACK no longer shares the FRONT canvas.

```text
width  = 380
height = 490
viewBox = "0 0 380 490"
aspect ratio = 38:49
scale: 10 logical units = 1 mm
```

An EXACT multiple may be used for render/export (for example `760 × 980`) as long as it
preserves exactly 38:49.

Forbidden for the BACK:

```text
1000 × 1500
1000 × 1290
any approximation of 38:49
```

Reference lateral margin for normal content: ≈ 2.5 mm = ≈ 25 units. The Spotify Code is a
controlled exception (section 4).

The FRONT keeps its own architecture (`1000 × 1500`, ratio 2:3). It is not migrated to
380 × 490 and its geometry is not recalculated. For physical production the FRONT is adapted
to 38 × 49 mm by the tested print flow in `05-PRINT-LAYOUTS.md`.

## 3. Content architecture

```text
BACK
├── #FFFFFF background
├── decorative layer
│   ├── watercolor/stamped "7"
│   └── BACK-specific watercolor feathers
├── identity/header layer
│   └── small BTS logo
├── Spotify Code functional zone
│   └── song-specific Spotify Code
├── CTA
│   └── ESCANEA Y ESCUCHA
├── message
│   └── song-specific quote
└── footer
    ├── optional approved divider/sparkle
    └── SONG TITLE
```

Layer order (bottom → top):

```text
1. #FFFFFF background
2. decorative watercolor elements
3. identity/content
4. Spotify Code
5. CTA / quote / footer content
```

Decoration NEVER visually overpowers the Spotify Code or interferes with functional text.

## 4. Spotify Code — fixed geometry

```text
box:  x = 7   y = 131.25   width = 366   height = 91.5
aspect ratio = 4:1
centerX = 190   centerY = 177
```

Asset (one per song, authority):

```text
designs/back/<backDesignId>/assets/svg/spotify-code.svg
```

Native SVG `viewBox = 400 × 100` (4:1). The SVG has ≈ 5% internal padding per side, so the
useful drawing is ≈ 33 mm × 8 mm, centered at ≈ y = 17.7 mm.

The 12 existing Spotify Codes remain the authority.

### THE SPOTIFY CODE WINS

It is the priority functional element of the BACK. All decoration adapts around it.
Scan-ability is never sacrificed to preserve decoration.

Prohibited:

```text
rotate, stretch, deform, crop
recolor during composition
shadow, outline, texture
decoration on top of it
elements behind it that dirty its background
regenerate the code
replace the existing asset
```

### Quiet zone

```text
15 units = 1.5 mm of decoration-free zone around the box
y = 116.25 → 237.75   (box + quiet zone reaches practically the full canvas width)
```

No ornamental decoration enters that zone, and its background is plain `#FFFFFF`.

## 5. Background

```text
BACKGROUND = #FFFFFF
```

Not ivory, cream, warm white or gray-white. No gradients, watercolor wash over the background,
variant tint or general texture. Watercolor belongs only to decorative elements; the canvas
stays pure white.

## 6. BACK decorative language

The BACK does NOT visually reuse FRONT Feathers + Threads V2. Front feathers stay exclusive to
the FRONT, and their silhouettes are not copied.

Approved language:

```text
large watercolor/stamped "7"
+
new stylized watercolor feathers (thicker, chubbier, more stylized)
```

- Several feathers enter partially from the canvas edges ("peeking in"); clipping at the edges
  can be a deliberate part of the composition.
- The watercolor "7" is a recurring identity element of the collection: upper-left region,
  partially clipped / entering from the edge. It may be used on all 12 songs and varies in
  color by variant. Its exact geometry is NOT approved yet.
- Small BTS logo in the upper region: centered, subtle, secondary to the Spotify Code. Exact
  geometry pending the Spring Day master design.

## 7. CTA, quote and footer

- CTA text (approved): `ESCANEA Y ESCUCHA`. Typography and geometry pending Spring Day.
- Quote: dynamic, song-specific content. The owner will confirm the final phrases; the texts
  currently in `supported-songs.ts` are NOT declared final.
- Footer: `SONG TITLE ONLY`. Never `• BTS`, `BTS` or the artist next to the footer title.
- The footer title has a reserved region inside the composition. The quote must NOT
  automatically use all space down to y = 460. Final geometry of quote region, divider/sparkle
  and song title is decided with the Spring Day prototype.

## 8. Color system

Geometry will be shared across songs. Color comes from the same visual family assigned to the
FRONT; the source of truth is `variantId` (use the EXISTING palettes; do not reinterpret them or
invent new colors):

| Song | variantId |
|---|---|
| Swim | arirang-red |
| Like Animals | arirang-red |
| Spring Day | ynwa |
| Blood, Sweat & Tears | wings |
| Mikrokosmos | persona |
| DNA | her |
| Dimple | her |
| I'm Fine | answer |
| Pied Piper | her |
| We Are Bulletproof | mots7 |
| Fake Love | tear |
| Run | hyyh |

## 9. Print constraint

Vector/line decorative elements: minimum line thickness `0.15 mm` = `1.5` logical units.
Avoid details so fine that they disappear in physical print.

## 10. Spring Day prototype

The first BACK to design is Spring Day (`variantId = ynwa`). It defines the BACK MASTER
GEOMETRY: PENDING VISUAL APPROVAL. After approval, that geometry is reused for the other songs,
changing only variant/color family, Spotify Code, quote, song title, and any other dynamic
content explicitly approved. The other 11 are NOT designed until Spring Day is approved.

## 11. Per-design contracts

Each approved design gets its own concrete contract:

```text
designs/back/<design-id>/<design-id>.md
```

Created only after its visual concept, content zones, production assets and placement data are
approved. Do not create final implementation geometry from this README. No concrete contract
exists yet (Spring Day is not approved).

Planned IDs:

```text
swim, animals, spring-day, blood-sweat-tears, mikrokosmos, dna,
dimple, im-fine, pied-piper, we-are-bulletproof, fake-love, run
```

## 12. Not authorized by this document

No runtime changes: no definitive BACK manifests, decorative assets, new feathers, watercolor
"7", decorative positions, new components, or the other 11 backs.

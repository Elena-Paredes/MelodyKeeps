# WaveKeeps — Verified Player Contract

> STATUS: PLAYER V2 = HISTORICAL APPROVED BASELINE (the geometry below is V2).
> PLAYER V3 = CURRENT REVIEW CANDIDATE: not approved, not locked (see "Player V3 (REVIEW)" below).
> APPROVED ACTIVE PLAYER (V2): Spotify Code + Linear Progress + Timers
> DECORATIVE DESIGN: OUT OF SCOPE.

Master:

```text
1000×1500
```

## Approved active player composition

```text
header + artwork + title + artist + heart
+
Spotify Code (song-specific)
+
Linear Progress Bar (dynamic)
+
Timers (relocated)
+
playback controls
+
utility icons
```

## Locked geometry

```text
ARTWORK_CONTAINER
x=170 y=205 width=660 height=660 cornerRadius=28

TRACK_TITLE
x=135 y=930 font=Inter weight=700 size=43

TRACK_ARTIST
x=135 y=980 font=Inter weight=400 size=30

HEART_ICON
centerX=835 centerY=930 fill=#E63946 (red)

SPOTIFY_CODE
x=250 y=1070 width=500 height=125
aspectRatio=4:1 (preserved, no stretch)
source=assets/wavekeeps/designs/back/<backDesignId>/assets/svg/spotify-code.svg
load=local (no runtime Spotify/scannables requests)

LINEAR_PROGRESS
startX=135 endX=865 y=1225
length=730 strokeWidth=5 lineCap=round
completed=#111111
remaining=#D7D7DE
knob: centerY=1225 radius=8 fill=#111111
position: dynamic
  formula: progressX = 135 + (730 * clamp(currentSeconds/totalSeconds, 0, 1))

TIMER_ELAPSED
x=135 y=1265 fontSize=25 textAnchor=start

TIMER_TOTAL
x=865 y=1265 fontSize=25 textAnchor=end

CONTROL_SHUFFLE
x=127 y=1305 width=46 height=46

CONTROL_PREVIOUS
x=330 y=1328

CONTROL_PLAY_PAUSE
centerX=500 centerY=1328 radius=56

CONTROL_NEXT
x=670 y=1328

CONTROL_REPEAT
x=827 y=1305 width=46 height=46

UTILITY_DEVICE
x=130 y=1412 width=40 height=40

UTILITY_QUEUE
x=830 y=1412 width=40 height=40
```

Existing verified implementation remains authoritative for functional SVG internals not enumerated here.

## Decoration rule

```text
PLAYER = immutable
DECORATION = adapts
```

If decoration collides:

```text
move/resize decoration only through approved manifest correction
or clip/mask decoration
```

Never move the player.

## Forbidden

```text
remeasure player
derive player geometry from reference/concept art
derive player geometry from painted pixel bounds
stretch functional icons
change player spacing for decoration
```

## Player V3 (REVIEW)

```text
PLAYER V3
STATUS = REVIEW   (NOT APPROVED, NOT LOCKED, NOT FINAL)
```

V3 is a controlled legibility experiment explicitly authorized by the owner. The V2 geometry
above stays the historical approved baseline and remains the geometry of record until the owner
explicitly approves V3. V3 is not an authority for implementation.

- The logical canvas does not change: `1000 × 1500`, ratio 2:3 (no global scale).
- V3 enlarges elements and widens horizontal use of the canvas; V3 values under review are
  recorded in `05-PRINT-LAYOUTS.md` (keychain and sticker). V3 does not change FRONT
  decoration, variants or Spotify Code assets.
- Spotify Code on the FRONT: the keychain V3 front omits it (it stays on the BACK); the sticker
  front keeps it (see `05-PRINT-LAYOUTS.md`).
- Heart shape (universal, REVIEW): one rounded heart ("favorite" shape, ≈ 48.2 wide × 44.2 tall,
  centered at (900, 955)) defined once in the player (`getHeartPath`). It is used by every mode
  (with design and without design, light and dark themes); only its colors change per theme.
  It replaces the earlier hand-drawn, taller shape.

### Display title exception

The canonical song title is never replaced. The player may show a shorter display title when
the full title does not fit:

```text
canonical title:     We Are Bulletproof: the Eternal Edition
player display title: We Are Bulletproof
```

Rule: the player shows `playerDisplayTitle ?? title`. `playerDisplayTitle` is song data
(optional field in the song catalog), never a per-song hardcode in the component. It is specific
to the PLAYER and is not automatically reused on the BACK. No automatic rule (auto-fit, shrinking,
ellipsis, wrapping) exists; the rest of the catalog uses the canonical title.

Known technical discrepancy: the font `Inter` is declared but not loaded (`unloaded`), so text
metrics depend on the system fallback font. To be resolved separately.

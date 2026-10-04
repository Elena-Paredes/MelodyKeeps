# WaveKeeps --- Player Template Implementation Contract

> **Purpose:** This document is the source of truth for implementing the
> approved WaveKeeps music-player design.\
> The implementation must reproduce the supplied reference design, not
> reinterpret it.

## 0. Instruction to the coding AI

You are implementing an **already-approved visual design**. You are
**not** being asked to redesign it, improve it, simplify it, or create
something merely inspired by it.

Treat the supplied reference image and this document as a visual
contract.

### Priority order

If there is any ambiguity, follow this order:

1.  Exact geometry and layout defined in this document.
2.  Supplied reference image.
3.  Existing WaveKeeps design tokens/components.
4.  Your own judgment only where none of the above specifies the answer.

Do **not** make independent visual changes.

------------------------------------------------------------------------

# 1. Reference asset

Place the approved reference image in:

`/design/reference/wavekeeps-player-classic.png`

The target is the approved portrait player with:

-   dark, flat player background;
-   large square album artwork near the top;
-   `PLAYING FROM PLAYLIST` header;
-   `BTS // favorites 💜`;
-   song title and artist below the artwork;
-   heart icon at the right;
-   waveform used as the progress visualization;
-   elapsed and total duration below it;
-   shuffle / previous / pause-play / next / repeat controls;
-   device and queue controls at the bottom.

The reference image must be visible while implementing the component.

**Do not attempt to reconstruct the layout from memory.**

------------------------------------------------------------------------

# 2. Master coordinate system

All internal layout must use one fixed master coordinate system:

``` text
MASTER WIDTH:  1000
MASTER HEIGHT: 1500
ASPECT RATIO:  2:3
```

For SVG:

``` html
<svg
  viewBox="0 0 1000 1500"
  preserveAspectRatio="xMidYMid meet"
>
```

For HTML/CSS preview, the outer component must preserve:

``` css
aspect-ratio: 2 / 3;
```

Never stretch X and Y independently.

The component may scale uniformly to any display size, but its internal
proportions must remain unchanged.

------------------------------------------------------------------------

# 3. Flat-design rule

This is a **flat printed design**, not a 3D UI mockup.

Forbidden inside the player:

-   bevels;
-   embossed controls;
-   raised buttons;
-   fake physical depth;
-   glass buttons;
-   3D icons;
-   perspective transforms;
-   thick drop shadows on controls;
-   neumorphism.

A very subtle outer preview shadow may be used only by the web editor to
separate the card from the editor background. It is **not part of the
exported artwork**.

------------------------------------------------------------------------

# 4. Master layout

Use these regions as the baseline.

  Region                  X      Y      W      H
  ------------------- ----- ------ ------ ------
  Player canvas           0      0   1000   1500
  Header                 80     65    840    105
  Artwork               145    190    710    710
  Track information     135    940    730    105
  Waveform              135   1060    730     82
  Time labels           135   1145    730     35
  Main controls         125   1200    750    145
  Bottom utilities      135   1370    730     55

These values are the initial implementation contract. Do not casually
alter them to "look better."

------------------------------------------------------------------------

# 5. Background

Player background:

``` text
Primary: #080B12
Secondary permitted nuance: #0D1019
```

The exported player should read as nearly black with a very subtle
cool/navy character.

Do not add a visible gradient unless it is extremely subtle.

Outer corner radius:

``` text
48 master units
```

------------------------------------------------------------------------

# 6. Header

### Left

A simple downward chevron.

``` text
center: approximately (120, 105)
visual size: 38 × 22
stroke: 3
color: #FFFFFF
```

Use an SVG path. Do not use a text glyph such as `⌄`.

### Center

Line 1:

``` text
PLAYING FROM PLAYLIST
```

Style:

``` text
font: Inter
weight: 400
size: 21
letter-spacing: 3.0
color: #FFFFFF
opacity: 0.90
text-anchor: middle
```

Line 2:

``` text
BTS // favorites 💜
```

Style:

``` text
font: Inter
weight: 400
size: 27
color: #FFFFFF
```

The second line sits approximately 36 units below the first.

### Right

Three horizontal dots.

Use three SVG circles, not the Unicode ellipsis character.

------------------------------------------------------------------------

# 7. Album artwork

The artwork is the dominant visual element.

``` text
x: 145
y: 190
width: 710
height: 710
corner radius: 30
```

Rules:

-   use `object-fit: cover`;
-   never stretch the image;
-   never distort its aspect ratio;
-   center crop when necessary;
-   artwork must remain visually square;
-   no 3D frame;
-   no floating-card effect;
-   no heavy shadow.

Use an SVG `clipPath` or CSS `overflow: hidden` to enforce rounded
corners.

The song-specific image is dynamic:

``` ts
song.artworkUrl
```

------------------------------------------------------------------------

# 8. Track information

Song title:

``` text
x: 135
baseline y: ~985
font: Inter
weight: 700
size: 43
color: #FFFFFF
```

Artist:

``` text
x: 135
baseline y: ~1035
font: Inter
weight: 400
size: 30
color: #B8B8C2
```

Dynamic values:

``` ts
song.title
song.artist
```

Do not automatically uppercase either value.

------------------------------------------------------------------------

# 9. Favorite icon

The heart sits on the same visual block as the song information, aligned
toward the right.

Approximate center:

``` text
x: 835
y: 985
```

Use a proper SVG heart outline.

``` text
size: 43 × 43
stroke: 3
fill: none
```

Theme color example:

``` text
#C66CFF
```

Do not use a Unicode `♡` character.

------------------------------------------------------------------------

# 10. Waveform progress control

This replaces the conventional boring straight progress line.

There must **not** be a second horizontal progress bar underneath it.

The waveform itself communicates progress.

Bounds:

``` text
x: 135
y: 1060
width: 730
height: 82
```

Use vertical rounded bars.

Recommended baseline:

``` text
bar width: 5–7
gap: 4–6
minimum height: 10
maximum height: 76
bar radius: 3
```

The waveform must be centered vertically.

Example data:

``` ts
waveform: number[] // normalized 0..1
```

### Progress coloring

Given:

``` ts
progress = currentTime / duration
```

Bars before the progress point use the active theme.

Bars after the progress point use a muted version of the theme.

Approved Spring Day direction:

``` text
active start: #F06AAE
active end:   #A264FF
inactive:     same palette at reduced intensity/opacity
```

A small progress marker may appear at the exact progress location, but
it must remain visually subordinate to the waveform.

Do not generate random waveform values on every render.

For deterministic designs, waveform data must be stored with the
design/song.

------------------------------------------------------------------------

# 11. Time labels

Elapsed time:

``` text
x: 135
y: 1175
alignment: left
```

Duration:

``` text
x: 865
y: 1175
alignment: right
```

Style:

``` text
font: Inter
weight: 400
size: 25
color: #FFFFFF
```

Example:

``` text
1:43                                  4:34
```

------------------------------------------------------------------------

# 12. Playback controls

All icons must be SVG assets/components.

**Do not recreate media icons using CSS borders, Unicode characters,
emoji, or font glyphs.**

Main control centers:

``` text
shuffle:  x=150
previous: x=330
play:     x=500
next:     x=670
repeat:   x=850

centerY ≈ 1275
```

## Previous

Visual bounds approximately:

``` text
52 × 52
```

White.

## Play/Pause

Outer circle:

``` text
center: (500, 1275)
diameter: 120
fill: #FFFFFF
```

Inner icon:

``` text
fill: #080B12
```

If playing, show pause.

If paused, show play.

The icon must be mathematically centered visually, not merely centered
by its SVG bounding box.

## Next

Mirror the previous icon.

## Shuffle / Repeat

Use clean line icons.

Theme color:

``` text
#20D760
```

If the tiny active indicator dot is present, center it beneath the icon.

------------------------------------------------------------------------

# 13. Bottom utilities

Device icon:

``` text
approx center: (150, 1410)
```

Queue icon:

``` text
approx center: (850, 1410)
```

Use SVG.

``` text
color: #FFFFFF
stroke: 2–3
```

Do not use emoji or text approximations.

------------------------------------------------------------------------

# 14. Icon policy

Create or import one coherent SVG icon set for:

-   chevron-down;
-   more-horizontal;
-   heart;
-   shuffle;
-   previous;
-   play;
-   pause;
-   next;
-   repeat;
-   device;
-   queue.

Preferred implementation:

``` tsx
<Icon name="previous" />
```

or dedicated components:

``` tsx
<PreviousIcon />
<PauseIcon />
<NextIcon />
```

All SVGs must use a consistent:

-   stroke width;
-   line cap;
-   line join;
-   optical weight.

If using a third-party icon library, use **one library consistently**
and verify each icon visually against the reference.

Do not mix icon families casually.

------------------------------------------------------------------------

# 15. Component structure

Recommended React structure:

``` text
WaveKeepsPlayer
├── PlayerHeader
├── AlbumArtwork
├── TrackInfo
│   └── FavoriteButton
├── WaveformProgress
├── TimeDisplay
├── PlaybackControls
│   ├── ShuffleButton
│   ├── PreviousButton
│   ├── PlayPauseButton
│   ├── NextButton
│   └── RepeatButton
└── PlayerUtilities
    ├── DeviceButton
    └── QueueButton
```

The visual geometry must not depend on arbitrary margins cascading
between unrelated components.

Prefer:

-   SVG coordinates for the printable master; or
-   CSS Grid with explicit fixed proportional regions.

Avoid a long chain of `margin-top` values.

------------------------------------------------------------------------

# 16. Dynamic design model

The player template must accept data rather than hard-code Spring Day.

Example:

``` ts
export interface MusicPlayerDesign {
  title: string;
  artist: string;
  artworkUrl: string;

  currentTimeSeconds: number;
  durationSeconds: number;

  waveform: number[];

  playlistLabel?: string;

  theme: {
    background: string;
    text: string;
    secondaryText: string;
    accentStart: string;
    accentEnd: string;
    controlActive: string;
    heart: string;
  };

  playbackState: "playing" | "paused";
}
```

Example:

``` ts
const springDayDesign: MusicPlayerDesign = {
  title: "Spring Day",
  artist: "BTS",
  artworkUrl: "/artwork/spring-day.jpg",

  currentTimeSeconds: 103,
  durationSeconds: 274,

  waveform: [...],

  playlistLabel: "BTS // favorites 💜",

  theme: {
    background: "#080B12",
    text: "#FFFFFF",
    secondaryText: "#B8B8C2",
    accentStart: "#F06AAE",
    accentEnd: "#A264FF",
    controlActive: "#20D760",
    heart: "#C66CFF"
  },

  playbackState: "playing"
};
```

------------------------------------------------------------------------

# 17. SVG-first implementation

The preferred printable implementation is SVG.

Why:

-   deterministic positions;
-   no CSS layout drift;
-   perfect scaling;
-   vector icons;
-   vector waveform;
-   reliable print export;
-   easier visual regression testing.

Recommended architecture:

``` text
React editor
      ↓
MusicPlayerDesign data
      ↓
PlayerTemplateClassic.tsx
      ↓
SVG 1000 × 1500
      ↓
Preview
      ├── PNG export
      └── print pipeline
```

The React component may render SVG directly.

------------------------------------------------------------------------

# 18. Absolutely forbidden implementation shortcuts

Do not:

-   use emoji for interface icons;
-   use text characters for play/pause/next/previous;
-   use a CSS triangle for the main play icon if an SVG is available;
-   stretch the album image;
-   substitute a generic audio player package's default UI;
-   add cards inside cards;
-   add 3D depth;
-   change the approved proportions;
-   remove controls because they seem unnecessary;
-   add controls not present in the reference;
-   move elements to "balance" the composition without approval;
-   replace the waveform with a standard progress line;
-   place a second progress line under the waveform;
-   invent gradients unrelated to the song theme;
-   rebuild the design responsively by independently rearranging
    elements.

Responsive behavior means **uniformly scaling the complete master
composition**, not redesigning it at every breakpoint.

------------------------------------------------------------------------

# 19. Visual regression requirement

A screenshot test is mandatory.

Render the player at exactly:

``` text
1000 × 1500
```

Save:

``` text
/tests/visual/current/player-classic.png
```

Reference:

``` text
/tests/visual/reference/player-classic.png
```

Compare them using a visual regression tool such as:

-   Playwright screenshot assertions;
-   pixelmatch;
-   another deterministic pixel-diff tool already used by the project.

Example with Playwright:

``` ts
await expect(page.locator('[data-testid="wavekeeps-player"]'))
  .toHaveScreenshot('player-classic.png', {
    animations: 'disabled'
  });
```

Do not approve the implementation solely because it "looks close."

------------------------------------------------------------------------

# 20. Manual visual checklist

Before declaring the component complete, verify:

-   [ ] Canvas is exactly 2:3.
-   [ ] Artwork is square and not distorted.
-   [ ] Artwork occupies the intended dominant area.
-   [ ] Header is centered.
-   [ ] Title/artist alignment matches the reference.
-   [ ] Heart is aligned with the track block.
-   [ ] Waveform replaces the progress line.
-   [ ] Waveform is deterministic.
-   [ ] Elapsed and total times align to its edges.
-   [ ] Main pause/play button is centered.
-   [ ] Previous and next controls are symmetric.
-   [ ] Shuffle and repeat controls are symmetric.
-   [ ] All icons come from SVG.
-   [ ] No icon appears stretched.
-   [ ] No unintended 3D/relief effect exists.
-   [ ] Device and queue controls align along the bottom.
-   [ ] Scaling the component does not change internal proportions.
-   [ ] Exported version does not contain editor-only
    shadows/backgrounds.

------------------------------------------------------------------------

# 21. Implementation sequence

Follow this order.

### Phase 1 --- Geometry only

Build:

-   outer player;
-   header positions;
-   artwork rectangle;
-   track text positions;
-   waveform bounds;
-   control centers.

Use temporary rectangles/circles if necessary.

Do **not** spend time styling yet.

### Phase 2 --- Exact SVG icons

Replace all placeholders with final SVG icons.

Verify symmetry and optical alignment.

### Phase 3 --- Typography and colors

Apply Inter and the approved palette.

### Phase 4 --- Dynamic data

Replace static Spring Day values with `MusicPlayerDesign`.

### Phase 5 --- Waveform

Implement deterministic waveform bars and progress coloring.

### Phase 6 --- Visual comparison

Render at 1000 × 1500 and compare with the supplied reference.

Correct geometry before adding any new feature.

### Phase 7 --- Export

Only after the visual reference passes, connect PNG/print export.

------------------------------------------------------------------------

# 22. Expected response from the coding AI

Before changing code, respond with:

1.  which existing files/components will be modified;
2.  which new files will be created;
3.  whether the supplied reference image is accessible;
4.  whether Inter is already available;
5.  which SVG icon source will be used;
6.  how visual regression will be tested.

Then implement the design.

If the reference image is not accessible, **stop and request it**. Do
not guess.

------------------------------------------------------------------------

# 23. Definition of done

The task is complete only when:

1.  the component uses the 2:3 master coordinate system;
2.  all UI controls are proper SVGs;
3.  artwork never distorts;
4.  waveform is the progress visualization;
5.  all song information is data-driven;
6.  the design scales uniformly;
7.  the 1000 × 1500 screenshot closely matches the approved reference;
8.  visual regression testing is in place;
9.  no unauthorized redesign has been introduced.

The objective is **reproduction first, abstraction second**.

Do not proceed to additional WaveKeeps templates until this Classic
template is visually approved.

------------------------------------------------------------------------

# 24. Known Issues & Implementation Problems (ES)

**Estado:** Implementación en progreso. El reproductor SVG está renderizado pero hay problemas con ciertos iconos.

## Iconos con Problemas

### Problema 1: Iconos de control aleatorio (Shuffle) y repetición (Repeat)

**Ubicación:** Líneas 468-479 en `player-template-classic.component.ts`

**Síntoma:** Los iconos de shuffle y repeat se muestran pero:
- No coinciden exactamente con el diseño de referencia
- Las líneas de los iconos pueden no tener el grosor correcto
- El indicador de estado activo (punto) puede no estar alineado correctamente

**Especificaciones correctas según diseño:**

```
Shuffle icon:
- Líneas de cruce en patrón de shuffle
- Tema color: #20D760 (verde)
- Debe ser reconocible como "shuffle" (cruce de flechas)

Repeat icon:
- Flecha circular con número (1x = repeat all, 1 = repeat one)
- Tema color: #20D760 (verde)
- Pequeño punto indicador de estado cuando activo
```

### Problema 2: Iconos inferiores (Device y Queue)

**Ubicación:** Líneas 483-499 en `player-template-classic.component.ts`

**Síntoma:** Los iconos de device y queue se muestran pero:
- No coinciden con el estilo de los otros iconos
- Device icon (altavoz/dispositivo) puede estar deformado
- Queue icon (lista) puede no tener las líneas correctas

**Especificaciones correctas según diseño:**

```
Device icon:
- Representa un altavoz o dispositivo de reproducción
- Color: #FFFFFF
- Stroke: 2-3 px
- Centro aproximado: (150, 1410)
- Tamaño visual: ~40x40px

Queue icon:
- Representa una lista de reproducción (tres líneas horizontales)
- Color: #FFFFFF
- Stroke: 2-3 px
- Centro aproximado: (850, 1410)
- Tamaño visual: ~40x40px
```

## Solución Recomendada

Reemplazar las funciones `getShuffleIcon()`, `getRepeatIcon()`, `getDeviceIcon()` y `getQueueIcon()` con SVG paths que coincidan exactamente con:

1. La imagen de referencia en `/design/reference/wavekeeps-player-classic.png`
2. El estilo de línea consistente de los otros iconos (stroke-linecap: round, stroke-linejoin: round)
3. El tamaño visual aproximado especificado en cada sección

## Próximos Pasos

1. Revisar imagen de referencia para ver los iconos exactos
2. Actualizar las funciones getXIcon() con paths SVG precisos
3. Verificar alineación y tamaño con visual regression test
4. Confirmar colores y estilos de línea coinciden con especificación

------------------------------------------------------------------------

# 25. Corrective Patch — Exact Icon Resolution

> This section supersedes any ambiguous icon instructions in Section 24. Apply this patch before continuing visual refinement.

## 25.1 Current implementation context

The current implementation uses Angular and `player-template-classic.component.ts`. Keep the existing Angular architecture. Do not migrate the component to React as part of this correction.

The SVG-first rule remains mandatory: the player must continue using the 1000 × 1500 master coordinate system and all icons must scale through the parent SVG without independent X/Y distortion.

## 25.2 Do not redraw icons from the reference image

For the four reported problem icons (`shuffle`, `repeat`, `device`, `queue`), do not visually approximate paths by looking at the PNG. Replace the existing implementations with the normalized SVG geometry below.

All four icons use:

```text
viewBox: 0 0 24 24
fill: none
stroke-linecap: round
stroke-linejoin: round
vector-effect: non-scaling-stroke (when appropriate)
```

When inserted into the 1000 × 1500 player SVG, preserve their viewBox and scale them uniformly. Never stretch width and height independently.

## 25.3 Exact Shuffle icon

Use this geometry as the source of truth:

```svg
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M16 3h5v5" />
  <path d="M4 20 21 3" />
  <path d="M21 16v5h-5" />
  <path d="m15 15 6 6" />
  <path d="m4 4 5 5" />
</svg>
```

Style:

```text
stroke: #20D760
stroke-width: 2
visual box in master SVG: 46 × 46
center: (150, 1275)
```

Active indicator:

```text
circle center: (150, 1311)
radius: 4
fill: #20D760
```

The active dot must be horizontally centered on the icon, not on an individual path.

## 25.4 Exact Repeat icon

Use a normal repeat-all icon for the Classic template. Do NOT add `1x`, `1`, text, or another repeat mode indicator inside this icon unless a future WaveKeeps state explicitly requests `repeat-one`.

```svg
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="m17 1 4 4-4 4" />
  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
  <path d="m7 23-4-4 4-4" />
  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
</svg>
```

Style:

```text
stroke: #20D760
stroke-width: 2
visual box in master SVG: 46 × 46
center: (850, 1275)
```

Active indicator:

```text
circle center: (850, 1311)
radius: 4
fill: #20D760
```

## 25.5 Exact Device icon

The Classic template uses a compact device/cast-style symbol. Use:

```svg
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="3" y="4" width="18" height="14" rx="2" />
  <path d="M8 22h8" />
  <path d="M12 18v4" />
</svg>
```

Style:

```text
stroke: #FFFFFF
stroke-width: 2
visual box in master SVG: 40 × 40
center: (150, 1410)
```

Do not add speaker cones, perspective, filled rectangles, shadows, or extra decoration. This icon must have the same optical line weight as Queue.

## 25.6 Exact Queue icon

Use:

```svg
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M3 6h12" />
  <path d="M3 12h12" />
  <path d="M3 18h8" />
  <path d="m17 16 4 2-4 2z" fill="currentColor" stroke="none" />
</svg>
```

Style:

```text
stroke/currentColor: #FFFFFF
stroke-width: 2
visual box in master SVG: 40 × 40
center: (850, 1410)
```

The small play triangle is intentional. Do not substitute a hamburger/menu icon.

## 25.7 Angular implementation rule

In `player-template-classic.component.ts`, replace the current implementations of:

```text
getShuffleIcon()
getRepeatIcon()
getDeviceIcon()
getQueueIcon()
```

with deterministic markup/path data based on Section 25.

Preferred implementation: define reusable icon path data/constants or Angular SVG templates. Do not generate path coordinates dynamically.

If the current functions return SVG strings, keep that mechanism only if it is already safe and established in the project. Otherwise prefer inline Angular SVG template elements/components so paths remain inspectable and testable.

Do not modify unrelated player geometry while fixing these four icons.

## 25.8 Optical alignment requirement

Mathematical bounding-box centering alone is not sufficient. After placing the icons at their required centers:

1. Render at exactly 1000 × 1500.
2. Overlay against `/design/reference/wavekeeps-player-classic.png`.
3. Check the icon's visual center.
4. Allow at most a small translation of ±4 master units for optical correction.
5. Do not change the icon's aspect ratio to achieve alignment.

Any optical correction must be documented as a `translate(x,y)` and must not modify the canonical path geometry.

## 25.9 Regression checks specifically for icons

Add/retain the full-player screenshot test and verify these conditions:

```text
Shuffle center = (150, 1275) ± 4
Repeat center  = (850, 1275) ± 4
Device center  = (150, 1410) ± 4
Queue center   = (850, 1410) ± 4
```

Also verify:

- Shuffle and Repeat have identical visual box sizes.
- Their active dots share the same Y coordinate.
- Device and Queue have identical visual box sizes.
- Device and Queue share the same optical stroke weight.
- No icon is stretched.
- No icon uses emoji, Unicode, font glyphs, or CSS-drawn geometry.

## 25.10 Required Claude action

Claude: apply this corrective patch now. Do not produce another design interpretation.

Before editing, identify the current definitions of the four icon functions and confirm that the player still uses the 1000 × 1500 SVG coordinate system.

Then:

1. Replace only the four problematic icon implementations.
2. Remove the incorrect `1x = repeat all` interpretation.
3. Preserve the existing approved player layout.
4. Render the component at 1000 × 1500.
5. Run the visual regression comparison.
6. If an icon is visually off-center, use only a documented ±4-unit translation.
7. Report the exact files/lines changed and the visual-regression result.

Do not mark the issue resolved merely because the icons render. The correction is complete only after their shape, scale, position, stroke weight, and active indicators pass the checks above.

# 26. Clarification — Framework terminology

Sections of this document that show React/TSX are architectural examples from the original design contract. The current project implementation is Angular. For the current codebase:

- preserve Angular;
- translate component examples into Angular equivalents;
- preserve all visual specifications and SVG geometry;
- do not initiate a framework migration;
- SVG coordinates and visual-regression requirements remain framework-independent.

This clarification supersedes any implication that React is required for the Classic template.

------------------------------------------------------------------------

# 27. Current Implementation Status & Ongoing Issues

**Date:** 2026-09-27  
**Status:** Icon geometry still under refinement. Shuffle and Repeat icons continue to render with distortion despite SVG path corrections.

## 27.1 Known Distortion Problem — Shuffle & Repeat Icons

**Symptom:** Shuffle and Repeat icons at (150, 1275) and (850, 1275) deform when rendered in the 1000×1500 SVG context.

**Possible causes:**
- Scaling factor application incorrect (coordinate transformation math error)
- SVG viewport/preserveAspectRatio conflict with parent container
- Stroke-width not scaling proportionally with icon geometry
- Path coordinates exceed 23-unit bounding box reference

**Current implementation:** Scale factor `s = 2` applied to viewBox paths, but visual output shows squashing/stretching.

**Next steps for developer:**
1. Render at 1000×1500 with visual regression tool
2. Compare Shuffle/Repeat visual box size against Device/Queue (which render correctly at 40×40)
3. If icons are compressed vertically, reduce `s` or recalculate path offsets
4. If icons are rotated/skewed, check SVG transform matrix
5. Verify active indicator dots (radius=4 at y=1311 for both) render in correct position

## 27.2 Spotify Integration — API Link Feature (PLANNED)

**Requirement:** Add Spotify link button/icon in the player that directs user to the track on Spotify.

**Implementation context:**
- Design phase: integrating Spotify Web API during design generation (does not block visual refinement)
- Location: Recommend top-right corner near heart icon, or as an additional bottom utility
- Icon: Use official Spotify green (#1DB954) with Spotify logo or music note variant
- Interaction: Click opens `spotify:track:{song_id}` or web link `https://open.spotify.com/track/{song_id}`

**Data flow:**
1. Frontend receives `song.spotifyLink` or `song.spotifyId` from API
2. Player component accepts `spotifyTrackId?: string` in `MusicPlayerDesign` interface
3. Render clickable Spotify icon if `spotifyTrackId` is present
4. On click: open Spotify app (mobile) or web player (desktop)

**Backend changes needed:**
- Songs table: add `spotify_track_id` column (nullable)
- Seed database with Spotify track IDs when creating test songs
- Return `spotifyTrackId` in song response

**Spotify API reference:**
- Web API base: `https://api.spotify.com/v1`
- Track endpoint: `/tracks/{id}` (requires Bearer token)
- OAuth flow: Authorization Code flow for user authentication
- Scopes needed: `playlist-read-private, playlist-read-collaborative` (for searching/linking)

**Implementation sequence:**
1. ✓ Finalize icon distortion issue
2. ⊘ Backend: add spotify_track_id to Songs schema
3. ⊘ Backend: seed test songs with real Spotify track IDs
4. ⊘ Frontend: extend MusicPlayerDesign interface with spotifyTrackId
5. ⊘ Frontend: add Spotify icon button to player template
6. ⊘ Test: click Spotify link and verify redirect works

This feature is lower priority than icon correction but should be integrated before feature-complete release.

---

# 28. Corrective Patch v2 — Fix SVG Distortion by Eliminating Manual Path Scaling

> **This section supersedes Sections 27.1 and any earlier instruction that manually multiplies 24×24 icon path coordinates by a scale factor.**

## 28.1 Root cause to eliminate

The current Shuffle and Repeat implementation reports distortion after applying a manual scale factor (`s = 2`) to path coordinates. Stop doing this.

**Canonical 24×24 icon path data must never be numerically rewritten, multiplied, stretched, or recalculated to fit the 1000×1500 parent SVG.**

The parent SVG coordinate system and the icon's local coordinate system must remain separate.

## 28.2 Required nested-SVG strategy

Render each problematic icon as a nested SVG with its own `viewBox="0 0 24 24"` and an explicit square viewport in master coordinates.

Shuffle:

```html
<svg
  x="127"
  y="1252"
  width="46"
  height="46"
  viewBox="0 0 24 24"
  preserveAspectRatio="xMidYMid meet"
  overflow="visible"
  aria-hidden="true"
>
  <g fill="none"
     stroke="#20D760"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
    <path d="M16 3h5v5" />
    <path d="M4 20 21 3" />
    <path d="M21 16v5h-5" />
    <path d="m15 15 6 6" />
    <path d="m4 4 5 5" />
  </g>
</svg>
<circle cx="150" cy="1311" r="4" fill="#20D760" />
```

Repeat:

```html
<svg
  x="827"
  y="1252"
  width="46"
  height="46"
  viewBox="0 0 24 24"
  preserveAspectRatio="xMidYMid meet"
  overflow="visible"
  aria-hidden="true"
>
  <g fill="none"
     stroke="#20D760"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
    <path d="m17 1 4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="m7 23-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </g>
</svg>
<circle cx="850" cy="1311" r="4" fill="#20D760" />
```

The `x/y/width/height` values create an exact 46×46 square centered on the required master coordinates. **Do not add a `scale()` transform.

------------------------------------------------------------------------

# 29. Header Region Issues — Chevron & More-Dots Icons

**Status:** Two visual defects reported in the header (y ≈ 65–170 region).

## 29.1 Chevron Down Icon Orientation Error

**Problem:** Chevron at (120, 105) is rendered rotated 90° to the right instead of pointing downward.

**Current:** Chevron visually points right → ◀  
**Required:** Chevron must point down → ▼

**Specification from Section 6:**
```
center: approximately (120, 105)
visual size: 38 × 22
stroke: 3
color: #FFFFFF

Use an SVG path. Do not use a text glyph such as `⌄`.
```

**Current implementation issue:**
The path `M 100 95 L 140 115 L 100 135` draws a right-pointing triangle. It must be rotated or redrawn to point downward.

**Correct path for downward chevron:**
```svg
<path d="M 100 95 L 120 115 L 140 95" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
```

Or use a rotate transform on the existing path:
```svg
<g transform="translate(120, 105) rotate(90)">
  <path d="M 0 -19 L 20 0 L 0 20" ... />
</g>
```

Verify the chevron points downward after correction.

## 29.2 More-Horizontal (Three Dots) Spacing Issue

**Problem:** Three circles at approximately x=850, x=880, x=910 (spacing 30 units apart) are visually too far apart.

**Current specification (Section 6, Right):**
```
Three horizontal dots.
Use three SVG circles, not the Unicode ellipsis character.
```

Current implementation:
```html
<circle cx="850" cy="105" r="4" fill="#FFFFFF" />
<circle cx="880" cy="105" r="4" fill="#FFFFFF" />
<circle cx="910" cy="105" r="4" fill="#FFFFFF" />
```

**Issue:** Gap of 26 units (30 - 2×4 radius) between dots feels excessive visually.

**Recommendation:** Reduce spacing to 22–24 units apart:
```html
<circle cx="850" cy="105" r="3" fill="#FFFFFF" />
<circle cx="872" cy="105" r="3" fill="#FFFFFF" />
<circle cx="894" cy="105" r="3" fill="#FFFFFF" />
```

Or keep radius=4 but tighten to 26-unit centers:
```html
<circle cx="850" cy="105" r="4" fill="#FFFFFF" />
<circle cx="876" cy="105" r="4" fill="#FFFFFF" />
<circle cx="902" cy="105" r="4" fill="#FFFFFF" />
```

Compare against `/design/reference/wavekeeps-player-classic.png` to match intended visual density.

## 29.3 Implementation action

1. Fix chevron orientation → point downward
2. Adjust three-dots spacing and compare against reference image
3. Re-render at 1000 × 1500
4. Update visual regression snapshot if geometry changes**

## 28.3 Forbidden transforms

For Shuffle and Repeat, the following are forbidden:

```text
scale(...)
scaleX(...)
scaleY(...)
matrix(...)
manual multiplication of path coordinates
independent width/height correction
CSS transform: scale(...)
```

A final optical correction may use only:

```text
translate(x,y), with x/y within ±4 master units
```

and only on the nested SVG's master `x/y`, never on the canonical paths.

## 28.4 Stroke behavior

Do not apply `vector-effect="non-scaling-stroke"` inside these nested 24×24 SVGs unless a regression test proves it is necessary. The local icon should scale normally from 24×24 into its square 46×46 viewport so its optical weight remains coherent.

If stroke appears too heavy/light, adjust the **local** `stroke-width` consistently for both Shuffle and Repeat; never distort geometry to compensate.

## 28.5 Device and Queue

Device and Queue are currently reported as rendering correctly. Do not modify their geometry while resolving Shuffle/Repeat unless the regression comparison demonstrates a real mismatch.

## 28.6 Mandatory diagnostic test

Before marking the distortion issue fixed, render a temporary diagnostic layer containing:

```html
<rect x="127" y="1252" width="46" height="46"
      fill="none" stroke="#FF00FF" stroke-width="1" />
<rect x="827" y="1252" width="46" height="46"
      fill="none" stroke="#FF00FF" stroke-width="1" />
```

Verify both nested SVGs fit inside these **square** boxes without clipping or stretching. Remove diagnostic rectangles before final export.

---

# 29. New Approved Visual Element — Spotify-Style Scannable Code

> **IMPORTANT CORRECTION:** Section 27.2 misunderstood the requested feature. We are NOT adding a Spotify API button, redirect button, or top-right Spotify link as the requested visual feature.

The requested design addition is the familiar **Spotify-style scannable code made of vertical music-like bars**, visually associated with Spotify Codes.

## 29.1 Design intent

Add one horizontal Spotify-style code below the waveform/time region and above the primary playback controls, while preserving the overall Classic player composition.

The code should visually read as:

```text
│ ▂ │ ▆ │ ▃ │ █ │ ▅ │ ▂ │ ▇ │ ▄ │ ▆ │
```

with a Spotify circular logo/icon immediately to the left.

This element is visually different from the WaveKeeps waveform:

- Waveform = song progress visualization.
- Spotify-style code = separate scannable/link visual element.

Do not merge them.

## 29.2 Important functional/legal implementation rule

Do **not** invent a proprietary Spotify Code algorithm and do not claim a generated decorative pattern is an authentic scannable Spotify Code.

WaveKeeps supports two explicit modes:

```ts
spotifyCodeMode: 'official-image' | 'decorative'
```

### `official-image`

The user supplies an authentic Spotify Code image/asset obtained from an authorized source. WaveKeeps places that asset without reconstructing its encoded bars.

### `decorative`

WaveKeeps renders a Spotify-inspired vertical-bar motif for appearance only. It must be treated internally as **non-scannable decorative artwork** and must never be represented in UI/code as an authentic Spotify Code.

If the product later requires universal scanning generated by WaveKeeps, use the project's standard QR system instead of pretending the decorative bars are a Spotify Code.

## 29.3 Master layout revision

To make room without deforming or crowding existing elements, revise the lower section only.

Keep unchanged:

```text
Header:             unchanged
Artwork:            unchanged
Track information:  unchanged
Waveform:           unchanged
Time labels:        unchanged
```

Insert:

```text
Spotify code region:
x = 220
y = 1192
w = 560
h = 72
```

Then shift the playback controls downward:

```text
shuffle center:  (150, 1320)
previous center: (330, 1320)
play center:     (500, 1320)
next center:     (670, 1320)
repeat center:   (850, 1320)
```

Active dots:

```text
shuffle dot: (150, 1356)
repeat dot:  (850, 1356)
```

Bottom utilities:

```text
device center: (150, 1425)
queue center:  (850, 1425)
```

All elements must remain inside the existing 1000×1500 canvas. Do not change the 2:3 master ratio.

## 29.4 Spotify logo placement

Within the code region reserve the left side for a small circular Spotify logo mark:

```text
center: (250, 1228)
diameter: 48
```

When an official Spotify brand asset is available in the project, use that asset. Do not redraw or distort the logo from memory.

For development placeholders only, render a clearly marked neutral circle and replace it before final visual approval.

Do not place a large Spotify logo elsewhere in the card.

## 29.5 Code bars region

Bars occupy approximately:

```text
x: 292
y: 1198
w: 470
h: 60
```

Rules:

- vertical bars only;
- consistent bar width;
- varying heights;
- rounded ends;
- visually centered vertically;
- monochrome or theme-coordinated;
- no conventional QR square modules;
- no second waveform appearance;
- leave enough spacing that the element reads as a Spotify-style code rather than an audio waveform.

Suggested visual values for decorative mode:

```text
bar width: 5
bar gap: 5–7
minimum height: 12
maximum height: 56
bar radius: 2.5
color: #FFFFFF at 0.92 opacity
```

Decorative bar data must be deterministic, not regenerated randomly per render.

## 29.6 Data model update

Extend the current Angular/TypeScript design model with fields equivalent to:

```ts
spotify?: {
  enabled: boolean;
  mode: 'official-image' | 'decorative';
  officialCodeImageUrl?: string;
  trackUrl?: string;
  decorativeBars?: number[];
};
```

`trackUrl` may still be stored for later QR/link functionality, but it does not make a decorative Spotify-style code scannable.

Do not require Spotify Web API/OAuth merely to render this design element.

## 29.7 Rendering behavior

Pseudo-logic:

```ts
if (!spotify?.enabled) {
  // Render no Spotify-code region.
}

if (spotify.mode === 'official-image') {
  // Place supplied authentic code asset with preserved aspect ratio.
}

if (spotify.mode === 'decorative') {
  // Render deterministic vertical bars + Spotify logo asset.
  // This is visual decoration only.
}
```

For an official image:

```text
preserveAspectRatio = xMidYMid meet
never crop
never stretch
```

## 29.8 Do not implement the previously proposed API feature now

The following items from Section 27.2 are **not part of this visual correction and must not be implemented as a prerequisite**:

- Spotify OAuth;
- Spotify Web API track lookup;
- playlist scopes;
- database migration solely for `spotify_track_id`;
- a clickable top-right Spotify button;
- opening `spotify:track:{id}` as the primary requested feature.

They may be considered later as separate product functionality.

---

# 30. Updated Lower-Layout Source of Truth

This section supersedes older Y positions for lower controls whenever the Spotify-style code is enabled.

```text
Waveform:            x=135 y=1060 w=730 h=82
Time labels:         baseline y≈1175
Spotify code region: x=220 y=1192 w=560 h=72
Playback center Y:   1320
Bottom utilities Y:  1425
```

When Spotify code is disabled, the implementation may use the original Classic lower-layout positions, but the choice must be deterministic based on `spotify.enabled`.

Do not use CSS flow/margins to move these elements. Use explicit SVG master coordinates.

---

# 31. Required Claude Action — Current Iteration

Claude must perform this iteration in the following order:

1. Confirm the player still uses a single outer `viewBox="0 0 1000 1500"`.
2. Locate the current Shuffle and Repeat implementation.
3. Remove all manual coordinate scaling (`s = 2` or equivalent).
4. Implement Shuffle and Repeat as nested square SVGs exactly as specified in Section 28.
5. Render the temporary diagnostic boxes and verify there is no distortion.
6. Remove diagnostic boxes.
7. Preserve Device and Queue if they already pass regression.
8. Add the Spotify-style code region described in Section 29.
9. Do **not** implement Spotify OAuth/API work in this iteration.
10. Extend the design data model only as needed for the visual Spotify-code modes.
11. Shift lower controls to the Section 30 coordinates when the Spotify code is enabled.
12. Render at exactly 1000×1500.
13. Run visual regression and inspect for clipping, overlap, icon stretching, and inconsistent spacing.
14. Report:
    - files changed;
    - exact functions/components changed;
    - whether manual scaling was fully removed;
    - whether Shuffle/Repeat now fit square 46×46 viewports;
    - Spotify-code mode used in the test render;
    - screenshot/regression result;
    - any remaining mismatch.

**Do not mark the iteration complete if Shuffle or Repeat remains stretched, or if the new Spotify-style code overlaps the waveform, time labels, playback controls, or bottom utilities.**

---

# 32. Updated Definition of Done

The Classic template iteration is complete only when all previous requirements still pass and additionally:

- [ ] Shuffle uses an unmodified local 24×24 viewBox inside a 46×46 square nested SVG.
- [ ] Repeat uses an unmodified local 24×24 viewBox inside a 46×46 square nested SVG.
- [ ] Neither icon uses manual path scaling or non-uniform transforms.
- [ ] Spotify-style code is visually separate from the waveform.
- [ ] Spotify logo/code element does not distort.
- [ ] Official Spotify Code assets, when supplied, preserve their original aspect ratio.
- [ ] Decorative mode is never labeled internally as an authentic/scannable Spotify Code.
- [ ] No Spotify OAuth/API integration is required for this visual iteration.
- [ ] Playback controls remain symmetric after moving to y=1320.
- [ ] All lower elements remain within the 1000×1500 canvas.
- [ ] Export remains flat, print-safe, and 2:3.

---

# 33. FINAL Corrective Patch — Header, Icon Stability & Spotify Code Above Duration

> **SOURCE OF TRUTH FOR THIS ITERATION:** This section supersedes conflicting geometry or implementation instructions in Sections 27–32. Do not combine old and new lower-layout coordinates. When this section differs from an earlier section, **Section 33 wins**.

## 33.1 Problems to resolve

Resolve all of these without redesigning unrelated areas:

1. Shuffle and Repeat must remain undistorted.
2. Header chevron must point down.
3. Header three-dot menu must use compact spacing.
4. Spotify-style code must appear **ABOVE elapsed/total duration labels**.
5. Lower controls must remain inside the 1000×1500 canvas.
6. Do not introduce Spotify API/OAuth merely to render the visual element.

## 33.2 Header — exact final geometry

### Down chevron

```svg
<path d="M101 96 L120 115 L139 96"
      fill="none" stroke="#FFFFFF" stroke-width="3"
      stroke-linecap="round" stroke-linejoin="round" />
```

Final center: `(120,105)`. It MUST point downward. No rotation, Unicode, CSS transform, mirroring, or filled triangle.

### Three horizontal dots

```svg
<circle cx="856" cy="105" r="3.5" fill="#FFFFFF" />
<circle cx="878" cy="105" r="3.5" fill="#FFFFFF" />
<circle cx="900" cy="105" r="3.5" fill="#FFFFFF" />
```

Use 22 master units between centers. Do not use the older 30-unit spacing.

## 33.3 Shuffle and Repeat — final rendering rule

Keep the canonical 24×24 paths from Section 28. Render each inside a nested square SVG:

```text
viewBox = 0 0 24 24
preserveAspectRatio = xMidYMid meet
viewport = 46 × 46
```

Forbidden: `scale`, `scaleX`, `scaleY`, `matrix`, CSS scaling, manual path-coordinate multiplication, or different width/height.

Final positions:

```text
Shuffle center = (150,1328)
Repeat center  = (850,1328)

Shuffle nested SVG: x=127 y=1305 w=46 h=46
Repeat nested SVG:  x=827 y=1305 w=46 h=46

Shuffle active dot: cx=150 cy=1364 r=4
Repeat active dot:  cx=850 cy=1364 r=4
```

If distortion remains, inspect nested SVG viewport/parent markup. Do not modify canonical paths.

---

# 34. FINAL Spotify-Code Placement — Above Duration Labels

## 34.1 Required vertical order

```text
TRACK TITLE / ARTIST
        ↓
WAVEFORM
        ↓
SPOTIFY-STYLE CODE
        ↓
ELAPSED TIME                         TOTAL DURATION
        ↓
PLAYBACK CONTROLS
        ↓
DEVICE / QUEUE
```

This explicitly supersedes Sections 29–30 where the Spotify-style code was placed after the time labels.

**The Spotify-style code MUST be above the minutes/duration labels.**

## 34.2 Final master coordinates when spotify.enabled === true

```text
Waveform:
x=135 y=1052 w=730 h=68

Spotify-style code:
x=220 y=1128 w=560 h=64

Time-label baseline:
y=1215

Elapsed:
x=135, text-anchor=start

Total duration:
x=865, text-anchor=end

Playback center Y:
1328

Bottom utilities Y:
1432
```

Playback X centers remain:

```text
Shuffle=150
Previous=330
Play=500
Next=670
Repeat=850
```

Bottom utilities:

```text
Device=(150,1432)
Queue=(850,1432)
```

These are the only valid lower-layout coordinates for the Spotify-enabled Classic template after this patch.

## 34.3 Spotify-code internal geometry

```text
Overall: x=220 y=1128 w=560 h=64
Logo center=(250,1160), diameter≈42
Bars: x=286 y=1134 w=476 h=52
Bars vertical center≈1160
```

Decorative bars:

```text
width=5
gap=5–7
min height=10
max height=48
rounded ends=yes
color=#FFFFFF
opacity=0.92
```

The code must not touch the waveform or the time labels.

## 34.4 Official vs decorative mode

Keep:

```ts
spotifyCodeMode: 'official-image' | 'decorative'
```

For `official-image`: preserve supplied authentic asset aspect ratio; never crop/stretch/reconstruct it.

For `decorative`: deterministic visual bars only; do not claim they are scannable or encode the song.

No Spotify Web API/OAuth is required for this visual correction.

---

# 35. Final Time Labels

```text
Elapsed:
x=135
baseline y=1215
font=Inter
font-size=25
font-weight=400
fill=#FFFFFF
text-anchor=start

Duration:
x=865
baseline y=1215
font=Inter
font-size=25
font-weight=400
fill=#FFFFFF
text-anchor=end
```

The time values belong to song progress, not the Spotify-code element. Never place them inside the Spotify-code region.

---

# 36. Final Playback Geometry

When Spotify is enabled:

```text
Shuffle  = (150,1328)
Previous = (330,1328)
Play     = (500,1328)
Next     = (670,1328)
Repeat   = (850,1328)
```

Play/Pause outer circle:

```text
center=(500,1328)
diameter=112
```

Previous/Next visual boxes ≈50×50. Shuffle/Repeat nested viewports =46×46. Do not alter horizontal spacing.

---

# 37. Final Bottom Utilities

```text
Device=(150,1432)
Queue=(850,1432)
visual boxes=40×40
```

Keep fully inside the canvas. Do not move below y=1455. If they already pass regression, do not change their geometry.

---

# 38. Mandatory Diagnostics

Render exactly `1000 × 1500`.

Temporarily add:

```svg
<rect x="127" y="1305" width="46" height="46"
      fill="none" stroke="#FF00FF" stroke-width="1" />
<rect x="827" y="1305" width="46" height="46"
      fill="none" stroke="#FF00FF" stroke-width="1" />
```

Verify:

- Shuffle and Repeat fit their square boxes without stretching.
- Both have the same optical scale.
- Chevron points downward.
- Three dots are compact/even.
- Spotify code is above the time labels.
- Spotify code overlaps neither waveform nor times.
- Times do not overlap controls.
- Device/Queue remain inside canvas.

Remove diagnostic rectangles before final export.

---

# 39. Claude — Required Action

Apply this as a correction, not a redesign:

1. Confirm outer `viewBox="0 0 1000 1500"`.
2. Fix chevron with Section 33 exact path.
3. Replace three-dot coordinates with Section 33 values.
4. Confirm Shuffle/Repeat use untouched 24×24 paths in nested 46×46 SVGs.
5. Remove all manual `s`, `scale`, `matrix`, coordinate multiplication, and non-uniform transforms.
6. Move Shuffle/Repeat to Section 33.3 positions.
7. Move Spotify-style code **above the duration/time labels**.
8. Apply Section 34 geometry.
9. Move elapsed/total labels to y=1215.
10. Move playback controls to y=1328.
11. Move Device/Queue to y=1432.
12. Do not change canvas, artwork, or unrelated geometry.
13. Do not implement Spotify OAuth/API.
14. Render diagnostics at 1000×1500 and verify Section 38.
15. Remove diagnostics.
16. Render final 1000×1500 output and run visual regression.

Report:

```text
- Files modified
- Functions/components modified
- Chevron result
- Three-dot result
- Shuffle viewport dimensions
- Repeat viewport dimensions
- Confirmation manual scaling is absent
- Spotify-code bounding box
- Time-label Y
- Playback-control Y
- Bottom-utilities Y
- Regression result
- Remaining mismatch, if any
```

Do not mark complete if Shuffle/Repeat are stretched, chevron points sideways, dots are too separated, Spotify code is below the time labels, elements overlap, or utilities are clipped.

---

# 40. FINAL Definition of Done

- [ ] Master SVG remains 1000×1500.
- [ ] Chevron points down.
- [ ] Header dots use 22-unit center spacing.
- [ ] Shuffle uses untouched 24×24 paths in a 46×46 nested SVG.
- [ ] Repeat uses untouched 24×24 paths in a 46×46 nested SVG.
- [ ] No manual icon scaling remains.
- [ ] Device/Queue remain undistorted.
- [ ] Waveform remains song-progress visualization.
- [ ] Spotify-style code is visually separate from waveform.
- [ ] Spotify-style code appears **above** elapsed/total minutes.
- [ ] Time labels baseline is y=1215.
- [ ] Playback controls center is y=1328.
- [ ] Device/Queue center is y=1432.
- [ ] No lower-layout overlap exists.
- [ ] Official Spotify Code assets preserve aspect ratio when supplied.
- [ ] Decorative bars are not falsely represented as scannable.
- [ ] No Spotify API/OAuth dependency is introduced for this correction.
- [ ] Diagnostics are absent from final export.
- [ ] Final 1000×1500 regression render passes visual inspection.

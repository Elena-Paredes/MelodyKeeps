# WaveKeeps Front Design --- Crimson Threads

> designId: `crimson-threads`
>
> side: `front`
>
> status: `IMPLEMENTATION_READY`
>
> implementationReady: `true`

------------------------------------------------------------------------

## 1. Purpose

This document defines the design-specific visual contract for the
WaveKeeps front design:

``` text
crimson-threads
```

This file is NOT a global architecture document.

Global visual architecture, asset rules, folder structure and manifest
rules are defined by:

``` text
03-DESIGN-METHOD.md
```

Verified player geometry is defined by:

``` text
02-PLAYER-CONTRACT.md
```

If this design document conflicts with either global contract, the
global contract wins within its corresponding scope.

------------------------------------------------------------------------

## 2. Canonical runtime route

The complete runtime packet for Crimson Threads lives at:

``` text
frontend/src/assets/wavekeeps/designs/front/crimson-threads/
```

Required structure:

``` text
crimson-threads/
├── crimson-threads.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

No additional runtime folders are required.

------------------------------------------------------------------------

## 3. Design identity

Crimson Threads is a mature, dramatic decorative visual family built
around:

``` text
deep crimson threads and ribbons
black accents
ornamental knots
tassels
ink-like textures
red petals
small hanging ornaments
fine decorative lines
controlled negative space
```

The composition must retain a clean white base and substantial negative
space.

The visual language must feel elegant, artistic and deliberate rather
than cute, playful or party-like.

------------------------------------------------------------------------

## 4. Visual direction

Primary characteristics:

``` text
white background
deep crimson/red decorative elements
black and charcoal accents
organic thread/ribbon movement
ornamental knot details
selective ink/watercolor texture
asymmetrical perimeter composition
fine hanging details
small controlled accents
```

The decoration must frame and complement the existing player.

It must NOT become a replacement for the player or force player geometry
changes.

------------------------------------------------------------------------

## 5. Player protection --- mandatory

The existing WaveKeeps player is verified and immutable.

Invariant:

``` text
PLAYER = IMMUTABLE
CRIMSON_DECORATION = ADAPTS
```

Claude MUST NOT:

``` text
remeasure player geometry
move player elements
resize player elements
change player spacing
derive player coordinates from Crimson reference artwork
change artwork-container geometry
change title/artist geometry
change timers
change playback controls
change utility controls
```

If Crimson decoration conflicts with the player:

``` text
correct the decorative asset
or
correct the decorative manifest placement
or
clip/mask the decoration
```

Never modify the player to accommodate Crimson Threads.

------------------------------------------------------------------------

## 6. Canvas

Crimson Threads uses the WaveKeeps master coordinate system:

``` text
width: 1000
height: 1500
aspect ratio: 2:3
```

All final decorative placement is deterministic.

No random or procedural placement is allowed.

------------------------------------------------------------------------

## 7. Asset classification

The final asset type is determined before Claude receives an
implementation-ready packet.

### Complex artwork → PNG

Examples:

``` text
ornamental knots
tassels
ink textures
complex petals
textured ribbons
complex thread intersections
complex translucent elements
ornamental hanging pieces
```

Location:

``` text
assets/png/
```

### Simple deterministic artwork → SVG

Examples:

``` text
simple curves
simple cords
fine hanging lines
dots
four-point sparkles
diamonds
simple geometric accents
```

Location:

``` text
assets/svg/
```

Claude does NOT decide whether an element should be PNG or SVG.

------------------------------------------------------------------------

## 8. PNG requirements

Every final PNG supplied for Crimson Threads must already be
production-ready:

``` text
RGBA
transparent background
clean silhouette
clean antialiasing
no white matte
no black/gray fringe
no source-sheet residue
alpha bleed applied
intrinsic aspect ratio preserved
stable filename
```

Claude does not clean, redraw, trace, vectorize or regenerate these
assets.

------------------------------------------------------------------------

## 9. SVG requirements

Every SVG supplied for Crimson Threads is considered finished decorative
geometry.

Claude may load and render the SVG exactly as declared.

Claude must not artistically reinterpret, redraw or replace it.

------------------------------------------------------------------------

## 10. Asset naming

New Crimson Threads PNG assets use:

``` text
ct-01.png
ct-02.png
ct-03.png
...
```

Simple SVG assets use descriptive stable names such as:

``` text
ct-line-01.svg
ct-line-02.svg
ct-sparkle-01.svg
ct-sparkle-02.svg
ct-accent-01.svg
...
```

Once integrated, filenames are stable.

------------------------------------------------------------------------

## 11. Placement authority

This document intentionally contains NO decorative coordinates.

The sole placement authority is:

``` text
manifest.json
```

The final manifest defines:

``` text
asset
x
y
width
height
rotationDeg
mirrorX
mirrorY
opacity
zIndex
clip/mask behavior when applicable
```

Claude must not infer missing placement from:

``` text
this document
a concept image
a reference image
visual intuition
previous Crimson experiments
```

If required placement information is absent, implementation is blocked
until the manifest is completed.

------------------------------------------------------------------------

## 12. Intermediate material --- forbidden at runtime

The following are NOT production assets:

``` text
crimson-overlay-full.png
crimson-cluster-*.png
reference.png
concept images
QA images
source sheets
temporary crops
extraction files
```

These may exist during asset preparation outside the runtime packet.

Claude must NOT use them as implementation alternatives.

------------------------------------------------------------------------

## 13. No alternative implementation strategy

Crimson Threads has one production strategy only:

``` text
final individual PNG assets
+
final supplied SVG assets
+
manifest.json
+
this design contract
```

Claude must not choose between:

``` text
full overlay vs individual assets
clusters vs individual assets
reference crop vs supplied asset
PNG vs SVG
generated substitute vs supplied asset
```

No such choices exist in the production contract.

------------------------------------------------------------------------

## 14. Allowed Claude operations

For declared decorative assets, Claude may only:

``` text
load
translate
uniformly scale
rotate exactly as specified
mirror exactly as specified
apply specified opacity
apply specified clip/mask
render at specified zIndex
```

------------------------------------------------------------------------

## 15. Forbidden Claude operations

Claude must NOT:

``` text
redraw complex Crimson artwork
trace supplied PNGs
procedurally generate replacement artwork
create substitute assets
change silhouettes
stretch assets non-uniformly
use object-fit: fill
use preserveAspectRatio="none"
move elements by eye
add undeclared decoration
remove declared decoration
change player geometry
```

Missing assets are not permission to improvise.

------------------------------------------------------------------------

## 16. Missing asset behavior

If a final manifest references an asset that is not present, Claude
reports:

``` text
ASSET_MISSING
<exact expected path>
```

Claude does not create a replacement.

------------------------------------------------------------------------

## 17. Layering

Crimson Threads is a decorative front layer.

It must remain visually subordinate to functional WaveKeeps content.

Exact decorative `zIndex` values are supplied by `manifest.json`.

The decoration must not make functional content unreadable or
inaccessible.

A decorative collision is fixed in Crimson assets/manifest, not in the
player.

------------------------------------------------------------------------

## 18. Current implementation status

Current state:

``` text
DESIGN_ID = crimson-threads
DESIGN_CONCEPT = APPROVED
FOLDER_STRUCTURE = DEFINED
FINAL_PNG_ASSETS = READY
FINAL_SVG_ASSETS = READY
FINAL_MANIFEST = READY
IMPLEMENTATION_READY = TRUE
```

Claude may create the required directory structure now.

Claude must NOT implement or invent the final Crimson decorative
composition yet.

Implementation begins only after this document is updated to:

``` text
status: IMPLEMENTATION_READY
implementationReady: true
```

and all assets declared by the completed `manifest.json` exist.

------------------------------------------------------------------------

## 19. Required preflight once implementation-ready

Before implementing Crimson Threads, Claude reports:

``` text
DESIGN PREFLIGHT

designId: crimson-threads
crimson-threads.md: FOUND / MISSING
manifest.json: FOUND / MISSING

all declared assets found: YES / NO
canvas = 1000×1500: YES / NO

implementationReady = true: YES / NO
player geometry modified: NO
undeclared substitute assets created: NO
```

If any required condition fails, Claude stops Crimson implementation and
reports the exact missing requirement.

------------------------------------------------------------------------

## 20. Final invariant

``` text
CRIMSON_THREADS = SELF_CONTAINED_FRONT_DESIGN
PLAYER = UNCHANGED
PLACEMENT_AUTHORITY = manifest.json
COMPLEX_ART = SUPPLIED_PNG
SIMPLE_ART = SUPPLIED_SVG
CLAUDE_IMPROVISATION = FORBIDDEN
```

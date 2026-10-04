# WaveKeeps --- Definitive Visual Design Method & Architecture

> STATUS: LOCKED / SOLE DESIGN-ARCHITECTURE AUTHORITY
>
> This document replaces all previous WaveKeeps decorative asset-path,
> folder-structure, PNG/SVG-selection and manifest-structure
> instructions.

## 1. One runtime structure

Every visual design uses exactly:

``` text
<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

No alternate runtime structures.

## 2. Canonical project routes

All runtime visual designs live under:

``` text
src/assets/wavekeeps/designs/
```

Front:

``` text
src/assets/wavekeeps/designs/front/<design-id>/
```

Back:

``` text
src/assets/wavekeeps/designs/back/<design-id>/
```

Example:

``` text
src/assets/wavekeeps/designs/front/crimson-threads/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

Deprecated runtime routes:

``` text
src/assets/wavekeeps/front-designs/
src/assets/wavekeeps/back-designs/
```

Claude must not create new designs in deprecated routes.

## 3. Migration rule for already-working designs

Existing approved designs may require one one-time move from a
deprecated route into the canonical route.

During migration:

``` text
preserve exact asset bytes
preserve existing filenames
preserve manifest placement
preserve visual result
update only required runtime paths/imports
```

Do NOT rename working assets merely to match a prefix convention.

Therefore the approved Purple Feathers files remain:

``` text
feather-01.png
...
feather-12.png
```

After successful migration:

``` text
one runtime copy only
canonical route only
```

Do not leave duplicate active old/new asset trees.

## 4. Definitive production method

``` text
1. approve concept
2. ChatGPT identifies final decorative elements
3. complex elements → individual transparent PNG
4. clean PNG transparency/RGB + alpha bleed
5. simple deterministic elements → supplied SVG
6. create manifest.json
7. create design.md
8. place packet in canonical route
9. Claude runs preflight
10. Claude renders exactly from manifest
11. render 1000×1500
12. visual review
13. correct asset or manifest; never player
```

## 5. Asset classification

Only the design-preparation side decides asset type.

``` text
complex / organic / painterly / textured / translucent
→ PNG

simple deterministic curve / line / dot / sparkle / geometric outline
→ SVG
```

Claude does NOT decide PNG versus SVG.

## 6. PNG standard

Every PNG reaching Claude is already production-ready:

``` text
RGBA
transparent background
clean silhouette
clean antialiasing
no black/gray matte
no source-sheet residue
alpha bleed applied
intrinsic aspect ratio preserved
stable filename
```

Claude does not clean pixels.

Allowed:

``` text
load
translate
uniform scale
specified rotation
specified mirror
specified opacity
specified clip/mask
```

Forbidden:

``` text
trace
redraw
vectorize
generate substitute
change silhouette
non-uniform stretch
object-fit: fill
preserveAspectRatio="none"
```

## 7. Transparent-edge QA

Before delivery, PNG assets are tested:

``` text
on pure white #FFFFFF
at native size
enlarged
reduced
rotated both directions
with high-quality interpolation
for transparent-corner contamination
for black/gray/color fringe
for source-sheet residue
```

Alpha bleed repairs hidden RGB support pixels without enlarging the
visible silhouette.

This happens before Claude receives the asset.

## 8. SVG standard

SVG is used only for supplied simple deterministic decoration.

Claude loads/renders the supplied SVG.

Claude does not artistically reinterpret its geometry.

## 9. manifest.json = sole placement authority

`manifest.json` contains runtime element identity and placement.

Conceptual schema:

``` json
{
  "designId": "crimson-threads",
  "side": "front",
  "canvas": {
    "width": 1000,
    "height": 1500
  },
  "elements": [
    {
      "id": "ct-01",
      "type": "png",
      "src": "assets/png/ct-01.png",
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 200,
      "rotationDeg": 0,
      "mirrorX": false,
      "mirrorY": false,
      "opacity": 1,
      "zIndex": 1
    }
  ]
}
```

`design.md` must not contain a second competing coordinate table.

Rule:

``` text
manifest.json = placement authority
design.md = visual/implementation rules
```

Claude must not infer missing coordinates from prose or reference
images.

## 10. design.md purpose

Contains only:

``` text
design identity
status
visual language
palette
required asset filenames
protected-content rules
implementation constraints
preflight requirements
```

No duplicate placement geometry.

## 11. References and QA are NOT runtime structure

Concept images, source sheets, extraction work, QA contact sheets and
intermediate files may exist during design preparation.

They do NOT go inside the runtime design packet.

Claude must never receive competing runtime choices such as:

``` text
full overlay OR clusters
old PNG OR new PNG
reference crop OR individual assets
```

The production packet contains only the final declared assets.

## 12. Front rule

``` text
verified player
+
independent decorative design
```

Player geometry is immutable.

If decoration conflicts, correct the decorative asset/manifest or
clip/mask decoration.

## 13. Back rule

Back designs use the exact same structure:

``` text
src/assets/wavekeeps/designs/back/<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

Only content changes.

## 14. Naming

Design IDs:

``` text
lowercase-kebab-case
```

New assets should use stable concise names.

Recommended for NEW designs:

``` text
<design-prefix>-01.png
<design-prefix>-02.png
<design-prefix>-line-01.svg
<design-prefix>-sparkle-01.svg
```

This recommendation does NOT authorize renaming already-integrated
approved assets.

## 15. Preflight

Claude reports:

``` text
DESIGN PREFLIGHT

designId:
design.md: FOUND / MISSING
manifest.json: FOUND / MISSING

<every manifest asset path>: FOUND / MISSING

all declared assets found: YES / NO
canvas = 1000×1500: YES / NO
player geometry modified: NO
undeclared substitute assets created: NO
```

Missing:

``` text
ASSET_MISSING
<exact manifest path>
```

No substitute.

## 16. Definitive prohibition on alternate methods

For production implementation, do NOT use:

``` text
full-overlay fallback
cluster fallback
runtime concept-image crops
runtime source sheets
Claude-generated decorations
Claude-selected asset formats
multiple active asset roots
duplicate old/new design trees
```

If design preparation used any of these internally, they remain outside
the Claude production packet.

## 17. Corrections

``` text
asset edge/shape/color problem
→ replace/fix asset, preferably same filename

position/scale/rotation problem
→ update manifest

simple SVG problem
→ replace/fix SVG

player appears different
→ do not derive a new player measurement from decorative reference
```

## 18. Final invariant

Every future WaveKeeps visual design --- front or back --- uses this
exact architecture and method.

## 19. Adding a new design --- definitive procedure

A new design is added as an independent module under the existing
architecture.

### Front

Create:

``` text
designs/front/<design-id>.md
```

and the runtime packet:

``` text
src/assets/wavekeeps/designs/front/<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

### Back

Create:

``` text
designs/back/<design-id>.md
```

and the runtime packet:

``` text
src/assets/wavekeeps/designs/back/<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

### Files that are NOT changed merely because a design was added

``` text
00-WAVEKEEPS-MASTER.md
01-FUNCTIONAL-FLOW.md
02-PLAYER-CONTRACT.md
03-DESIGN-METHOD.md
```

Do not append a new design's coordinates, palette, asset list or visual
rules to a global contract.

Design-specific information stays inside:

``` text
designs/<side>/<design-id>.md
and
src/assets/wavekeeps/designs/<side>/<design-id>/
```

### When a global document may change

``` text
MASTER
→ documentation routing/precedence/project-wide invariant changed

FUNCTIONAL FLOW
→ application behavior changed

PLAYER CONTRACT
→ intentional approved player behavior/geometry contract changed

DESIGN METHOD
→ universal architecture or production method changed for all designs
```

If none of those conditions is true, the global files remain untouched.

This rule applies to Crimson Threads, Ethereal Ribbons and every future
front/back design.

Invariant:

``` text
DESIGN_ADDITION_IS_LOCAL = TRUE
GLOBAL_CONTRACT_EDIT_BY_DEFAULT = FALSE
```

# WaveKeeps Front Design — Purple Feathers

> DESIGN ID: purple-feathers  
> STATUS: APPROVED / IMPLEMENTED VISUAL FAMILY  
> REQUIRES: `00-WAVEKEEPS-MASTER.md`, `03-DESIGN-METHOD.md`  
> PLAYER: protected by `02-PLAYER-CONTRACT.md`

## 1. Visual identity

```text
pure white background
lavender/purple feathers
thin flowing purple perimeter lines
four-point lavender/purple sparkles
tiny purple diamond/dot accents
```

Do not add:

```text
pink party petals
flowers
confetti
planets
moons
decorative hearts
3D effects
heavy shadows
```

## 2. Decorative palette

```text
primary purple      #8E45E8
secondary lavender  #B99AF4
light lavender      #D9C9FA
deep purple accent  #6F28C8
```

## 3. Asset root

Preferred source hierarchy:

```text
src/assets/wavekeeps/designs/front/classic-white/assets/feathers/
```

Required files:

```text
feather-01.png
feather-02.png
feather-03.png
feather-04.png
feather-05.png
feather-06.png
feather-07.png
feather-08.png
feather-09.png
feather-10.png
feather-11.png
feather-12.png
```

Use the latest edge-cleaned production versions.

Do not use an older contaminated feather pack.

## 4. Feather placement assignment

```text
F01_TOP_LEFT             -> feather-03.png
F02_LEFT_UPPER           -> feather-09.png
F03_LEFT_MIDDLE          -> feather-01.png
F04_LEFT_LOWER_SMALL     -> feather-11.png
F05_BOTTOM_LEFT          -> feather-08.png

F06_TOP_RIGHT_SMALL      -> feather-12.png
F07_RIGHT_UPPER          -> feather-10.png
F08_RIGHT_UPPER_SMALL    -> feather-12.png
F09_RIGHT_MIDDLE_LARGE   -> feather-02.png
F10_RIGHT_MIDDLE_SMALL   -> feather-07.png
F11_RIGHT_LOWER          -> feather-05.png
F12_BOTTOM_CENTER_RIGHT  -> feather-08.png
F13_BOTTOM_RIGHT_LARGE   -> feather-04.png
```

Reuse is intentional.

Claude must not choose alternate feathers.

## 5. Placement geometry

Master canvas:

```text
1000×1500
```

```text
F01_TOP_LEFT
x=90 y=18 w=76 h=176 rotation=-24

F02_LEFT_UPPER
x=42 y=350 w=105 h=104 rotation=-38

F03_LEFT_MIDDLE
x=46 y=585 w=108 h=296 rotation=8

F04_LEFT_LOWER_SMALL
x=44 y=1060 w=61 h=100 rotation=36

F05_BOTTOM_LEFT
x=254 y=1454 w=129 h=46 rotation=22
clip at bottom

F06_TOP_RIGHT_SMALL
x=710 y=166 w=70 h=38 rotation=26

F07_RIGHT_UPPER
x=850 y=272 w=70 h=101 rotation=24

F08_RIGHT_UPPER_SMALL
x=874 y=376 w=40 h=57 rotation=24

F09_RIGHT_MIDDLE_LARGE
x=852 y=444 w=126 h=216 rotation=-25

F10_RIGHT_MIDDLE_SMALL
x=836 y=684 w=72 h=108 rotation=24

F11_RIGHT_LOWER
x=884 y=1018 w=74 h=174 rotation=18

F12_BOTTOM_CENTER_RIGHT
x=666 y=1453 w=82 h=47 rotation=-32
clip at bottom

F13_BOTTOM_RIGHT_LARGE
x=878 y=1200 w=112 h=292 rotation=17
```

All PNGs preserve intrinsic aspect ratio.

If a target box conflicts with intrinsic ratio, report:

```text
ASSET_GEOMETRY_CONFLICT
```

Do not stretch.

## 6. Non-feather decoration

Use SVG for:

```text
thin flow lines
four-point sparkles
diamonds
dots / micro accents
```

Their approved geometry belongs in the design manifest.

Claude may not replace the feather PNGs with SVG.

## 7. Feather preflight

Before rendering:

```text
FEATHER ASSET PREFLIGHT

feather-01.png: FOUND / MISSING
feather-02.png: FOUND / MISSING
feather-03.png: FOUND / MISSING
feather-04.png: FOUND / MISSING
feather-05.png: FOUND / MISSING
feather-06.png: FOUND / MISSING
feather-07.png: FOUND / MISSING
feather-08.png: FOUND / MISSING
feather-09.png: FOUND / MISSING
feather-10.png: FOUND / MISSING
feather-11.png: FOUND / MISSING
feather-12.png: FOUND / MISSING

all 12 found: YES / NO
player geometry modified: NO
```

Do not fabricate substitutes.

## 8. Rendering

Recommended equivalent structure:

```html
<svg viewBox="0 0 1000 1500">
  <g id="background-layer"></g>

  <g id="decoration-overlay" pointer-events="none">
    <!-- flow lines -->
    <!-- feather PNGs -->
    <!-- sparkles -->
    <!-- micro accents -->
  </g>

  <g id="fixed-player">
    <!-- existing verified player -->
  </g>
</svg>
```

Preserve the actual existing Angular architecture if it already uses equivalent layers.

Do not rebuild the player.

## 9. QA

Required:

```text
render = 1000×1500
player geometry modified = NO
feather aspect ratios preserved = YES
black/gray PNG edge contamination = NONE
decorative layer independent = YES
```

If a feather edge is contaminated, replace the asset with a corrected PNG using the same filename.

Do not compensate in player geometry.

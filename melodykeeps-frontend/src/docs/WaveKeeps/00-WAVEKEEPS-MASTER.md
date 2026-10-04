# WaveKeeps --- Master Contract

> STATUS: ACTIVE / AUTHORITATIVE PURPOSE: First document Claude reads.

WaveKeeps is an Angular/TypeScript deterministic two-sided music
keepsake renderer.

## 1. Required reading order

Before modifying WaveKeeps:

``` text
1. Read 00-WAVEKEEPS-MASTER.md.
2. Identify the subsystem.
3. Read only the authoritative contract(s) for that subsystem.
4. Do not consult legacy monolithic contracts for implementation decisions.
```

Routing:

``` text
application behavior / user flow
→ 01-FUNCTIONAL-FLOW.md

verified functional front player
→ 02-PLAYER-CONTRACT.md

ANY front/back visual design, asset, route or manifest
→ 03-DESIGN-METHOD.md

specific front design
→ 03-DESIGN-METHOD.md
→ designs/front/<design-id>.md

specific back design
→ 03-DESIGN-METHOD.md
→ designs/back/<design-id>.md
```

## 2. Authority / precedence

``` text
02-PLAYER-CONTRACT.md
= sole authority for verified player geometry

03-DESIGN-METHOD.md
= sole authority for current visual-design architecture,
  runtime design routes, asset organization and manifest rules

designs/front/<design-id>.md
designs/back/<design-id>.md
= authority for the identity/assets/rules of that specific design

01-FUNCTIONAL-FLOW.md
= authority for application behavior
```

Old monolithic files and old `front-designs/` / `back-designs/`
documentation are:

``` text
LEGACY_REFERENCE_ONLY
NOT_IMPLEMENTATION_AUTHORITY
```

If an old document conflicts with this modular set, this modular set
wins.

## 3. Master canvas

``` text
1000×1500
ratio 2:3
```

## 4. Framework

``` text
Angular + TypeScript
```

Do not migrate frameworks.

## 5. Highest-priority front invariant

``` text
PLAYER_GEOMETRY = VERIFIED + IMMUTABLE
DECORATION = ADAPTS AROUND PLAYER
```

Never remeasure/move/recalculate player geometry while implementing
decoration.

## 6. Responsibility split

``` text
ChatGPT / approved asset packet:
visual design
PNG preparation/cleanup
alpha bleed
SVG decorative assets
manifest placement data
visual QA

Claude:
Angular implementation
load declared assets
render manifest
application flow
tests
1000×1500 capture
report missing assets/conflicts
```

Claude does not redraw or invent approved decoration.

## 7. Initial closed catalog

``` text
swim
animals
spring-day
blood-sweat-tears
mikrokosmos
dna
dimple
im-fine
pied-piper
we-are-bulletproof
fake-love
run
```

Catalog behavior remains data-driven.

## 8. Change isolation

``` text
back design change ≠ front player change
front decoration change ≠ application-flow change
flow change ≠ player-coordinate change
PNG correction ≠ placement change
```

## 9. Legacy path migration

Legacy visual routes such as:

``` text
src/assets/wavekeeps/front-designs/
src/assets/wavekeeps/back-designs/
```

are deprecated.

The definitive route is defined in `03-DESIGN-METHOD.md`.

Migration is a one-time technical task. Existing approved asset
filenames must be preserved during migration unless a specific design
contract explicitly authorizes a rename.

After migration and validation, Claude must not maintain duplicate
runtime copies in both old and new structures.

## 10. Adding a new visual design --- change-isolation policy

Adding a new front or back design is a normal content extension. It does
NOT, by itself, authorize changes to the global architecture or player.

For a new front design `<design-id>` create:

``` text
documentation contract:
designs/front/<design-id>.md

runtime packet:
src/assets/wavekeeps/designs/front/<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

For a new back design `<design-id>` create:

``` text
documentation contract:
designs/back/<design-id>.md

runtime packet:
src/assets/wavekeeps/designs/back/<design-id>/
├── design.md
├── manifest.json
└── assets/
    ├── png/
    └── svg/
```

By default, adding a design MUST NOT modify:

``` text
00-WAVEKEEPS-MASTER.md
01-FUNCTIONAL-FLOW.md
02-PLAYER-CONTRACT.md
03-DESIGN-METHOD.md
```

Those global documents change only for their own scope:

``` text
00-WAVEKEEPS-MASTER.md
→ only when global documentation routing, precedence or project-wide invariants change

01-FUNCTIONAL-FLOW.md
→ only when application behavior/user flow changes

02-PLAYER-CONTRACT.md
→ only when an intentional approved player-contract change occurs

03-DESIGN-METHOD.md
→ only when the universal design architecture/method changes for all designs
```

A design-specific visual revision updates only that design's contract,
manifest and/or assets unless the requested change genuinely crosses one
of the global scopes above.

Invariant:

``` text
NEW_DESIGN = SELF_CONTAINED_MODULE
NEW_DESIGN ≠ GLOBAL_ARCHITECTURE_CHANGE
```

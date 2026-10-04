# WaveKeeps — Functional Flow Contract

> STATUS: DRAFT
> VISUAL GEOMETRY: OUT OF SCOPE.

This document owns application behavior and state transitions.

Known journey:

```text
enter WaveKeeps
↓
choose song
↓
load WaveKeepsSong
↓
resolve/select front design
↓
resolve song-specific back design
↓
preview FRONT / BACK
↓
allowed personalization
↓
resolve QR/link
↓
validate
↓
render
↓
export
```

Claude must not invent undecided UX behavior.

## Catalog

```text
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

## Pending product decisions

```text
FLOW_DECISION_PENDING:
- entry/landing behavior
- song-selection UX
- default song
- front-design recommendation/selection
- persistence of front design across song changes
- back-design locking/alternatives
- allowed personalization
- QR destination/editing behavior
- preview behavior by viewport
- export formats
- print requirements
- persistence/reset behavior
```

Visual asset paths and visual manifests are NOT defined here.
See `03-DESIGN-METHOD.md`.

# WaveKeeps — Verified Player Contract

> STATUS: VERIFIED / LOCKED
> DECORATIVE DESIGN: OUT OF SCOPE.

Master:

```text
1000×1500
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
centerX=835 centerY=930

TIMER_ELAPSED
x=135 y=1215 fontSize=25

TIMER_TOTAL
x=865 y=1215 fontSize=25 textAnchor=end

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

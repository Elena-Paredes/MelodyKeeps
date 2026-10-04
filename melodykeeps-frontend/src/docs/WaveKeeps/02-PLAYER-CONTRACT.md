# WaveKeeps — Verified Player Contract

> STATUS: V2 APPROVED / LOCKED
> APPROVED ACTIVE PLAYER: Spotify Code + Linear Progress + Timers
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

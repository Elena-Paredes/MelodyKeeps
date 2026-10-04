# STATUS UPDATE PARA CHAT

Fecha: 2026-10-04

## 1. Decisión de diseño: nos quedamos con Feathers + Threads V2

Se probaron V3 (hilos recortados) y V4 (una sola composición), y **ninguno gustó**. Se decidió volver a la versión V2, la de los hilos largos por los bordes y bien visibles, y **quedarnos con ese diseño** como front de `purple-feathers`.

**Siguiente paso: esperar el catálogo de colores de Chat.**

Hasta que llegue, no se hace nada de lo siguiente (queda como estaba):
- palette system, variantes de color ni theming;
- recoloreo de plumas o hilos;
- cambios de `designId`.

### Estado actual en el proyecto

```text
Front activo: purple-feathers con Feathers + Threads V2
Elementos decorativos: 19 = 13 plumas + 6 hilos
Capas: fondo blanco -> hilos (zIndex 1) -> plumas (zIndex 2) -> player verificado
Build: PASS
Errores HTTP / SVG / consola: 0 / 0 / 0
Player, plumas y Crimson: sin modificar
```

- **SVG de los hilos:** son los V2 originales, idénticos al paquete que suministró Chat.
- **Manifest:** 19 elementos. Los 6 hilos tienen x 0, y 0, 1000×1500, rotationDeg 0, sin espejo, opacity 1, zIndex 1.
- **Captura de referencia:** `_review/feathers-threads-v2-restored/1-front-completo.png` y `2-solo-decoracion.png`, a 1000×1500.

### Archivos de otras versiones (guardados, sin usar)

| Versión | Dónde está | Activa |
|---|---|---|
| V3 (6 SVG) | `_review/feathers-threads-v3/svg-v3-backup/` | No |
| V4 (1 SVG compuesto) | `purple-feathers/assets/svg/threads-composition-v4.svg` | No, sin entrada en el manifest |
| Crimson Threads | `designs/front/crimson-threads/` | PAUSADO |

### Observaciones de V2 que siguen vigentes

Ya se reportaron y no se corrigieron. Si el catálogo de colores lleva a revisar los hilos, conviene tenerlas presentes:
- Los hilos cruzan por detrás del header, del texto "BTS" y de la zona inferior (controles, device y queue).
- El corazón del hilo derecho queda cerca del corazón funcional del player.
- El hilo rosa superior pasa por detrás del chevron del header.

## 2. Novedad: ya tenemos los códigos de Spotify en forma de ondas para las 12 canciones

Los 12 códigos (logo de Spotify más barras de onda) se encontraron, se descargaron y **ya están conectados al reverso**. Cada canción muestra su propio código.

```text
Códigos encontrados: 12 / 12 (cada uno es distinto)
Mostrados en el reverso de su canción: 12 / 12
Peticiones a Spotify en tiempo de ejecución: 0
```

### Dónde están

Siguen la estructura canónica de `designs/back/<design-id>/`:

```text
src/assets/wavekeeps/designs/back/<id-de-la-canción>/assets/svg/spotify-code.svg
```

IDs: `spring-day`, `swim`, `fake-love`, `dna`, `blood-sweat-tears`, `run`, `mikrokosmos`, `pied-piper`, `dimple`, `we-are-bulletproof`, `im-fine` y `animals`.

Respaldo con PNG y una hoja de contacto: `_review/spotify-codes/`.

### Cómo se obtuvieron

```text
https://scannables.scdn.co/uri/plain/svg/FFFFFF/black/640/spotify:track:<ID>
```

El fondo es hexadecimal, el color del código puede ser `black` o `white`, y el formato `svg` o `png`. El código anterior de la app pedía la URL sin fondo, color ni tamaño, que devuelve 404; por eso el reverso caía siempre al QR de respaldo.

### Cambios en el código

- `BackPlaceholderComponent` recibe ahora la ruta del SVG de su canción (`/assets/wavekeeps/designs/back/<backDesignId>/assets/svg/spotify-code.svg`).
- Se quitó el generador antiguo del QR en `home.component.ts` y el campo `qrDataUrl` de `MusicPlayerDesign`.
- Se borró una carpeta vacía llamada `{spring-day,swim,...}`, residuo de un `mkdir` con llaves que no se expandió.

### Lo que Chat debe saber

- **Tamaño en el reverso:** el código de Spotify es 4 veces más ancho que alto (viewBox 400×100), pero el marcador de posición del reverso es un cuadrado de 500×500. Hoy se ve como una franja angosta en el centro. Cuando haya diseño de reverso, hay que definir el tamaño y la posición del código.
- **Fondo del SVG:** cada SVG trae un rectángulo de fondo del color que se pida (hoy blanco). Si el reverso necesita fondo transparente, hay que decidir cómo quitarlo.
- **Aún sin diseño de reverso:** las 12 carpetas solo tienen el código. No tienen `design.md` ni `manifest.json`, que se crean al aprobar cada reverso.
- **Dependencia externa:** `scannables.scdn.co` es el generador que usa Spotify, pero no es una API con contrato. Por eso los códigos se guardaron como assets propios en vez de pedirlos en cada visita.
- **Sin verificar:** los IDs de las canciones salen de `supported-songs.ts`. No se comprobó que cada ID corresponda al título correcto en Spotify.

## 3. Pendientes que siguen sin tocar

- Documentación sin actualizar: `purple-feathers/design.md` y `src/docs/.../purple-feathers.md` no mencionan los hilos.
- Cleanup: `_recovered/` y `public/assets/wavekeeps/front-designs/` siguen en el proyecto.
- Impresión: `onPrint()` ya captura el front completo, pero la salida de impresión no se ha vuelto a revisar.
- Reverso: sin diseño; solo el código de Spotify está preparado.

## Resumen

1. Front `purple-feathers` + Feathers + Threads V2: **se queda**.
2. **Esperamos el catálogo de colores** antes de tocar paletas o variantes.
3. Los **12 códigos de Spotify** están listos y conectados al reverso.

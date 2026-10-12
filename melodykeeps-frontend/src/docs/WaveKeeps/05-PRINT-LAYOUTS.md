# WaveKeeps — Print Layouts (llavero y sticker)

> STATUS: REVIEW. Valores definidos con pruebas en PDF. Player V3 es candidato en REVIEW
> (no aprobado ni bloqueado); `02-PLAYER-CONTRACT.md` conserva V2 como línea base histórica.

Este documento fija cómo se van a imprimir las piezas. Las medidas salen de las pruebas
hechas con Spring Day. Unidades: "unidades de lienzo" salvo que se indique mm.

Dimensión física oficial del llavero: **38 mm × 49 mm (3.8 cm × 4.9 cm)**, proporción 38:49.
(`3.8 mm × 4.9 mm` fue un error y no es válido.)

## 1. Reglas comunes

- Hoja A4 (210 × 297 mm), margen 1 mm, 5 mm entre piezas, cuadrícula centrada.
- Cada pieza lleva un marco gris fino (0.2 mm, #969696) como línea de corte.
- Imprimir a "Tamaño real" / 100% (no "ajustar a página").
- El **frente** es la captura del front real (`[data-testid="wavekeeps-front"]`) a 1000 × 1500 px.
  No cambia el lienzo del player; la captura se **estira en horizontal** para llenar la pieza.
- El **reverso** no se estira: se compone directamente en la proporción de la pieza.
- Título mostrado en el player: `playerDisplayTitle ?? title`. El título canónico no cambia
  (ej.: "We Are Bulletproof: the Eternal Edition" se muestra "We Are Bulletproof").

## 2. Llavero — 38 × 49 mm

| Concepto | Valor |
|---|---|
| Proporción de la pieza | 38:49 (0.776) |
| Frente | captura 1000×1500 estirada ×1.163 en horizontal (sin recorte, sin franjas) |
| Spotify Code en el frente | NO (queda solo en el reverso) |
| Piezas por hoja | 4 columnas × 5 filas = 20 (6 filas no caben: 6×49+5×5 = 319 > 295 mm) |
| Cuadrícula | 167 × 265 mm, primera pieza en x=21.5 mm, y=16 mm |

### Frente (Player V3f, lienzo 1000 × 1500)

| Elemento | Geometría |
|---|---|
| Header | sin cambios respecto a V2 |
| Portada | cuadrada 690×690, x=155, y=200, radio 28 |
| Título | x=90, y=955, fontSize 50, peso 700 |
| Artista | x=90, y=1005, fontSize 35, peso 400 |
| Corazón | centro (900, 955), forma redondeada universal ≈ 48.2 × 44.2 (misma en todos los modos) |
| Progreso | x 80→920, y=1110, grosor 6, knob r=9; `x = 80 + 840·ratio` |
| Tiempos | y=1150, fontSize 28, x=80 (inicio) y x=920 (fin) |
| Shuffle / Repeat | 52×52 en (75, 1262) y (873, 1262); puntos verdes en (101, 1327) y (899, 1327) |
| Anterior / Siguiente | centros (340, 1288) y (660, 1288), escala ×1.12 |
| Play/Pause | centro (500, 1288), radio 62 |
| Device / Queue | 48×48 en (80, 1368) y (872, 1368) |

Decoración (plumas + hilos V2, variante de la canción) sin cambios.

### Reverso

La autoridad del reverso es `designs/back/README.md` (lienzo 380 × 490, Spotify Code,
zona de silencio, fondo #FFFFFF, lenguaje decorativo, CTA, frase y pie con el título).
Este documento no la duplica. Aquí solo importa cómo se imprime:

- El reverso se compone en 380 × 490 y se coloca en la pieza de 38 × 49 mm **sin estirarse**
  (10 unidades = 1 mm).
- El reverso de prueba (`10-spring-day-reverso.png`: código + frase) fue solo un prototipo para
  validar la proporción y el tamaño del código. **No define** la geometría de la frase ni del
  resto de elementos; esa se decide con el prototipo de Spring Day.

## 3. Sticker — 55 × 75 mm (vertical)

> Medida actual: 5.5 cm de ancho × 7.5 cm de alto (vertical). Antes se había supuesto 55 × 70 mm.
> Si fuera horizontal (75 × 55), hay que rediseñar la composición.

| Concepto | Valor |
|---|---|
| Proporción de la pieza | 55:75 (0.733) |
| Frente | captura 1000×1500 estirada ×1.10 en horizontal |
| Spotify Code en el frente | **SÍ** (a diferencia del llavero) |
| Reverso | no definido todavía |
| Hoja de prueba | una pieza en x=15 mm, y=15 mm; cuadrícula por lote sin definir |

### Frente con código (lienzo 1000 × 1500)

Igual que el llavero, salvo la zona inferior, que vuelve a dejar sitio al código:

| Elemento | Geometría |
|---|---|
| Portada, título, artista, corazón | igual que el llavero (portada 690 en y=200; título 955; artista 1005; corazón 955) |
| Progreso | y=1225 (llavero: 1110) |
| Tiempos | y=1265 (llavero: 1150) |
| Controles | 40 unidades más abajo que el llavero: Play/Pause y flechas en y=1328; Shuffle/Repeat en y=1302 (puntos en y=1367) |
| Device / Queue | y=1408 |
| Spotify Code | caja 34.1 × 8.5 mm (62% del ancho, 4:1), centrada, con centro a 55.9 mm del borde superior (y=1117.5 en el lienzo); dibujo ≈ 31 × 7.7 mm |

### Descarga en la app (modo "Sin diseño")

El botón "Guardar imagen" descarga un PNG con el tamaño del sticker: **1299 × 1772 px a 600 ppp = 5.5 × 7.5 cm**,
con el tamaño físico declarado en el archivo (chunk pHYs). El frente (fondo negro, tema oscuro) se estira
en horizontal para llenar la pieza; el Spotify Code (blanco sobre negro) se dibuja aparte, sin estirar, en
el mismo centro y ancho que la vista previa. Esquinas ligeramente redondeadas: radio de 2 mm, transparentes en el PNG.
Nombre: `<título>-<artista>-sticker-5.5x7.5cm.png`.

El código se coloca **encima del frente ya estirado y sin deformar** (proporción 4:1 exacta).
Con estas medidas el escaneo en el celular funcionó (una prueba más grande, 46 × 11.5 con portada
reducida a 630, se descartó: la lentitud fue por iluminación, no por tamaño).

## 4. Estado en el código y pendientes

| Tema | Estado |
|---|---|
| `home.component.ts`: llavero 38×49 mm, 5 filas | aplicado |
| `home.component.ts`: sticker | **sigue en 75×75 mm** y cuadrícula 4×6 (no refleja 55×75) |
| Botón "Exportar PDF" de la app | dibuja rectángulos con el título, **sin imágenes** |
| Generador de PDF con frente y reverso | no existe versionado; las pruebas se hicieron con scripts temporales (captura Playwright + jsPDF) |
| Spotify Code en el frente del sticker | solo en la prueba; el player de la app no lo muestra |
| Componente `back-placeholder` de la app | no refleja el lienzo 380 × 490 ni la geometría del Spotify Code (runtime sin cambios) |
| Reverso del llavero (decoración) | pendiente: prototipo Spring Day, ver `designs/back/README.md` |
| Reverso del sticker | por definir |
| Escaneo del Spotify Code del llavero (33 mm) impreso | pendiente de probar |
| Orientación del sticker (55×75) | por confirmar |

## 5. Archivos de referencia (no versionados)

`_review/player-v3-legibility/`: `09-spring-day-arrows-closer.png` (frente llavero),
`10-spring-day-reverso.png` (reverso llavero), `14`, `15`, `16` (sticker; ya con la medida anterior 55×70, obsoletas).
PDFs de prueba en el Desktop: `wavekeeps-llavero-38x49-SpringDay-FRENTE-REVERSO-A4.pdf` y
`wavekeeps-sticker-55x70-SpringDay-FRENTE-QR-A4.pdf` (medida anterior, 55×70).

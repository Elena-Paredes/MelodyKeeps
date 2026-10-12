import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SongsService, SongSearchResult } from '../../core/songs.service';
import { PlayerTemplateClassicComponent } from '../../components/music-player/player-template-classic.component';
import { MusicPlayerDesign } from '../../components/music-player/music-player.model';

const FALLBACK_COVER = 'https://i.scdn.co/image/ab67616d0000b27312345678901234567890abcd';

// Código de Spotify en blanco sobre fondo negro (el frente de este modo es negro).
const spotifyCodeUrl = (trackId: string) =>
  `https://scannables.scdn.co/uri/plain/svg/000000/white/640/spotify:track:${trackId}`;

const trackIdFrom = (link: string) => /(?:track\/|track:)([A-Za-z0-9]+)/.exec(link)?.[1] ?? null;

const INTER_CSS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';

// @font-face de Inter (latin y latin-ext, 400 y 700) con los archivos incrustados como data URL.
async function inlineInterFontCss(): Promise<string> {
  const css = await (await fetch(INTER_CSS_URL)).text();
  const faces = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)].filter((m) => m[1] === 'latin' || m[1] === 'latin-ext');
  const inlined = await Promise.all(
    faces.map(async (m) => {
      const url = /url\((https:[^)]+)\)/.exec(m[2])?.[1];
      if (!url) return '';
      return m[2].replace(url, await blobToDataUrl(await (await fetch(url)).blob()));
    }),
  );
  return inlined.join('\n');
}

// Sticker de este modo: 5.5 cm de ancho × 7.5 cm de alto, exportado a 600 ppp.
const STICKER_MM = { w: 55, h: 75 };
const STICKER_RADIUS_MM = 2; // esquinas ligeramente redondeadas (transparentes en el PNG)
const PRINT_DPI = 600;
const mmToPx = (mm: number) => Math.round((mm / 25.4) * PRINT_DPI);

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (bytes: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

// Inserta el chunk pHYs (píxeles por metro) tras IHDR para que el PNG declare su tamaño físico.
async function withPrintDpi(png: Blob, dpi: number): Promise<Blob> {
  const src = new Uint8Array(await png.arrayBuffer());
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21); // longitud(4) + tipo(4) + datos(9) + crc(4)
  const v = new DataView(chunk.buffer);
  v.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  v.setUint32(8, ppm);
  v.setUint32(12, ppm);
  chunk[16] = 1; // unidad: metro
  v.setUint32(17, crc32(chunk.subarray(4, 17)));
  const ihdrEnd = 8 + 25; // firma + chunk IHDR completo
  return new Blob([src.subarray(0, ihdrEnd), chunk, src.subarray(ihdrEnd)], { type: 'image/png' });
}

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

@Component({
  selector: 'app-no-design',
  imports: [PlayerTemplateClassicComponent],
  template: `
    <main class="min-h-screen bg-gradient-to-br from-blush via-lavender to-peach px-4 py-10">
      <div class="max-w-xl mx-auto flex flex-col gap-6">
        <div class="text-center mb-2">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">Sin diseño</h1>
          <p class="text-sm text-plum/60 mt-1">Busca tu canción en Spotify</p>
          <button type="button" (click)="back()" class="text-xs text-plum/60 underline mt-2">← Volver</button>
        </div>

        <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6">
          <h2 class="font-semibold text-plum mb-3">Producto</h2>
          <div class="flex flex-col items-center gap-1 rounded-2xl py-4 border-2 border-accent bg-peach/40" data-testid="product-sticker">
            <span class="text-2xl">⭐</span>
            <span class="text-sm font-medium text-plum">Sticker</span>
            <span class="text-xs text-plum/50">5.5 x 7.5 cm · solo frente</span>
          </div>
        </section>

        <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6">
          <h2 class="font-semibold text-plum mb-3">Buscar canción</h2>
          <form class="flex gap-2" (submit)="search($event)">
            <input
              data-testid="song-search"
              type="search"
              placeholder="Escribe el nombre de la canción"
              autocomplete="off"
              [value]="query()"
              (input)="onType($any($event.target).value)"
              class="flex-1 rounded-xl border border-violet/20 bg-babyblue/30 px-4 py-2.5 text-plum placeholder:text-plum/40 outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button
              type="submit"
              [disabled]="searching() || !query().trim()"
              class="rounded-xl bg-gradient-to-r from-violet to-accent text-white font-semibold px-5 disabled:opacity-50"
            >
              {{ searching() ? 'Buscando…' : 'Buscar' }}
            </button>
          </form>

          @if (error()) {
            <p class="text-sm text-red-600 mt-3">{{ error() }}</p>
          }

          @if (results().length) {
            <div class="mt-4 flex flex-col gap-2 max-h-80 overflow-y-auto" data-testid="song-results">
              @for (r of results(); track r.spotifyLink) {
                <button
                  type="button"
                  (click)="select(r)"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 text-left border-2 transition"
                  [class]="selectedLink() === r.spotifyLink ? 'border-accent bg-peach/40' : 'border-transparent bg-babyblue/20'"
                >
                  @if (r.coverUrl) {
                    <img [src]="r.coverUrl" alt="" class="h-10 w-10 rounded-md object-cover" />
                  }
                  <span class="flex flex-col">
                    <span class="font-semibold text-plum text-sm">{{ r.title }}</span>
                    <span class="text-plum/60 text-xs">{{ r.artist }}</span>
                  </span>
                </button>
              }
            </div>
          } @else if (searched() && !searching() && !error()) {
            <p class="text-sm text-plum/60 mt-3">No encontramos resultados.</p>
          }
        </section>

        @if (design(); as d) {
          <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6">
            <h2 class="font-semibold text-plum mb-4">Vista previa</h2>
            <div class="flex flex-col items-center">
              <p class="text-xs text-plum/60 mb-2">FRENTE · Sticker · sin reverso</p>
              <div #frontBox data-testid="wavekeeps-front-dark" class="w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-lg">
                <app-player-template-classic [design]="d" />
              </div>
              <button
                type="button"
                data-testid="save-image"
                (click)="saveImage()"
                [disabled]="saving()"
                class="mt-4 rounded-xl bg-gradient-to-r from-violet to-accent text-white font-semibold py-2 px-6 shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {{ saving() ? 'Preparando…' : '💾 Guardar imagen' }}
              </button>
              @if (saveError()) {
                <p class="text-sm text-red-600 mt-2">{{ saveError() }}</p>
              }
            </div>
          </section>
        }
      </div>
    </main>
  `,
})
export class NoDesignComponent {
  query = signal('');
  results = signal<SongSearchResult[]>([]);
  searching = signal(false);
  searched = signal(false);
  error = signal<string | null>(null);
  selectedLink = signal<string | null>(null);
  design = signal<MusicPlayerDesign | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);

  @ViewChild('frontBox') frontBox?: ElementRef<HTMLElement>;

  private typed$ = new Subject<string>();
  private submitted$ = new Subject<string>();

  constructor(private songs: SongsService, private router: Router) {
    // Sugerencias al escribir: pausa de 300 ms, mínimo 2 letras, la búsqueda anterior se cancela.
    let last = '';
    merge(this.typed$.pipe(debounceTime(300), distinctUntilChanged()), this.submitted$)
      .pipe(
        filter((q) => q !== last), // misma búsqueda (por ejemplo, teclear y pulsar Enter): no se repite
        tap((q) => {
          last = q;
          this.error.set(null);
          if (q.length < 2) {
            this.results.set([]);
            this.searched.set(false);
          }
          this.searching.set(q.length >= 2);
        }),
        switchMap((q) =>
          q.length < 2
            ? of(null)
            : this.songs.search(q).pipe(
                catchError(() => {
                  last = ''; // permite reintentar la misma búsqueda
                  this.error.set('No se pudo buscar en Spotify. Intenta de nuevo.');
                  return of(null);
                }),
              ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res) {
          this.results.set(res);
          this.searched.set(true);
        }
        this.searching.set(false);
      });
  }

  back() {
    this.router.navigate(['/modo']);
  }

  onType(value: string) {
    this.query.set(value);
    this.typed$.next(value.trim());
  }

  search(event: Event) {
    event.preventDefault();
    this.submitted$.next(this.query().trim());
  }

  // Descarga el frente como PNG de 5.5 × 7.5 cm a 600 ppp. Un SVG usado como imagen no carga recursos
  // externos, así que la portada y el código de Spotify se incrustan antes de dibujarlo.
  async saveImage() {
    const d = this.design();
    const svg = this.frontBox?.nativeElement.querySelector('svg');
    if (!d || !svg) return;
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const W = mmToPx(STICKER_MM.w);
      const H = mmToPx(STICKER_MM.h);
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', String(W));
      clone.setAttribute('height', String(H));
      clone.setAttribute('preserveAspectRatio', 'none'); // el diseño (2:3) se estira para llenar la pieza
      clone.removeAttribute('style');
      // El Spotify Code se dibuja aparte y sin estirar, para que siga escaneando.
      const codeEl = clone.querySelector('image[href*="scannables"]');
      const codeHref = codeEl?.getAttribute('href') ?? null;
      codeEl?.remove();
      clone.querySelectorAll('text').forEach((t) => t.setAttribute('font-family', 'Inter, Arial, Helvetica, sans-serif'));
      const fontCss = await inlineInterFontCss().catch(() => ''); // sin fuente incrustada queda Arial
      if (fontCss) {
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = fontCss;
        clone.insertBefore(style, clone.firstChild);
      }
      await Promise.all(
        [...clone.querySelectorAll('image')].map(async (img) => {
          const href = img.getAttribute('href');
          if (!href || href.startsWith('data:')) return;
          const res = await fetch(href);
          if (!res.ok) throw new Error(`${res.status} ${href}`);
          img.setAttribute('href', await blobToDataUrl(await res.blob()));
        }),
      );

      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      const r = mmToPx(STICKER_RADIUS_MM);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.arcTo(W, 0, W, H, r);
      ctx.arcTo(W, H, 0, H, r);
      ctx.arcTo(0, H, 0, 0, r);
      ctx.arcTo(0, 0, W, 0, r);
      ctx.closePath();
      ctx.clip(); // todo lo que se dibuje después queda recortado a la pieza redondeada
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(image, 0, 0, W, H);
      // La fuente incrustada puede decodificarse tras el primer dibujo: se espera y se repinta.
      await new Promise((r) => setTimeout(r, 200));
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(image, 0, 0, W, H);
      URL.revokeObjectURL(url);

      if (codeHref) {
        const res = await fetch(codeHref);
        if (!res.ok) throw new Error(`${res.status} ${codeHref}`);
        const codeImg = new Image();
        codeImg.src = await blobToDataUrl(await res.blob());
        await codeImg.decode();
        const w = (620 * W) / 1000; // mismo ancho y centro que en la vista previa, proporción 4:1 exacta
        ctx.drawImage(codeImg, (W - w) / 2, (1117.5 * H) / 1500 - w / 8, w, w / 4);
      }

      const raw = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!raw) throw new Error('toBlob devolvió null');
      const png = await withPrintDpi(raw, PRINT_DPI);
      const name = `${d.title}-${d.artist}`.replace(/[^\p{L}\p{N} -]+/gu, '').trim().replace(/\s+/g, '-') || 'sticker';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(png);
      a.download = `${name}-sticker-5.5x7.5cm.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('saveImage failed:', err);
      this.saveError.set('No se pudo guardar la imagen. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }

  select(r: SongSearchResult) {
    const trackId = trackIdFrom(r.spotifyLink);
    if (!trackId) {
      this.error.set('No se pudo obtener el código de Spotify de esta canción.');
      return;
    }
    this.error.set(null);
    this.selectedLink.set(r.spotifyLink);
    this.design.set({
      title: r.title,
      artist: r.artist,
      artworkUrl: r.coverUrl || FALLBACK_COVER,
      spotifyLink: `spotify:track:${trackId}`,
      spotifyCodeUrl: spotifyCodeUrl(trackId),
      theme: 'dark',
      designId: 'generic-dark',
      currentTimeSeconds: 45,
      durationSeconds: 274,
      waveform: [],
      playlistLabel: `${r.artist} // favorites 💜`,
      playbackState: 'playing',
    });
  }
}

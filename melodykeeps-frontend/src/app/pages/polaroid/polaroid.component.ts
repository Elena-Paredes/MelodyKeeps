import { Component, ElementRef, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { firstValueFrom } from 'rxjs';
import { SongsService, SongSearchResult } from '../../core/songs.service';
import { blobToDataUrl, withPrintDpi } from '../../core/front-export';

// Tarjeta polaroid: 55 × 65 mm, marco blanco. Foto cuadrada arriba y, en la franja blanca de abajo,
// SOLO el Spotify Code (negro sobre blanco, sin estirar). Sin título ni artista: la canción es una sorpresa.
const CARD = { w: 55, h: 65, border: 3, photo: 49, codeW: 32, codeH: 8 };
const CARD_RADIUS_MM = 2; // solo en la descarga individual (PNG con esquinas transparentes)
const PRINT_DPI = 600;
const PREVIEW_PX_PER_MM = 6;

// Hoja: A4 horizontal, 5 × 3 = 15 tarjetas. Ese número es el máximo por pasada.
const SHEET = { cols: 5, rows: 3, gapX: 3, gapY: 3 };
const SHEET_COUNT = SHEET.cols * SHEET.rows;

const trackIdFrom = (link: string) => /(?:track\/|track:)([A-Za-z0-9]+)/.exec(link)?.[1] ?? null;
const codeUrl = (trackId: string) => `https://scannables.scdn.co/uri/plain/svg/ffffff/black/640/spotify:track:${trackId}`;

interface PolaroidCard {
  id: number;
  img: HTMLImageElement;
  zoom: number; // 1 = la foto cubre justo el cuadrado
  ox: number; // desplazamiento -1..1 dentro del margen sobrante
  oy: number;
  trackId: string | null;
  songLabel: string; // solo para el organizador; nunca se imprime
  query: string;
  results: SongSearchResult[];
  searching: boolean;
}

const codeCache = new Map<string, Promise<HTMLImageElement>>();
function loadCode(trackId: string): Promise<HTMLImageElement> {
  let p = codeCache.get(trackId);
  if (!p) {
    p = fetch(codeUrl(trackId))
      .then((r) => {
        if (!r.ok) throw new Error(`código ${r.status}`);
        return r.blob();
      })
      .then(blobToDataUrl)
      .then(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.onerror = () => reject(new Error('código inválido'));
            im.src = src;
          }),
      );
    p.catch(() => codeCache.delete(trackId)); // permite reintentar
    codeCache.set(trackId, p);
  }
  return p;
}

// Geometría de la foto dentro del cuadrado, en px del lienzo.
function photoRect(c: PolaroidCard, pxPerMm: number) {
  const pw = CARD.photo * pxPerMm;
  const s = Math.max(pw / c.img.naturalWidth, pw / c.img.naturalHeight) * c.zoom;
  const dw = c.img.naturalWidth * s;
  const dh = c.img.naturalHeight * s;
  const rx = (dw - pw) / 2;
  const ry = (dh - pw) / 2;
  const x = CARD.border * pxPerMm + pw / 2 - dw / 2 + c.ox * rx;
  const y = CARD.border * pxPerMm + pw / 2 - dh / 2 + c.oy * ry;
  return { pw, dw, dh, rx, ry, x, y };
}

function drawCard(canvas: HTMLCanvasElement, c: PolaroidCard, code: HTMLImageElement | null, pxPerMm: number, radiusMm = 0) {
  canvas.width = Math.round(CARD.w * pxPerMm);
  canvas.height = Math.round(CARD.h * pxPerMm);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.beginPath();
  if (radiusMm) ctx.roundRect(0, 0, canvas.width, canvas.height, radiusMm * pxPerMm);
  else ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const r = photoRect(c, pxPerMm);
  ctx.save();
  ctx.beginPath();
  ctx.rect(CARD.border * pxPerMm, CARD.border * pxPerMm, r.pw, r.pw);
  ctx.clip();
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(c.img, r.x, r.y, r.dw, r.dh);
  ctx.restore();

  if (code) {
    const stripTop = CARD.border + CARD.photo;
    const cy = stripTop + (CARD.h - stripTop - CARD.codeH) / 2;
    ctx.drawImage(code, ((CARD.w - CARD.codeW) / 2) * pxPerMm, cy * pxPerMm, CARD.codeW * pxPerMm, CARD.codeH * pxPerMm);
  }
}

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => resolve(im); // el blob se mantiene vivo mientras la imagen esté en uso
    im.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(file.name));
    };
    im.src = url;
  });

@Component({
  selector: 'app-polaroid',
  template: `
    <main class="min-h-screen bg-gradient-to-br from-blush via-lavender to-peach px-4 py-10">
      <div class="max-w-4xl mx-auto flex flex-col gap-6">
        <div class="text-center mb-2">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">Polaroid</h1>
          <p class="text-sm text-plum/60 mt-1">Tu foto arriba, el código de tu canción abajo · 5.5 x 6.5 cm</p>
          <button type="button" (click)="back()" class="text-xs text-plum/60 underline mt-2">← Volver</button>
        </div>

        <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6">
          <h2 class="font-semibold text-plum mb-1">1. Sube tus imágenes</h2>
          <p class="text-xs text-plum/60 mb-3">Máximo {{ max }} por hoja (llevas {{ cards().length }}).</p>
          <input
            data-testid="photo-input"
            type="file"
            accept="image/*"
            multiple
            [disabled]="cards().length >= max"
            (change)="onFiles($event)"
            class="text-sm text-plum"
          />
          @if (notice()) {
            <p class="text-sm text-red-600 mt-3">{{ notice() }}</p>
          }
        </section>

        @if (cards().length) {
          <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6">
            <h2 class="font-semibold text-plum mb-1">2. Elige la canción de cada foto</h2>
            <p class="text-xs text-plum/60 mb-4">Arrastra la foto para encuadrar. El código es lo único que se imprime de la canción.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (c of cards(); track c.id; let i = $index) {
                <div class="rounded-2xl bg-babyblue/20 p-3 flex flex-col gap-2" [attr.data-testid]="'card-' + i">
                  <canvas
                    [id]="'pc-' + c.id"
                    class="w-full rounded-md shadow touch-none cursor-grab bg-white"
                    (pointerdown)="dragStart($event, c)"
                    (pointermove)="dragMove($event, c)"
                    (pointerup)="dragEnd($event)"
                    (pointercancel)="dragEnd($event)"
                  ></canvas>
                  <label class="text-xs text-plum/60 flex items-center gap-2">
                    Zoom
                    <input type="range" min="1" max="3" step="0.05" [value]="c.zoom" (input)="setZoom(c, +$any($event.target).value)" class="flex-1" />
                  </label>
                  <input
                    [attr.data-testid]="'song-search-' + i"
                    type="search"
                    placeholder="Buscar canción"
                    autocomplete="off"
                    [value]="c.query"
                    (input)="onType(c, $any($event.target).value)"
                    class="rounded-xl border border-violet/20 bg-white px-3 py-2 text-sm text-plum outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  @if (c.searching) {
                    <p class="text-xs text-plum/60">Buscando…</p>
                  }
                  @if (c.results.length) {
                    <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
                      @for (r of c.results; track r.spotifyLink) {
                        <button type="button" (click)="pick(c, r)" class="text-left rounded-lg bg-white px-2 py-1 border border-transparent hover:border-accent">
                          <span class="block text-xs font-semibold text-plum">{{ r.title }}</span>
                          <span class="block text-[11px] text-plum/60">{{ r.artist }}</span>
                        </button>
                      }
                    </div>
                  }
                  <p class="text-xs" [class]="c.trackId ? 'text-green-700' : 'text-red-600'">
                    {{ c.trackId ? '✓ ' + c.songLabel : 'Falta elegir la canción' }}
                  </p>
                  <div class="flex gap-2">
                    <button type="button" [disabled]="!c.trackId || busy()" (click)="downloadOne(c, i)" class="flex-1 rounded-xl bg-white border border-violet/30 text-plum text-xs font-semibold py-1.5 disabled:opacity-40">
                      💾 Descargar
                    </button>
                    <button type="button" (click)="remove(c)" class="rounded-xl bg-white border border-violet/30 text-plum text-xs py-1.5 px-3">Quitar</button>
                  </div>
                </div>
              }
            </div>
          </section>

          <section class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6 text-center">
            <h2 class="font-semibold text-plum mb-3">3. Exporta la hoja</h2>
            <button
              type="button"
              data-testid="export-pdf"
              [disabled]="busy() || !ready()"
              (click)="exportPdf()"
              class="rounded-xl bg-gradient-to-r from-violet to-accent text-white font-semibold py-2 px-6 shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {{ busy() ? 'Preparando…' : '📄 Exportar PDF (' + cards().length + ' tarjetas)' }}
            </button>
            @if (!ready()) {
              <p class="text-xs text-red-600 mt-2">Todas las fotos necesitan canción para exportar.</p>
            }
            @if (error()) {
              <p class="text-sm text-red-600 mt-2">{{ error() }}</p>
            }
          </section>
        }
      </div>
    </main>
  `,
})
export class PolaroidComponent {
  readonly max = SHEET_COUNT;
  cards = signal<PolaroidCard[]>([]);
  notice = signal<string | null>(null);
  error = signal<string | null>(null);
  busy = signal(false);
  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private drag: { x: number; y: number; id: number } | null = null;

  constructor(private songs: SongsService, private router: Router, private host: ElementRef<HTMLElement>) {}

  ready = () => this.cards().length > 0 && this.cards().every((c) => c.trackId);

  back() {
    this.router.navigate(['/modo']);
  }

  async onFiles(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    const room = this.max - this.cards().length;
    this.notice.set(files.length > room ? `Solo caben ${this.max} por hoja: se agregaron ${Math.max(room, 0)}.` : null);
    const added: PolaroidCard[] = [];
    for (const f of files.slice(0, Math.max(room, 0))) {
      try {
        const img = await loadImage(f);
        added.push({ id: this.nextId++, img, zoom: 1, ox: 0, oy: 0, trackId: null, songLabel: '', query: '', results: [], searching: false });
      } catch {
        this.notice.set(`No se pudo leer ${f.name}.`);
      }
    }
    this.cards.update((a) => [...a, ...added]);
    setTimeout(() => added.forEach((c) => this.redraw(c)));
  }

  remove(c: PolaroidCard) {
    this.cards.update((a) => a.filter((x) => x !== c));
  }

  setZoom(c: PolaroidCard, z: number) {
    c.zoom = z;
    this.redraw(c);
  }

  dragStart(e: PointerEvent, c: PolaroidCard) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.drag = { x: e.clientX, y: e.clientY, id: c.id };
  }

  dragMove(e: PointerEvent, c: PolaroidCard) {
    if (!this.drag || this.drag.id !== c.id) return;
    const canvas = e.target as HTMLCanvasElement;
    const k = canvas.width / canvas.getBoundingClientRect().width;
    const r = photoRect(c, PREVIEW_PX_PER_MM);
    if (r.rx > 0) c.ox = Math.max(-1, Math.min(1, c.ox + ((e.clientX - this.drag.x) * k) / r.rx));
    if (r.ry > 0) c.oy = Math.max(-1, Math.min(1, c.oy + ((e.clientY - this.drag.y) * k) / r.ry));
    this.drag = { x: e.clientX, y: e.clientY, id: c.id };
    this.redraw(c);
  }

  dragEnd(e: PointerEvent) {
    this.drag = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  // Sugerencias al escribir: pausa de 300 ms, mínimo 2 letras.
  onType(c: PolaroidCard, value: string) {
    c.query = value;
    clearTimeout(this.timers.get(c.id));
    const q = value.trim();
    if (q.length < 2) {
      c.results = [];
      c.searching = false;
      this.cards.update((a) => [...a]);
      return;
    }
    this.timers.set(
      c.id,
      setTimeout(async () => {
        c.searching = true;
        this.cards.update((a) => [...a]);
        try {
          const res = await firstValueFrom(this.songs.search(q));
          if (c.query.trim() === q) c.results = res;
        } catch {
          c.results = [];
          this.notice.set('No se pudo buscar en Spotify. Intenta de nuevo.');
        }
        c.searching = false;
        this.cards.update((a) => [...a]);
      }, 300),
    );
  }

  async pick(c: PolaroidCard, r: SongSearchResult) {
    const id = trackIdFrom(r.spotifyLink);
    if (!id) {
      this.notice.set('No se pudo obtener el código de Spotify de esta canción.');
      return;
    }
    try {
      await loadCode(id); // valida que Spotify devuelva el código antes de asignarlo
    } catch {
      this.notice.set('No se pudo descargar el código de esa canción. Prueba otra.');
      return;
    }
    this.notice.set(null);
    c.trackId = id;
    c.songLabel = `${r.title} — ${r.artist}`;
    c.query = c.songLabel;
    c.results = [];
    this.cards.update((a) => [...a]);
    this.redraw(c);
  }

  private async redraw(c: PolaroidCard) {
    const canvas = this.host.nativeElement.querySelector<HTMLCanvasElement>(`#pc-${c.id}`);
    if (!canvas) return;
    const code = c.trackId ? await loadCode(c.trackId) : null;
    drawCard(canvas, c, code, PREVIEW_PX_PER_MM);
  }

  private async render(c: PolaroidCard, radiusMm: number) {
    const canvas = document.createElement('canvas');
    drawCard(canvas, c, await loadCode(c.trackId!), PRINT_DPI / 25.4, radiusMm);
    return canvas;
  }

  async downloadOne(c: PolaroidCard, i: number) {
    this.busy.set(true);
    this.error.set(null);
    try {
      const canvas = await this.render(c, CARD_RADIUS_MM);
      const raw = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!raw) throw new Error('toBlob devolvió null');
      const png = await withPrintDpi(raw, PRINT_DPI);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(png);
      a.download = `polaroid-${i + 1}-5.5x6.5cm.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('downloadOne failed:', err);
      this.error.set('No se pudo guardar la imagen. Intenta de nuevo.');
    } finally {
      this.busy.set(false);
    }
  }

  async exportPdf() {
    if (!this.ready() || this.busy()) return;
    this.busy.set(true);
    this.error.set(null);
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const gridW = SHEET.cols * CARD.w + (SHEET.cols - 1) * SHEET.gapX;
      const gridH = SHEET.rows * CARD.h + (SHEET.rows - 1) * SHEET.gapY;
      const startX = (297 - gridW) / 2;
      const startY = (210 - gridH) / 2;
      for (const [k, c] of this.cards().entries()) {
        const x = startX + (k % SHEET.cols) * (CARD.w + SHEET.gapX);
        const y = startY + Math.floor(k / SHEET.cols) * (CARD.h + SHEET.gapY);
        const canvas = await this.render(c, 0);
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', x, y, CARD.w, CARD.h, undefined, 'FAST');
        pdf.setLineWidth(0.2);
        pdf.setDrawColor(150);
        pdf.rect(x, y, CARD.w, CARD.h); // línea de corte
      }
      pdf.save(`wavekeeps-polaroid-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('exportPdf failed:', err);
      this.error.set('No se pudo generar el PDF. Intenta de nuevo.');
    } finally {
      this.busy.set(false);
    }
  }
}

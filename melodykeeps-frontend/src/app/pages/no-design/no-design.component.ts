import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, merge, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SongsService, SongSearchResult } from '../../core/songs.service';
import { PlayerTemplateClassicComponent } from '../../components/music-player/player-template-classic.component';
import { MusicPlayerDesign } from '../../components/music-player/music-player.model';
import { renderFrontCanvas, withPrintDpi } from '../../core/front-export';

const FALLBACK_COVER = 'https://i.scdn.co/image/ab67616d0000b27312345678901234567890abcd';

// Código de Spotify en blanco sobre fondo negro (el frente de este modo es negro).
const spotifyCodeUrl = (trackId: string) =>
  `https://scannables.scdn.co/uri/plain/svg/000000/white/640/spotify:track:${trackId}`;

const trackIdFrom = (link: string) => /(?:track\/|track:)([A-Za-z0-9]+)/.exec(link)?.[1] ?? null;


// Sticker de este modo: 5.5 cm de ancho × 7.5 cm de alto, exportado a 600 ppp.
const STICKER_MM = { w: 55, h: 75 };
const STICKER_RADIUS_MM = 2; // esquinas ligeramente redondeadas (transparentes en el PNG)
const PRINT_DPI = 600;

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

  // Descarga el frente como PNG de 5.5 × 7.5 cm a 600 ppp (ver core/front-export.ts).
  async saveImage() {
    const d = this.design();
    const svg = this.frontBox?.nativeElement.querySelector('svg');
    if (!d || !svg) return;
    this.saving.set(true);
    this.saveError.set(null);
    try {
      const canvas = await renderFrontCanvas([svg], d.spotifyCodeUrl ?? null, {
        widthMm: STICKER_MM.w,
        heightMm: STICKER_MM.h,
        dpi: PRINT_DPI,
        radiusMm: STICKER_RADIUS_MM,
        background: '#000000',
      });
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

import { Component, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { jsPDF } from 'jspdf';
import { SongsService, SongSearchResult } from '../../core/songs.service';
import { DesignsService, DesignTemplate } from '../../core/designs.service';
import { SpotifyService } from '../../core/spotify.service';
import { WaveKeepsRendererComponent } from '../../components/music-player/wavekeeps-renderer.component';
import { PlayerTemplateClassicComponent } from '../../components/music-player/player-template-classic.component';
import { BackPlaceholderComponent } from '../../components/music-player/back-placeholder.component';
import { MusicPlayerDesign } from '../../components/music-player/music-player.model';
import { renderFrontCanvas } from '../../core/front-export';
import { BackDesignComponent } from '../../components/music-player/back-design.component';
import { SUPPORTED_SONGS, WaveKeepsSong } from '../../data/supported-songs';

interface DesignOption {
  id: string;
  name: string;
  description: string;
}

const AVAILABLE_DESIGNS: DesignOption[] = [
  { id: 'purple-feathers', name: 'Plumas Púrpura', description: 'Plumas elegantes y líneas fluidas' },
  { id: 'crimson-threads', name: 'Hilos Carmesí', description: 'Cintas y nudos ornamentales' },
];

type Product = 'keychain' | 'sticker' | 'card';

const PRODUCT_TEMPLATE: Record<Product, DesignTemplate> = {
  keychain: DesignTemplate.Keychain,
  sticker: DesignTemplate.Sticker,
  card: DesignTemplate.Card,
};

const PRINT_DPI = 600;

// Medida física de cada pieza (mm): llavero 3.8 × 4.9 cm, sticker 5.5 × 7.5 cm.
const pieceMm = (product: Product) => (product === 'keychain' ? { w: 38, h: 49 } : { w: 55, h: 75 });

// A4, margen 1 mm y 5 mm entre piezas; cuántas caben lo decide la medida real de la pieza
// (llavero 4×5 = 20 por hoja, sticker 3×3 = 9 por hoja). Las hojas se llenan completas: los
// diseños se repiten en el mismo orden del catálogo hasta cubrir todas las posiciones.
const SHEET = { width: 210, height: 297, margin: 1, gap: 5 };
const sheetPlan = (product: Product, designs: number) => {
  const { w, h } = pieceMm(product);
  const cols = Math.floor((SHEET.width - SHEET.margin * 2 + SHEET.gap) / (w + SHEET.gap));
  const rows = Math.floor((SHEET.height - SHEET.margin * 2 + SHEET.gap) / (h + SHEET.gap));
  const perPage = cols * rows;
  return { w, h, cols, rows, perPage, total: Math.ceil(designs / perPage) * perPage };
};

@Component({
  selector: 'app-home',
  imports: [WaveKeepsRendererComponent, PlayerTemplateClassicComponent, BackPlaceholderComponent, BackDesignComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly products: { id: Product; label: string; size: string; icon: string }[] = [
    { id: 'keychain', label: 'Llavero', size: '3.8 x 4.9 cm', icon: '🔑' },
    { id: 'sticker', label: 'Sticker', size: '5.5 x 7.5 cm', icon: '⭐' },
  ];


  usesOwnPhoto = signal(false);
  photoPreviewUrl = signal<string | null>(null);

  selectedProduct = signal<Product | null>(null);

  creating = signal(false);
  createError = signal<string | null>(null);
  createdDesignId = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  playerDesign = signal<MusicPlayerDesign | null>(null);

  selectedDesignId = signal<string>('purple-feathers');
  availableDesigns = signal<DesignOption[]>(AVAILABLE_DESIGNS);

  supportedSongs = signal<WaveKeepsSong[]>(SUPPORTED_SONGS);
  selectedSongId = signal<string | null>(null);
  selectedSongData = signal<WaveKeepsSong | null>(null);

  exporting = signal(false);
  exportError = signal<string | null>(null);

  // Print batch (12 designs)
  printAllLayouts = signal<{ product: Product; designs: (MusicPlayerDesign & { song: WaveKeepsSong })[] } | null>(null);

  constructor(
    private songs: SongsService,
    private designs: DesignsService,
    private router: Router,
    private spotify: SpotifyService
  ) {}

  ngOnInit(): void {
    // Async load Spotify covers if not already set
    this.supportedSongs().forEach((song) => {
      if (song.spotifyTrackId && !song.coverUrl) {
        this.spotify.getTrackData(song.spotifyTrackId).subscribe({
          next: (data) => {
            song.coverUrl = data.coverUrl;
            console.log(`✓ Loaded cover for ${song.id}`);
          },
          error: (err) => {
            console.warn(`✗ Failed to load cover for ${song.id}:`, err.status);
            // Fallback: use placeholder
            song.coverUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="24"%3EAlbum Art%3C/text%3E%3C/svg%3E';
          },
        });
      }
    });
  }

  selectSupportedSong(song: WaveKeepsSong) {
    this.selectedSongId.set(song.id);
    this.selectedSongData.set(song);

    const newDesign: MusicPlayerDesign = {
      title: song.title,
      playerDisplayTitle: song.playerDisplayTitle,
      artist: song.artist,
      artworkUrl: song.coverUrl || 'https://i.scdn.co/image/ab67616d0000b27312345678901234567890abcd',
      spotifyLink: `spotify:track:${song.spotifyTrackId}`,
      designId: this.selectedDesignId(),
      backDesignId: song.backDesignId,
      variantId: song.variantId,
      currentTimeSeconds: 45,
      durationSeconds: 274,
      waveform: Array(100).fill(0).map(() => Math.random()),
      playlistLabel: `${song.artist} // favorites 💜`,
      playbackState: 'playing'
    };

    this.playerDesign.set(newDesign);

    console.log('✓ Song selected:', song.id);
  }

  selectDesign(designId: string) {
    this.selectedDesignId.set(designId);
    if (this.playerDesign()) {
      const design = this.playerDesign()!;
      design.designId = designId;
      this.playerDesign.set({ ...design });
    }
  }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.photoPreviewUrl.set(URL.createObjectURL(file));
  }

  selectProduct(id: Product) {
    this.selectedProduct.set(id);
    this.generatePrintBatch(id);
  }

  generatePrintBatch(product: Product) {
    const designs = this.supportedSongs().map(song => ({
      title: song.title,
      playerDisplayTitle: song.playerDisplayTitle,
      artist: song.artist,
      artworkUrl: song.coverUrl || 'https://i.scdn.co/image/ab67616d0000b27312345678901234567890abcd',
      spotifyLink: `spotify:track:${song.spotifyTrackId}`,
      designId: this.selectedDesignId(),
      backDesignId: song.backDesignId,
      variantId: song.variantId,
      currentTimeSeconds: 45,
      durationSeconds: 274,
      waveform: Array(100).fill(0).map(() => Math.random()),
      playlistLabel: `${song.artist} // favorites 💜`,
      playbackState: 'playing' as const,
      // El sticker lleva el Spotify Code en el frente (local); el llavero lo lleva solo en el reverso.
      spotifyCodeUrl: product === 'sticker' ? `/assets/wavekeeps/designs/back/${song.backDesignId}/assets/svg/spotify-code.svg` : undefined,
      song,
    }));

    this.printAllLayouts.set({ product, designs });
  }

  async onCreateDesign() {
    const design = this.playerDesign();
    const product = this.selectedProduct();
    if (!design || !product) {
      this.createError.set('Elige una canción y un producto.');
      return;
    }

    this.createError.set(null);
    this.creating.set(true);
    this.createdDesignId.set(null);
    try {
      const savedSong = await new Promise<{ id: string }>((resolve, reject) =>
        this.songs
          .create({ title: design.title, artist: design.artist, coverUrl: design.artworkUrl, link: design.spotifyLink })
          .subscribe({ next: resolve, error: reject })
      );
      const designResult = await new Promise<{ id: string }>((resolve, reject) =>
        this.designs.create(savedSong.id, PRODUCT_TEMPLATE[product]).subscribe({ next: resolve, error: reject })
      );
      this.createdDesignId.set(designResult.id);

      const printBlob = await new Promise<Blob>((resolve, reject) =>
        this.designs.getPrintImage(designResult.id).subscribe({ next: resolve, error: reject })
      );
      if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
      this.previewUrl.set(URL.createObjectURL(printBlob));
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.createError.set('No se pudo crear el diseño. Intenta de nuevo.');
      }
    } finally {
      this.creating.set(false);
    }
  }

  onPrint() {
    const printWindow = window.open('', '_blank');
    if (printWindow && this.playerDesign()) {
      const svgContent = document.querySelector('[data-testid="wavekeeps-front"]')?.outerHTML || '';
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 10mm; background: white; }
            svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Piezas que lleva el PDF del lote (las hojas se llenan completas).
  sheetTotal(batch: { product: Product; designs: unknown[] }): number {
    return sheetPlan(batch.product, batch.designs.length).total;
  }

  // Renderiza cada frente del lote (decoración + player) a la medida física de la pieza.
  private async renderBatchImages(): Promise<{ song: WaveKeepsSong; dataUrl: string }[]> {
    const batch = this.printAllLayouts();
    if (!batch) return [];
    const { w, h } = pieceMm(batch.product);

    const nodes = () => [...document.querySelectorAll<HTMLElement>('[data-batch-front]')];
    const ready = () =>
      nodes().length === batch.designs.length && nodes().every((n) => n.querySelector('[data-testid^="wavekeeps-renderer-"] image'));
    for (let i = 0; i < 100 && !ready(); i++) await new Promise((r) => setTimeout(r, 150));
    if (!ready()) throw new Error('Los frentes aún no terminaron de cargar.');

    const cache = new Map<string, string>();
    const out: { song: WaveKeepsSong; dataUrl: string }[] = [];
    for (const design of batch.designs) {
      const node = nodes().find((n) => n.dataset['songId'] === design.song.id)!;
      const layers = [
        node.querySelector('[data-testid^="wavekeeps-renderer-"]'),
        node.querySelector('[data-testid="wavekeeps-player"]'),
      ] as SVGSVGElement[];
      const canvas = await renderFrontCanvas(layers, design.spotifyCodeUrl ?? null, {
        widthMm: w,
        heightMm: h,
        dpi: PRINT_DPI,
        background: '#FFFFFF',
        cache,
      });
      out.push({ song: design.song, dataUrl: canvas.toDataURL('image/png') });
    }
    return out;
  }

  // Renderiza el reverso de cada canción del lote (lienzo 380×490 → 38×49 mm, sin estirar).
  private async renderBatchBackImages(): Promise<{ song: WaveKeepsSong; dataUrl: string }[]> {
    const batch = this.printAllLayouts();
    if (!batch) return [];

    const nodes = () => [...document.querySelectorAll<HTMLElement>('[data-batch-back]')];
    const ready = () =>
      nodes().length === batch.designs.length &&
      nodes().every((n) => n.querySelector('g[clip-path] image') && n.querySelector('[data-testid="back-quote"] tspan') && n.querySelector('[data-testid="back-title"] tspan'));
    for (let i = 0; i < 100 && !ready(); i++) await new Promise((r) => setTimeout(r, 150));
    if (!ready()) throw new Error('Los reversos aún no terminaron de cargar.');

    const cache = new Map<string, string>();
    const out: { song: WaveKeepsSong; dataUrl: string }[] = [];
    for (const design of batch.designs) {
      const node = nodes().find((n) => n.dataset['songId'] === design.song.id)!;
      const canvas = await renderFrontCanvas([node.querySelector('svg') as SVGSVGElement], null, {
        widthMm: 38,
        heightMm: 49,
        dpi: PRINT_DPI,
        background: '#FFFFFF',
        canvas: { width: 380, height: 490 },
        cache,
      });
      out.push({ song: design.song, dataUrl: canvas.toDataURL('image/png') });
    }
    return out;
  }


  async exportBatchToPdf() {
    const batch = this.printAllLayouts();
    if (!batch || this.exporting()) return;
    this.exporting.set(true);
    this.exportError.set(null);
    try {
      const images = await this.renderBatchImages();
      const backs = batch.product === 'keychain' ? await this.renderBatchBackImages() : [];
      const { w, h, cols, perPage, total } = sheetPlan(batch.product, images.length);
      const { width, height, margin, gap } = SHEET;
      const rows = perPage / cols;
      const startX = margin + (width - margin * 2 - (cols * w + (cols - 1) * gap)) / 2;
      const startY = margin + (height - margin * 2 - (rows * h + (rows - 1) * gap)) / 2;

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      // `mirror`: el reverso se imprime a doble cara (voltear por el borde largo), así que cada
      // pieza va en la columna opuesta para quedar justo detrás de su frente.
      const place = (dataUrl: string, k: number, mirror: boolean) => {
        const col = mirror ? cols - 1 - (k % cols) : k % cols;
        const x = startX + col * (w + gap);
        const y = startY + Math.floor(k / cols) * (h + gap);
        pdf.addImage(dataUrl, 'PNG', x, y, w, h, undefined, 'FAST');
        pdf.setLineWidth(0.2);
        pdf.setDrawColor(150);
        pdf.rect(x, y, w, h); // línea de corte
      };
      // Mismo orden del catálogo; al acabar los 12 se vuelve a empezar hasta llenar la hoja.
      for (let sheet = 0; sheet < total / perPage; sheet++) {
        if (sheet > 0) pdf.addPage();
        for (let k = 0; k < perPage; k++) place(images[(sheet * perPage + k) % images.length].dataUrl, k, false);
        if (backs.length) {
          pdf.addPage();
          for (let k = 0; k < perPage; k++) place(backs[(sheet * perPage + k) % backs.length].dataUrl, k, true);
        }
      }

      const filename = `wavekeeps-${batch.product}-batch-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
      console.log(`✓ PDF exported: ${filename} (${total} piezas, ${images.length} diseños${backs.length ? ', con reversos' : ''})`);
    } catch (err) {
      console.error('exportBatchToPdf failed:', err);
      this.exportError.set('No se pudo generar el PDF. Intenta de nuevo.');
    } finally {
      this.exporting.set(false);
    }
  }
}

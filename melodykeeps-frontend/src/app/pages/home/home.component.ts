import { Component, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SongsService, SongSearchResult } from '../../core/songs.service';
import { DesignsService, DesignTemplate } from '../../core/designs.service';
import { SpotifyService } from '../../core/spotify.service';
import { WaveKeepsRendererComponent } from '../../components/music-player/wavekeeps-renderer.component';
import { PlayerTemplateClassicComponent } from '../../components/music-player/player-template-classic.component';
import { BackPlaceholderComponent } from '../../components/music-player/back-placeholder.component';
import { MusicPlayerDesign } from '../../components/music-player/music-player.model';
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

@Component({
  selector: 'app-home',
  imports: [WaveKeepsRendererComponent, PlayerTemplateClassicComponent, BackPlaceholderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly products: { id: Product; label: string; size: string; icon: string }[] = [
    { id: 'keychain', label: 'Llavero', size: '5 x 5 cm', icon: '🔑' },
    { id: 'sticker', label: 'Sticker', size: '7.5 x 7.5 cm', icon: '⭐' },
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
      artist: song.artist,
      artworkUrl: song.coverUrl || 'https://i.scdn.co/image/ab67616d0000b27312345678901234567890abcd',
      spotifyLink: `spotify:track:${song.spotifyTrackId}`,
      designId: this.selectedDesignId(),
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
    // Player design is already set when selectSupportedSong is called
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
}

import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicPlayerDesign } from './music-player.model';
import * as QRCode from 'qrcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-player-template-classic',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (design) {
      <svg
        [attr.viewBox]="'0 0 1000 1500'"
        [attr.preserveAspectRatio]="'xMidYMid meet'"
        [style.aspectRatio]="'2 / 3'"
        [style.width]="'100%'"
        [style.height]="'auto'"
        [attr.data-testid]="'wavekeeps-player'"
      >
      <!-- Header -->
      <g id="header">
        <!-- Chevron Down -->
        <path
          d="M101 96 L120 115 L139 96"
          [attr.stroke]="theme.text"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Header Text Line 1 -->
        <text
          x="500"
          y="95"
          text-anchor="middle"
          font-family="Inter"
          font-weight="400"
          font-size="21"
          letter-spacing="3"
          [attr.fill]="theme.text"
          opacity="0.90"
        >
          PLAYING FROM PLAYLIST
        </text>

        <!-- Header Text Line 2 -->
        <text
          x="500"
          y="135"
          text-anchor="middle"
          font-family="Inter"
          font-weight="400"
          font-size="27"
          [attr.fill]="theme.text"
        >
          {{ design.playlistLabel || 'BTS // favorites 💜' }}
        </text>

        <!-- More dots Right (22-unit spacing) -->
        <circle cx="856" cy="105" r="3.5" [attr.fill]="theme.text" />
        <circle cx="878" cy="105" r="3.5" [attr.fill]="theme.text" />
        <circle cx="900" cy="105" r="3.5" [attr.fill]="theme.text" />
      </g>

      <!-- Album Artwork -->
      <defs>
        <clipPath id="artwork-clip">
          <rect x="170" y="205" width="660" height="660" rx="28" ry="28" />
        </clipPath>
      </defs>
      <image
        x="170"
        y="205"
        width="660"
        height="660"
        [attr.href]="design.artworkUrl"
        clip-path="url(#artwork-clip)"
        preserveAspectRatio="xMidYMid slice"
      />

      <!-- Track Information -->
      <text
        x="135"
        y="930"
        font-family="Inter"
        font-weight="700"
        font-size="43"
        [attr.fill]="theme.text"
      >
        {{ design.title }}
      </text>
      <text
        x="135"
        y="980"
        font-family="Inter"
        font-weight="400"
        font-size="30"
        [attr.fill]="theme.secondaryText"
      >
        {{ design.artist }}
      </text>

      <!-- Heart Icon -->
      <path
        [attr.d]="getHeartPath(835, 930)"
        [attr.stroke]="theme.heart"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Waveform -->
      <defs>
        <linearGradient id="waveform-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" [attr.stop-color]="theme.accentStart" />
          <stop offset="100%" [attr.stop-color]="theme.accentEnd" />
        </linearGradient>
      </defs>
      <g id="waveform">
        <rect *ngFor="let bar of getWaveformBars()"
          [attr.x]="bar.x"
          [attr.y]="bar.y"
          [attr.width]="bar.width"
          [attr.height]="bar.height"
          rx="3"
          ry="3"
          [attr.fill]="bar.fill"
        />
      </g>

      <!-- Time Labels -->
      <text
        x="135"
        y="1215"
        font-family="Inter"
        font-weight="400"
        font-size="25"
        [attr.fill]="theme.text"
        text-anchor="start"
      >
        {{ formatTime(design.currentTimeSeconds) }}
      </text>
      <text
        x="865"
        y="1215"
        font-family="Inter"
        font-weight="400"
        font-size="25"
        [attr.fill]="theme.text"
        text-anchor="end"
      >
        {{ formatTime(design.durationSeconds) }}
      </text>

      <!-- Spotify-style code placeholder (x=220 y=1128 w=560 h=64) - to be implemented per theme -->
      <!-- This region reserved for Spotify code or official code asset -->

      <!-- Playback Controls -->
      <g id="controls">
        <!-- Shuffle (nested SVG) -->
        <svg x="127" y="1305" width="46" height="46" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <g fill="none" [attr.stroke]="theme.controlActive" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="m15 15 6 6" />
            <path d="m4 4 5 5" />
          </g>
        </svg>
        <circle cx="150" cy="1364" r="4" [attr.fill]="theme.controlActive" />

        <!-- Previous -->
        <path
          [attr.d]="getPreviousIcon(330, 1328)"
          [attr.fill]="theme.text"
          stroke-width="0"
        />

        <!-- Play/Pause (Circle + Icon) -->
        <circle cx="500" cy="1328" r="56" [attr.fill]="theme.text" />
        <path
          [attr.d]="design.playbackState === 'playing' ? getPauseIcon(500, 1328) : getPlayIcon(500, 1328)"
          [attr.fill]="getPlayPauseIconColor()"
          stroke-width="0"
        />

        <!-- Next -->
        <path
          [attr.d]="getNextIcon(670, 1328)"
          [attr.fill]="theme.text"
          stroke-width="0"
        />

        <!-- Repeat (nested SVG) -->
        <svg x="827" y="1305" width="46" height="46" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <g fill="none" [attr.stroke]="theme.controlActive" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m17 1 4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="m7 23-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </g>
        </svg>
        <circle cx="850" cy="1364" r="4" [attr.fill]="theme.controlActive" />
      </g>

      <!-- Bottom Utilities -->
      <!-- Device -->
      <svg x="130" y="1412" width="40" height="40" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g fill="none" [attr.stroke]="theme.text" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 22h8" />
          <path d="M12 18v4" />
        </g>
      </svg>
      <!-- Queue -->
      <svg x="830" y="1412" width="40" height="40" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g fill="none" [attr.stroke]="theme.text" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h12" />
          <path d="M3 12h12" />
          <path d="M3 18h8" />
          <path d="m17 16 4 2-4 2z" [attr.fill]="theme.text" />
        </g>
      </svg>
      </svg>
    } @else {
      <div style="width: 100%; padding: 20px; text-align: center; color: #999;">No design selected</div>
    }
  `,
  styles: [],
})
export class PlayerTemplateClassicComponent implements OnChanges {
  @Input() design!: MusicPlayerDesign;

  readonly theme = {
    text: '#111111',
    secondaryText: '#66666F',
    heart: '#3A3A42',
    accentStart: '#111111',
    accentEnd: '#111111',
    controlActive: '#20D760',
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['design'] && this.design) {
      this.generateQR();
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getWaveformBars(): any[] {
    // ponytail: deterministic waveform from data, not random
    const progress = this.design.currentTimeSeconds / this.design.durationSeconds;
    const barWidth = 6;
    const gap = 5;
    const minHeight = 10;
    const maxHeight = 68;
    const centerY = 1086;
    const startX = 135;
    const containerWidth = 730;

    const numBars = Math.floor(containerWidth / (barWidth + gap));
    const bars: any[] = [];

    this.design.waveform.forEach((amp, i) => {
      if (i >= numBars) return;
      const x = startX + i * (barWidth + gap);
      const height = minHeight + amp * (maxHeight - minHeight);
      const y = centerY - height / 2;
      const isActive = i / numBars < progress;
      const color = isActive ? 'url(#waveform-gradient)' : this.getInactiveWaveformColor();

      bars.push({ x, y, width: barWidth, height, fill: color });
    });

    return bars;
  }

  private getInactiveWaveformColor(): string {
    // Muted version of accent start
    return '#D7D7DE';
  }

  getHeartPath(cx: number, cy: number): string {
    const size = 21.5;
    return `
      M ${cx - size} ${cy - size * 0.5}
      C ${cx - size} ${cy - size * 1.2},
        ${cx - size * 0.6} ${cy - size * 1.5},
        ${cx} ${cy - size * 0.8}
      C ${cx + size * 0.6} ${cy - size * 1.5},
        ${cx + size} ${cy - size * 1.2},
        ${cx + size} ${cy - size * 0.5}
      C ${cx + size} ${cy + size * 0.3},
        ${cx + size * 0.3} ${cy + size * 0.8},
        ${cx} ${cy + size}
      C ${cx - size * 0.3} ${cy + size * 0.8},
        ${cx - size} ${cy + size * 0.3},
        ${cx - size} ${cy - size * 0.5}
    `;
  }

  getPlayIcon(cx: number, cy: number): string {
    return `M ${cx - 12} ${cy - 18} L ${cx - 12} ${cy + 18} L ${cx + 20} ${cy} Z`;
  }

  getPauseIcon(cx: number, cy: number): string {
    return `
      M ${cx - 10} ${cy - 18} L ${cx - 4} ${cy - 18} L ${cx - 4} ${cy + 18} L ${cx - 10} ${cy + 18} Z
      M ${cx + 4} ${cy - 18} L ${cx + 10} ${cy - 18} L ${cx + 10} ${cy + 18} L ${cx + 4} ${cy + 18} Z
    `;
  }

  getPreviousIcon(cx: number, cy: number): string {
    return `
      M ${cx + 15} ${cy - 18} L ${cx + 15} ${cy + 18} L ${cx - 10} ${cy} Z
      M ${cx - 15} ${cy - 18} L ${cx - 15} ${cy + 18}
    `;
  }

  getNextIcon(cx: number, cy: number): string {
    return `
      M ${cx - 15} ${cy - 18} L ${cx - 15} ${cy + 18} L ${cx + 10} ${cy} Z
      M ${cx + 15} ${cy - 18} L ${cx + 15} ${cy + 18}
    `;
  }

  getShuffleIcon(cx: number, cy: number): string {
    const s = 2; // scale factor
    return `
      M ${cx - 16*s} ${cy - 14*s} L ${cx + 16*s} ${cy - 14*s}
      M ${cx + 16*s} ${cy - 3*s} L ${cx + 21*s} ${cy + 2*s}
      L ${cx + 16*s} ${cy + 9*s}
      M ${cx - 16*s} ${cy + 14*s} L ${cx + 16*s} ${cy + 14*s}
      M ${cx - 8*s} ${cy - 4*s} L ${cx - 3*s} ${cy + 3*s}
      M ${cx - 8*s} ${cy + 4*s} L ${cx - 3*s} ${cy - 3*s}
    `;
  }

  getRepeatIcon(cx: number, cy: number): string {
    const s = 2;
    return `
      M ${cx + 17*s} ${cy - 23*s} L ${cx + 21*s} ${cy - 19*s}
      L ${cx + 13*s} ${cy - 19*s}
      M ${cx + 3*s} ${cy - 11*s} L ${cx + 21*s} ${cy - 11*s}
      M ${cx - 7*s} ${cy + 23*s} L ${cx - 11*s} ${cy + 19*s}
      L ${cx - 3*s} ${cy + 19*s}
      M ${cx + 21*s} ${cy + 13*s} L ${cx + 3*s} ${cy + 13*s}
    `;
  }

  getDeviceIcon(cx: number, cy: number): string {
    const scale = 1.67; // 40px visual box / 24 viewBox
    return `
      M ${cx + 3 * scale} ${cy + 4 * scale} L ${cx + 21 * scale} ${cy + 4 * scale}
      Q ${cx + 23 * scale} ${cy + 4 * scale} ${cx + 23 * scale} ${cy + 6 * scale}
      L ${cx + 23 * scale} ${cy + 18 * scale}
      Q ${cx + 23 * scale} ${cy + 20 * scale} ${cx + 21 * scale} ${cy + 20 * scale}
      L ${cx + 3 * scale} ${cy + 20 * scale}
      Q ${cx + 1 * scale} ${cy + 20 * scale} ${cx + 1 * scale} ${cy + 18 * scale}
      L ${cx + 1 * scale} ${cy + 6 * scale}
      Q ${cx + 1 * scale} ${cy + 4 * scale} ${cx + 3 * scale} ${cy + 4 * scale}
      M ${cx + 8 * scale} ${cy + 22 * scale} L ${cx + 16 * scale} ${cy + 22 * scale}
      M ${cx + 12 * scale} ${cy + 18 * scale} L ${cx + 12 * scale} ${cy + 24 * scale}
    `;
  }

  getQueueIcon(cx: number, cy: number): string {
    const scale = 1.67; // 40px visual box / 24 viewBox
    return `
      M ${cx + 3 * scale} ${cy + 6 * scale} L ${cx + 15 * scale} ${cy + 6 * scale}
      M ${cx + 3 * scale} ${cy + 12 * scale} L ${cx + 15 * scale} ${cy + 12 * scale}
      M ${cx + 3 * scale} ${cy + 18 * scale} L ${cx + 11 * scale} ${cy + 18 * scale}
      M ${cx + 17 * scale} ${cy + 16 * scale} L ${cx + 21 * scale} ${cy + 18 * scale}
      L ${cx + 17 * scale} ${cy + 20 * scale}
    `;
  }

  qrDataUrl = signal<string>('');

  private async generateQR(): Promise<void> {
    if (!this.design.spotifyLink) return;
    try {
      // Generate PNG QR code as data URL
      const dataUrl = await QRCode.toDataURL(this.design.spotifyLink, {
        width: 280,
        margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' }
      });
      this.qrDataUrl.set(dataUrl);
    } catch (err) {
      console.error('QR generation failed:', err);
    }
  }

  getPlayPauseIconColor(): string {
    return '#FFFFFF';
  }
}

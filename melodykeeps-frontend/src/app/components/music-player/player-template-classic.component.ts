import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicPlayerDesign } from './music-player.model';
import * as QRCode from 'qrcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SUPPORTED_SONGS } from '../../data/supported-songs';

// PLAYER V3 (REVIEW): legibility pass. V2 baseline = git HEAD, copia en _review/player-v3-legibility/player-template-classic.V2-baseline.ts.txt
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
      @if (design.theme === 'dark') {
        <rect x="0" y="0" width="1000" height="1500" fill="#000000" />
      }
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
          <rect x="155" y="200" width="690" height="690" rx="28" ry="28" />
        </clipPath>
      </defs>
      <image
        x="155"
        y="200"
        width="690"
        height="690"
        [attr.href]="design.artworkUrl"
        clip-path="url(#artwork-clip)"
        preserveAspectRatio="xMidYMid slice"
      />

      <!-- Track Information -->
      <text
        x="90"
        y="955"
        font-family="Inter"
        font-weight="700"
        font-size="50"
        [attr.fill]="theme.text"
      >
        {{ design.playerDisplayTitle ?? design.title }}
      </text>
      <text
        x="90"
        y="1005"
        font-family="Inter"
        font-weight="400"
        font-size="35"
        [attr.fill]="theme.secondaryText"
      >
        {{ design.artist }}
      </text>

      <!-- Heart Icon -->
      <path
        [attr.d]="getHeartPath(900, 955)"
        [attr.stroke]="theme.heart"
        stroke-width="3"
        [attr.fill]="theme.heartFill"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      @if (design.spotifyCodeUrl) {
        <image x="190" y="1040" width="620" height="155" [attr.href]="design.spotifyCodeUrl" preserveAspectRatio="xMidYMid meet" />
      }

      <!-- Linear Progress Bar -->
      <g id="linear-progress" [attr.transform]="'translate(0 ' + dyProgress + ')'">
        <!-- Background track -->
        <line
          x1="80"
          y1="1110"
          x2="920"
          y2="1110"
          [attr.stroke]="theme.progressRemaining"
          stroke-width="6"
          stroke-linecap="round"
        />
        <!-- Completed track -->
        <line
          x1="80"
          y1="1110"
          [attr.x2]="getProgressX()"
          y2="1110"
          [attr.stroke]="theme.progressDone"
          stroke-width="6"
          stroke-linecap="round"
        />
        <!-- Progress knob -->
        <circle
          [attr.cx]="getProgressX()"
          cy="1110"
          r="9"
          [attr.fill]="theme.progressDone"
        />
      </g>

      <!-- Time Labels -->
      <text
        x="80"
        y="1150"
        [attr.transform]="'translate(0 ' + dyProgress + ')'"
        font-family="Inter"
        font-weight="400"
        font-size="28"
        [attr.fill]="theme.text"
        text-anchor="start"
      >
        {{ formatTime(design.currentTimeSeconds) }}
      </text>
      <text
        x="920"
        y="1150"
        [attr.transform]="'translate(0 ' + dyProgress + ')'"
        font-family="Inter"
        font-weight="400"
        font-size="28"
        [attr.fill]="theme.text"
        text-anchor="end"
      >
        {{ formatTime(design.durationSeconds) }}
      </text>

      <!-- Playback Controls -->
      <g id="controls" [attr.transform]="'translate(0 ' + dyControls + ')'">
        <!-- Shuffle (nested SVG) -->
        <svg x="75" y="1262" width="52" height="52" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <g fill="none" [attr.stroke]="theme.controlActive" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="m15 15 6 6" />
            <path d="m4 4 5 5" />
          </g>
        </svg>
        <circle cx="101" cy="1327" r="4" [attr.fill]="theme.controlActive" />

        <!-- Previous -->
        <path
          [attr.d]="getPreviousIcon(340, 1288)"
          transform="translate(340 1288) scale(1.12) translate(-340 -1288)"
          [attr.fill]="theme.text"
          stroke-width="0"
        />

        <!-- Play/Pause (Circle + Icon) -->
        <circle cx="500" cy="1288" r="62" [attr.fill]="theme.text" />
        <path
          [attr.d]="design.playbackState === 'playing' ? getPauseIcon(500, 1288) : getPlayIcon(500, 1288)"
          transform="translate(500 1288) scale(1.107) translate(-500 -1288)"
          [attr.fill]="getPlayPauseIconColor()"
          stroke-width="0"
        />

        <!-- Next -->
        <path
          [attr.d]="getNextIcon(660, 1288)"
          transform="translate(660 1288) scale(1.12) translate(-660 -1288)"
          [attr.fill]="theme.text"
          stroke-width="0"
        />

        <!-- Repeat (nested SVG) -->
        <svg x="873" y="1262" width="52" height="52" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
          <g fill="none" [attr.stroke]="theme.controlActive" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m17 1 4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="m7 23-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </g>
        </svg>
        <circle cx="899" cy="1327" r="4" [attr.fill]="theme.controlActive" />
      </g>

      <!-- Bottom Utilities -->
      <!-- Device -->
      <svg x="80" [attr.y]="1368 + dyControls" width="48" height="48" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <g fill="none" [attr.stroke]="theme.text" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 22h8" />
          <path d="M12 18v4" />
        </g>
      </svg>
      <!-- Queue -->
      <svg x="872" [attr.y]="1368 + dyControls" width="48" height="48" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
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

  private readonly lightTheme = {
    text: '#111111',
    secondaryText: '#66666F',
    heart: '#3A3A42',
    heartFill: '#000000',
    progressDone: '#111111',
    progressRemaining: '#D7D7DE',
    accentStart: '#111111',
    accentEnd: '#111111',
    controlActive: '#20D760',
  };

  private readonly darkTheme = {
    text: '#FFFFFF',
    secondaryText: '#B3B3B3',
    heart: '#E63946',
    heartFill: '#E63946',
    progressDone: '#FFFFFF',
    progressRemaining: '#4D4D4D',
    accentStart: '#FFFFFF',
    accentEnd: '#FFFFFF',
    controlActive: '#20D760',
  };

  get theme() {
    return this.design?.theme === 'dark' ? this.darkTheme : this.lightTheme;
  }

  // Con Spotify Code en el frente (sticker) la zona inferior baja para dejarle sitio.
  get dyProgress(): number {
    return this.design?.spotifyCodeUrl ? 115 : 0;
  }

  get dyControls(): number {
    return this.design?.spotifyCodeUrl ? 40 : 0;
  }

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
    // Corazón redondeado (forma "favorite" de Material, 20×18.35 en un viewBox de 24), escalado a
    // ~48 unidades de ancho y centrado en (cx, cy).
    const k = 2.41;
    const p = (x: number, y: number) => `${(cx + (x - 12) * k).toFixed(2)} ${(cy + (y - 12.175) * k).toFixed(2)}`;
    return `M ${p(12, 21.35)} L ${p(10.55, 20.03)}
      C ${p(5.4, 15.36)} ${p(2, 12.28)} ${p(2, 8.5)}
      C ${p(2, 5.42)} ${p(4.42, 3)} ${p(7.5, 3)}
      C ${p(9.24, 3)} ${p(10.91, 3.81)} ${p(12, 5.09)}
      C ${p(13.09, 3.81)} ${p(14.76, 3)} ${p(16.5, 3)}
      C ${p(19.58, 3)} ${p(22, 5.42)} ${p(22, 8.5)}
      C ${p(22, 12.28)} ${p(18.6, 15.36)} ${p(13.45, 20.04)}
      L ${p(12, 21.35)} Z`;
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
    return this.design?.theme === 'dark' ? '#000000' : '#FFFFFF';
  }

  getProgressX(): number {
    // ponytail: linear progress bar knob position, y=1110
    const ratio = this.design.durationSeconds > 0
      ? Math.max(0, Math.min(1, this.design.currentTimeSeconds / this.design.durationSeconds))
      : 0;
    return 80 + (840 * ratio);
  }
}

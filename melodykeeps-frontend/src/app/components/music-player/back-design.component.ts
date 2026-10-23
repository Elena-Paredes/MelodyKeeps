import { Component, Input, OnChanges, signal } from '@angular/core';
import { WaveKeepsService, WaveKeepsManifest, WaveKeepsElement } from '../../core/wavekeeps.service';
import { WaveKeepsSong } from '../../data/supported-songs';

// Reverso de la pieza de 38 × 49 mm. Lienzo propio de 380 × 490 (10 unidades = 1 mm, proporción
// 38:49). Reglas: designs/back/README.md. El Spotify Code manda: caja fija, fondo blanco, sin
// decoración en su zona de silencio.
const QUOTE = { x: 190, firstY: 282, lineHeight: 23, fontSize: 17, maxWidth: 270 };
const TITLE = { y: 424, lineHeight: 17, fontSize: 14, letterSpacing: 2.5, maxWidth: 250 };

@Component({
  selector: 'app-back-design',
  template: `
    <svg
      viewBox="0 0 380 490"
      preserveAspectRatio="xMidYMid meet"
      style="width: 100%; height: auto; aspect-ratio: 38 / 49; display: block"
      data-testid="wavekeeps-back"
    >
      <rect x="0" y="0" width="380" height="490" fill="#FFFFFF" />

      <defs>
        <clipPath id="back-canvas-clip"><rect x="0" y="0" width="380" height="490" /></clipPath>
      </defs>

      <!-- Decoración: plumas de la variante, recortadas por los bordes del lienzo -->
      <g clip-path="url(#back-canvas-clip)">
        @for (e of sortedElements(); track e.id) {
          <g [attr.transform]="transform(e)" [attr.opacity]="e.opacity ?? 1">
            <image [attr.href]="assetPath(e.src)" x="0" y="0" [attr.width]="e.width" [attr.height]="e.height" preserveAspectRatio="xMidYMid meet" />
          </g>
        }
      </g>

      <!-- Logo BTS (aproximación en vector, color de la variante), arriba a la izquierda -->
      <g [attr.fill]="accent()" font-family="Inter, Arial, Helvetica, sans-serif" data-testid="back-bts-logo">
        <circle cx="44" cy="20" r="12" fill="none" [attr.stroke]="accent()" stroke-width="1.6" />
        <g transform="translate(28.1 40) scale(0.254)">
          <path d="M0 0 L56 22 L56 167 L0 197 Z" />
          <path d="M70 22 L125 0 L125 197 L70 167 Z" />
        </g>
        <text x="44" y="106" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="2">BTS</text>
      </g>

      <!-- Espacio reservado (lo entrega Chat): el 7 de acuarela, arriba al centro -->
      @if (showReservedZones) {
        <g fill="none" stroke="#B9B9C4" stroke-width="1.5" stroke-dasharray="5 4" font-family="Inter, Arial, sans-serif" font-size="11" fill-opacity="1">
          <rect x="100" y="6" width="160" height="106" rx="6" />
          <text x="180" y="62" text-anchor="middle" stroke="none" fill="#B9B9C4">7</text>
        </g>
      }

      <!-- Spotify Code: caja fija (7, 131.25, 366 × 91.5), proporción 4:1, sin recolorear -->
      <image
        x="7"
        y="131.25"
        width="366"
        height="91.5"
        [attr.href]="codeUrl()"
        preserveAspectRatio="xMidYMid meet"
        data-testid="back-spotify-code"
      />

      <g font-family="Inter, Arial, Helvetica, sans-serif" text-anchor="middle" [attr.fill]="accent()">
        <text x="190" y="252" font-size="12" font-weight="700" letter-spacing="3">ESCANEA Y ESCUCHA</text>

        <text font-size="17" font-style="italic" data-testid="back-quote">
          @for (line of lines(); track $index) {
            <tspan x="190" [attr.y]="firstY + $index * lineHeight">{{ line }}</tspan>
          }
        </text>

        <g [attr.stroke]="accent()" stroke-width="1.5">
          <line x1="92" y1="392" x2="172" y2="392" />
          <line x1="208" y1="392" x2="288" y2="392" />
        </g>
        <path d="M190 383 L192.6 389.4 L199 392 L192.6 394.6 L190 401 L187.4 394.6 L181 392 L187.4 389.4 Z" stroke="none" />

        <text font-size="14" font-weight="700" letter-spacing="2.5" data-testid="back-title">
          @for (line of titleLines(); track $index) {
            <tspan x="190" [attr.y]="titleY($index)">{{ line }}</tspan>
          }
        </text>
      </g>
    </svg>
  `,
})
export class BackDesignComponent implements OnChanges {
  @Input({ required: true }) song!: WaveKeepsSong;
  @Input() showReservedZones = false;

  manifest = signal<WaveKeepsManifest | null>(null);
  lines = signal<string[]>([]);
  titleLines = signal<string[]>([]);

  readonly firstY = QUOTE.firstY;
  readonly lineHeight = QUOTE.lineHeight;

  constructor(private wavekeeps: WaveKeepsService) {}

  accent = () => this.manifest()?.palette?.accent ?? '#111111';
  // Pie: SOLO el título (nunca artista). Un título largo se reparte en líneas centradas en y=424.
  title = () => (this.song.backDisplayTitle ?? this.song.title).toUpperCase();
  titleY = (i: number) => TITLE.y - ((this.titleLines().length - 1) * TITLE.lineHeight) / 2 + i * TITLE.lineHeight;
  codeUrl = () => `assets/wavekeeps/designs/back/${this.song.backDesignId}/assets/svg/spotify-code.svg`;

  async ngOnChanges(): Promise<void> {
    const id = this.song.backDesignId;
    try {
      const m = await this.wavekeeps.loadBackDesign(id);
      if (id === this.song.backDesignId) this.manifest.set(m);
    } catch (err) {
      console.error('Failed to load back design manifest:', err);
      this.manifest.set(null);
    }
    this.lines.set(await this.wrap(this.song.quote, `italic ${QUOTE.fontSize}px Inter, Arial, Helvetica, sans-serif`, QUOTE.maxWidth));
    this.titleLines.set(await this.wrap(this.title(), `700 ${TITLE.fontSize}px Inter, Arial, Helvetica, sans-serif`, TITLE.maxWidth, TITLE.letterSpacing));
  }

  sortedElements(): WaveKeepsElement[] {
    return [...(this.manifest()?.elements ?? [])].sort((a, b) => a.zIndex - b.zIndex);
  }

  transform(e: WaveKeepsElement): string {
    return `translate(${e.x}, ${e.y})` + (e.rotationDeg ? ` rotate(${e.rotationDeg})` : '');
  }

  assetPath(src: string): string {
    return this.wavekeeps.getBackAssetPath(src, this.song.variantId ?? '');
  }

  // Reparte un texto en líneas de hasta `maxWidth` unidades (mide con la fuente real).
  private async wrap(text: string, font: string, maxWidth: number, letterSpacing = 0): Promise<string[]> {
    await document.fonts.load(font).catch(() => []);
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.font = font;
    ctx.letterSpacing = `${letterSpacing}px`;
    const lines: string[] = [];
    let cur = '';
    for (const word of text.split(/\s+/).filter(Boolean)) {
      const next = cur ? `${cur} ${word}` : word;
      if (cur && ctx.measureText(next).width > maxWidth) {
        lines.push(cur);
        cur = word;
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }
}

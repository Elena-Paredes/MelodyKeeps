import { Component, Input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicPlayerDesign } from './music-player.model';
import { WaveKeepsService, WaveKeepsManifest, WaveKeepsElement } from '../../core/wavekeeps.service';

@Component({
  selector: 'app-wavekeeps-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (manifest() && design) {
      <svg
        [attr.viewBox]="'0 0 ' + manifest()!.canvas.width + ' ' + manifest()!.canvas.height"
        [attr.preserveAspectRatio]="'xMidYMid meet'"
        [style.aspectRatio]="'2 / 3'"
        [style.width]="'100%'"
        [style.height]="'auto'"
        [attr.data-testid]="'wavekeeps-renderer-' + design.designId"
      >
        <!-- White background -->
        <rect
          width="1000"
          height="1500"
          fill="#FFFFFF"
        />

        <defs>
          <clipPath id="decor-canvas-clip">
            <rect x="0" y="0" width="1000" height="1500" />
          </clipPath>
        </defs>

        <g clip-path="url(#decor-canvas-clip)">
          @for (element of sortedElements(); track element.id) {
            <g [attr.transform]="getTransform(element)" [attr.opacity]="element.opacity ?? 1">
              <image
                [attr.href]="getAssetPath(element.src)"
                [attr.x]="0"
                [attr.y]="0"
                [attr.width]="element.width"
                [attr.height]="element.height"
                [attr.preserveAspectRatio]="'xMidYMid meet'"
              />
            </g>
          }
        </g>
      </svg>
    } @else {
      <div style="width: 100%; padding: 20px; text-align: center;">
        @if (error()) {
          <div style="color: #c00; font-size: 12px;">
            ❌ {{ error() }}
          </div>
        } @else {
          <div style="color: #999;">
            Loading design...
          </div>
        }
      </div>
    }
  `,
  styles: [],
})
export class WaveKeepsRendererComponent implements OnChanges {
  @Input() design!: MusicPlayerDesign;

  manifest = signal<WaveKeepsManifest | null>(null);
  error = signal<string | null>(null);

  private requestedId?: string;
  private manifestId?: string;

  constructor(private wavekeeps: WaveKeepsService) {}

  ngOnChanges(): void {
    const id = this.design?.designId;
    if (id && id !== this.requestedId) this.loadDesign(id);
  }

  private async loadDesign(id: string): Promise<void> {
    this.requestedId = id;
    this.error.set(null);
    try {
      const m = await this.wavekeeps.loadFrontDesign(id);
      if (id !== this.requestedId) return;
      this.manifestId = id;
      this.manifest.set(m);
    } catch (err) {
      if (id !== this.requestedId) return;
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Failed to load design manifest:', msg);
      this.manifest.set(null);
      this.error.set(msg);
    }
  }

  sortedElements() {
    const elements = this.manifest()?.elements || [];
    return [...elements].sort((a, b) => a.zIndex - b.zIndex);
  }

  getTransform(element: WaveKeepsElement): string {
    const parts = [`translate(${element.x}, ${element.y})`];
    if (element.rotationDeg) parts.push(`rotate(${element.rotationDeg})`);
    if (element.mirrorX || element.mirrorY) {
      const dx = element.mirrorX ? element.width : 0;
      const dy = element.mirrorY ? element.height : 0;
      parts.push(`translate(${dx}, ${dy})`, `scale(${element.mirrorX ? -1 : 1}, ${element.mirrorY ? -1 : 1})`);
    }
    return parts.join(' ');
  }

  getAssetPath(src: string): string {
    return this.wavekeeps.getAssetPath(this.manifestId ?? this.design.designId, src);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface WaveKeepsElement {
  id: string;
  type: 'png' | 'svg';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg?: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
  opacity?: number;
  zIndex: number;
}

export interface WaveKeepsManifest {
  designId: string;
  side: 'front' | 'back';
  status: string;
  implementationReady: boolean;
  canvas: { width: number; height: number };
  palette?: { accent: string };
  elements: WaveKeepsElement[];
}

@Injectable({ providedIn: 'root' })
export class WaveKeepsService {
  private manifestCache = new Map<string, WaveKeepsManifest>();

  constructor(private http: HttpClient) {}

  async loadFrontDesign(designId: string): Promise<WaveKeepsManifest> {
    if (this.manifestCache.has(designId)) {
      return this.manifestCache.get(designId)!;
    }

    const path = `/assets/wavekeeps/designs/front/${designId}/manifest.json`;
    try {
      console.log('HTTP GET:', path);
      const manifest = await firstValueFrom(this.http.get<WaveKeepsManifest>(path));

      if (!manifest.implementationReady) {
        throw new Error(`Design ${designId} not ready for implementation`);
      }

      this.manifestCache.set(designId, manifest);
      return manifest;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error('HTTP Error:', errMsg, err);
      throw new Error(`Failed to load manifest for ${designId} from ${path}: ${errMsg}`);
    }
  }

  private backCache = new Map<string, WaveKeepsManifest>();

  async loadBackDesign(designId: string): Promise<WaveKeepsManifest> {
    const hit = this.backCache.get(designId);
    if (hit) return hit;
    const path = `/assets/wavekeeps/designs/back/${designId}/manifest.json`;
    const manifest = await firstValueFrom(this.http.get<WaveKeepsManifest>(path));
    if (!manifest.implementationReady) throw new Error(`Back design ${designId} not ready for implementation`);
    this.backCache.set(designId, manifest);
    return manifest;
  }

  // Las plumas del reverso son las de la variante del frente ("variant:feathers/feather-03.png").
  getBackAssetPath(src: string, variantId: string): string {
    return `/assets/wavekeeps/designs/front/purple-feathers/assets/variants/${variantId}/${src.replace(/^variant:/, '')}`;
  }

  getAssetPath(designId: string, assetPath: string, variantId?: string): string {
    if (variantId) {
      if (assetPath.startsWith('assets/png/')) {
        const filename = assetPath.substring('assets/png/'.length);
        return `/assets/wavekeeps/designs/front/${designId}/assets/variants/${variantId}/feathers/${filename}`;
      }
      if (assetPath.startsWith('assets/svg/')) {
        const filename = assetPath.substring('assets/svg/'.length);
        return `/assets/wavekeeps/designs/front/${designId}/assets/variants/${variantId}/threads/${filename}`;
      }
    }
    return `/assets/wavekeeps/designs/front/${designId}/${assetPath}`;
  }
}

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

  getAssetPath(designId: string, assetPath: string): string {
    return `/assets/wavekeeps/designs/front/${designId}/${assetPath}`;
  }
}

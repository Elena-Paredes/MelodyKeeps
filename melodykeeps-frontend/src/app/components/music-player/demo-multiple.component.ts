import { Component } from '@angular/core';
import { WaveKeepsRendererComponent } from './wavekeeps-renderer.component';
import { PlayerTemplateClassicComponent } from './player-template-classic.component';
import { MusicPlayerDesign } from './music-player.model';

@Component({
  selector: 'app-demo-multiple',
  standalone: true,
  imports: [WaveKeepsRendererComponent, PlayerTemplateClassicComponent],
  template: `
    <div style="padding: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
      <div data-testid="demo-spring-day" style="position: relative; width: 300px; margin: 0 auto; background: #fff;">
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <app-wavekeeps-renderer [design]="springDayDesign" />
        </div>
        <div style="position: relative;">
          <app-player-template-classic [design]="springDayDesign" />
        </div>
      </div>

      <div data-testid="demo-fake-love" style="position: relative; width: 300px; margin: 0 auto; background: #fff;">
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <app-wavekeeps-renderer [design]="fakeLoveDesign" />
        </div>
        <div style="position: relative;">
          <app-player-template-classic [design]="fakeLoveDesign" />
        </div>
      </div>

      <div data-testid="demo-dna" style="position: relative; width: 300px; margin: 0 auto; background: #fff;">
        <div style="position: absolute; inset: 0; pointer-events: none;">
          <app-wavekeeps-renderer [design]="dnaDesign" />
        </div>
        <div style="position: relative;">
          <app-player-template-classic [design]="dnaDesign" />
        </div>
      </div>
    </div>
  `,
})
export class DemoMultipleComponent {
  springDayDesign: MusicPlayerDesign = {
    title: 'Spring Day',
    artist: 'BTS',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b2731fd0a8fc28b2a0a5d9cdc6c6',
    spotifyLink: 'spotify:track:2j1fFjWHCI9KJSwcuYAOyF',
    currentTimeSeconds: 45,
    durationSeconds: 274,
    waveform: Array(100).fill(0).map(() => Math.random()),
    playlistLabel: 'BTS // favorites 💜',
    designId: 'purple-feathers',
    backDesignId: 'spring-day',
    variantId: undefined,
    playbackState: 'playing',
  };

  fakeLoveDesign: MusicPlayerDesign = {
    title: 'Fake Love',
    artist: 'BTS',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273a274bd961be8afb88d0d5c54',
    spotifyLink: 'spotify:track:6m1TWFMeon7ai9XLOzdbiR',
    currentTimeSeconds: 67,
    durationSeconds: 247,
    waveform: Array(100).fill(0).map(() => Math.random()),
    playlistLabel: 'BTS // favorites 💜',
    designId: 'purple-feathers',
    backDesignId: 'fake-love',
    variantId: undefined,
    playbackState: 'playing',
  };

  dnaDesign: MusicPlayerDesign = {
    title: 'DNA',
    artist: 'BTS',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273af396dce4438624ec801ff1a',
    spotifyLink: 'spotify:track:2ngmiq1KoYn3x25VOmvd8F',
    currentTimeSeconds: 89,
    durationSeconds: 245,
    waveform: Array(100).fill(0).map(() => Math.random()),
    playlistLabel: 'BTS // favorites 💜',
    designId: 'purple-feathers',
    backDesignId: 'dna',
    variantId: undefined,
    playbackState: 'playing',
  };
}

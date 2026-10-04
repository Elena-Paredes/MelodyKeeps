import { Component } from '@angular/core';
import { WaveKeepsRendererComponent } from './wavekeeps-renderer.component';
import { PlayerTemplateClassicComponent } from './player-template-classic.component';
import { MusicPlayerDesign } from './music-player.model';

@Component({
  selector: 'app-player-demo',
  standalone: true,
  imports: [WaveKeepsRendererComponent, PlayerTemplateClassicComponent],
  template: `
    <div data-testid="wavekeeps-front" style="position: relative; width: 400px; margin: 20px auto; background: #fff;">
      <div style="position: absolute; inset: 0; pointer-events: none;">
        <app-wavekeeps-renderer [design]="springDayDesign" />
      </div>
      <div style="position: relative;">
        <app-player-template-classic [design]="springDayDesign" />
      </div>
    </div>
  `,
})
export class PlayerDemoComponent {
  springDayDesign: MusicPlayerDesign = {
    title: 'Spring Day',
    artist: 'BTS',
    artworkUrl: '/assets/spring-day.jpg',
    spotifyLink: 'spotify:track:4wVE3K1qPrWwQWRVKJKSCF',

    currentTimeSeconds: 103,
    durationSeconds: 274,

    waveform: [
      0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.5, 0.4, 0.7, 0.6, 0.5, 0.4, 0.6, 0.7, 0.8, 0.5, 0.4, 0.6, 0.7, 0.5,
      0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.5, 0.4, 0.6, 0.7, 0.8, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.5, 0.6, 0.7,
      0.8, 0.6, 0.5, 0.4, 0.6, 0.7, 0.8, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.5, 0.4,
      0.6, 0.7, 0.8, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.5, 0.4, 0.6, 0.7, 0.8, 0.5,
      0.4, 0.6, 0.7, 0.5, 0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.5, 0.4, 0.6, 0.7, 0.8, 0.5, 0.4, 0.6, 0.7, 0.5,
    ],

    playlistLabel: 'BTS // favorites 💜',
    designId: 'purple-feathers',

    playbackState: 'playing',
  };
}

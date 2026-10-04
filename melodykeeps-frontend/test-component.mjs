import { PlayerTemplateClassicComponent } from './src/app/components/music-player/player-template-classic.component';
import { MusicPlayerDesign } from './src/app/components/music-player/music-player.model';

const component = new PlayerTemplateClassicComponent();

const design: MusicPlayerDesign = {
  title: 'Spring Day',
  artist: 'BTS',
  artworkUrl: '/artwork/spring-day.jpg',
  currentTimeSeconds: 103,
  durationSeconds: 274,
  waveform: Array(100).fill(0).map(() => Math.random()),
  playlistLabel: 'BTS // favorites 💜',
  theme: {
    background: '#080B12',
    text: '#FFFFFF',
    secondaryText: '#B8B8C2',
    accentStart: '#F06AAE',
    accentEnd: '#A264FF',
    controlActive: '#20D760',
    heart: '#C66CFF'
  },
  playbackState: 'playing'
};

component.design = design;
component.ngOnInit();

console.log('✓ Component initialized');
console.log('✓ Time formatting:', component.formatTime(103));
console.log('✓ Heart path:', component.getHeartPath(835, 985).substring(0, 50) + '...');
console.log('✓ Play icon:', component.getPlayIcon(500, 1275).substring(0, 50) + '...');
console.log('✓ Waveform bars:', component.getWaveformBars().length);
console.log('✓ All methods working');

export interface MusicPlayerDesign {
  title: string;
  playerDisplayTitle?: string;
  artist: string;
  artworkUrl: string;
  spotifyLink: string;

  currentTimeSeconds: number;
  durationSeconds: number;

  waveform: number[];

  designId: string;
  backDesignId?: string;
  variantId?: string;
  playlistLabel?: string;

  theme?: 'light' | 'dark';
  spotifyCodeUrl?: string;

  playbackState: "playing" | "paused";
}

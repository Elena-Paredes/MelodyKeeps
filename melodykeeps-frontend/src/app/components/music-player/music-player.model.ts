export interface MusicPlayerDesign {
  title: string;
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

  playbackState: "playing" | "paused";
}

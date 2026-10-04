// ponytail: 12 BTS songs from catalog with Spotify track IDs
export interface WaveKeepsSong {
  id: string;
  title: string;
  artist: string;
  spotifyTrackId: string;
  quote: string;
  backDesignId: string;
  coverUrl?: string; // populated from Spotify
}

export const SUPPORTED_SONGS: WaveKeepsSong[] = [
  {
    id: 'spring-day',
    title: 'Spring Day',
    artist: 'BTS',
    spotifyTrackId: '2j1fFjWHCI9KJSwcuYAOyF',
    quote: 'Espero el día en que pueda saludarte de nuevo. Aunque estés lejos de mí ahora...',
    backDesignId: 'spring-day',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2731fd0a8fc28b2a0a5d9cdc6c6',
  },
  {
    id: 'swim',
    title: 'Swim',
    artist: 'BTS',
    spotifyTrackId: '68lbSrXDORS51pmyjZv712',
    quote: 'Nada a través de la vida como el mar, sin miedo a hundirse...',
    backDesignId: 'swim',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273dfa17fad7f190c901603270e',
  },
  {
    id: 'fake-love',
    title: 'Fake Love',
    artist: 'BTS',
    spotifyTrackId: '6m1TWFMeon7ai9XLOzdbiR',
    quote: 'Ojalá el amor fuera perfecto como el amor por sí mismo...',
    backDesignId: 'fake-love',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273a274bd961be8afb88d0d5c54',
  },
  {
    id: 'dna',
    title: 'DNA',
    artist: 'BTS',
    spotifyTrackId: '2ngmiq1KoYn3x25VOmvd8F',
    quote: 'Está en nuestro ADN, escrito en las estrellas...',
    backDesignId: 'dna',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273af396dce4438624ec801ff1a',
  },
  {
    id: 'blood-sweat-tears',
    title: 'Blood Sweat & Tears',
    artist: 'BTS',
    spotifyTrackId: '2u54HNQamwFuOMLSuhSRom',
    quote: 'Sé que necesitas sudor y sangre. Daré todo lo que tengo...',
    backDesignId: 'blood-sweat-tears',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738bd5d941f9ced8e7f9c60dd4',
  },
  {
    id: 'run',
    title: 'Run',
    artist: 'BTS',
    spotifyTrackId: '69xohKu8C1fsflYAiSNbwM',
    quote: 'Por favor, hazme correr más, incluso si mis pies están llenos de cicatrices...',
    backDesignId: 'run',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27317db30ce3f081d6818a8ad49',
  },
  {
    id: 'mikrokosmos',
    title: 'Mikrokosmos',
    artist: 'BTS',
    spotifyTrackId: '0jSccBRnhNU4KtACMQPvco',
    quote: 'Tú eres mi pequeño universo, mi razón de existir...',
    backDesignId: 'mikrokosmos',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27318d0ed4f969b376893f9a38f',
  },
  {
    id: 'pied-piper',
    title: 'Pied Piper',
    artist: 'BTS',
    spotifyTrackId: '1ZPeaPDjQOOC8hw1mNjyjF',
    quote: 'Cierra los ojos y escucha: sigue el sonido de la flauta...',
    backDesignId: 'pied-piper',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27340f078d0a28bffb93e2e2c11',
  },
  {
    id: 'dimple',
    title: 'Dimple',
    artist: 'BTS',
    spotifyTrackId: '1rLkzFZdokhx6Wcs80uvnw',
    quote: 'Tu existencia es un crimen, fue un error cometido por un ángel...',
    backDesignId: 'dimple',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273af396dce4438624ec801ff1a',
  },
  {
    id: 'we-are-bulletproof',
    title: 'We Are Bulletproof: the Eternal Edition',
    artist: 'BTS',
    spotifyTrackId: '133ocfbXXG4HTk76qgSeUb',
    quote: 'Éramos solo siete, pero ahora las tenemos a todas ustedes...',
    backDesignId: 'we-are-bulletproof',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273505190077497c230422f2934',
  },
  {
    id: 'im-fine',
    title: "I'm Fine",
    artist: 'BTS',
    spotifyTrackId: '7HYJqAMbKDJYRyEfUGOCBB',
    quote: 'En la noche más negra, la oscuridad sacude los sueños dormidos...',
    backDesignId: 'im-fine',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273af396dce4438624ec801ff1a',
  },
  {
    id: 'animals',
    title: 'Anpanman',
    artist: 'BTS',
    spotifyTrackId: '453W8V5Ynwn6Tr28KuOwsO',
    quote: 'Somos héroes en nuestro propio mundo...',
    backDesignId: 'animals',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273af396dce4438624ec801ff1a',
  },
];

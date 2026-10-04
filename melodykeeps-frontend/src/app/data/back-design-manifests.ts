// ponytail: back design manifests for 12 BTS songs
export interface BackDesignManifest {
  id: string;
  canvas: {
    width: number;
    height: number;
    background: string;
  };
  reference: {
    individual: string | null;
    master: string | null;
    crop: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  };
  qr: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  assets: string[];
  status: 'generic' | 'ready';
}

export const BACK_DESIGN_MANIFESTS: Record<string, BackDesignManifest> = {
  spring_day: {
    id: 'spring-day',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  swim: {
    id: 'swim',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  animals: {
    id: 'animals',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  blood_sweat_tears: {
    id: 'blood-sweat-tears',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  mikrokosmos: {
    id: 'mikrokosmos',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  dna: {
    id: 'dna',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  dimple: {
    id: 'dimple',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  im_fine: {
    id: 'im-fine',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  pied_piper: {
    id: 'pied-piper',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  we_are_bulletproof: {
    id: 'we-are-bulletproof',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  fake_love: {
    id: 'fake-love',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
  run: {
    id: 'run',
    canvas: { width: 1000, height: 1500, background: '#FFFFFF' },
    reference: { individual: null, master: null, crop: null },
    qr: { x: 250, y: 300, width: 500, height: 500 },
    assets: [],
    status: 'generic',
  },
};

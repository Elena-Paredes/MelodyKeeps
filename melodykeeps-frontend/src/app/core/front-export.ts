// Convierte un frente (capas SVG apiladas) en un canvas con la medida física de la pieza.
// Un SVG usado como imagen no carga recursos externos ni fuentes de la página, así que las
// imágenes y la fuente Inter se incrustan antes de dibujarlo.

const SVG_NS = 'http://www.w3.org/2000/svg';
const INTER_CSS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
const CODE_SELECTOR = 'image[href*="scannables"], image[href*="spotify-code.svg"]';

export const mmToPx = (mm: number, dpi: number) => Math.round((mm / 25.4) * dpi);

export const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

async function fetchDataUrl(href: string, cache?: Map<string, string>): Promise<string> {
  const hit = cache?.get(href);
  if (hit) return hit;
  const res = await fetch(href);
  if (!res.ok) throw new Error(`${res.status} ${href}`);
  const data = await blobToDataUrl(await res.blob());
  cache?.set(href, data);
  return data;
}

let interCss: Promise<string> | null = null;

// @font-face de Inter (latin y latin-ext, 400 y 700) con los archivos incrustados como data URL.
export function inlineInterFontCss(): Promise<string> {
  interCss ??= (async () => {
    const css = await (await fetch(INTER_CSS_URL)).text();
    const faces = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)].filter((m) => m[1] === 'latin' || m[1] === 'latin-ext');
    const inlined = await Promise.all(
      faces.map(async (m) => {
        const url = /url\((https:[^)]+)\)/.exec(m[2])?.[1];
        return url ? m[2].replace(url, await fetchDataUrl(url)) : '';
      }),
    );
    return inlined.join('\n');
  })().catch(() => {
    interCss = null; // permite reintentar; sin fuente incrustada queda Arial
    return '';
  });
  return interCss;
}

export interface FrontRenderOptions {
  widthMm: number;
  heightMm: number;
  dpi: number;
  radiusMm?: number; // esquinas redondeadas (transparentes)
  background?: string; // fondo bajo las capas (por defecto transparente)
  cache?: Map<string, string>; // href -> data URL, para no repetir descargas entre piezas
  canvas?: { width: number; height: number }; // lienzo lógico de las capas (frente 1000×1500, reverso 380×490)
}

/**
 * Dibuja las capas (de abajo hacia arriba, todas en un lienzo 1000×1500) estiradas a la pieza.
 * Si se indica `codeHref`, el Spotify Code de las capas se omite y se dibuja aparte, sin estirar
 * (proporción 4:1), con el mismo ancho y centro que en la vista previa.
 */
export async function renderFrontCanvas(layers: SVGSVGElement[], codeHref: string | null, opts: FrontRenderOptions): Promise<HTMLCanvasElement> {
  const W = mmToPx(opts.widthMm, opts.dpi);
  const H = mmToPx(opts.heightMm, opts.dpi);
  const logical = opts.canvas ?? { width: 1000, height: 1500 };

  const root = document.createElementNS(SVG_NS, 'svg');
  root.setAttribute('xmlns', SVG_NS);
  root.setAttribute('viewBox', `0 0 ${logical.width} ${logical.height}`);
  root.setAttribute('width', String(W));
  root.setAttribute('height', String(H));
  root.setAttribute('preserveAspectRatio', 'none'); // el diseño (2:3) se estira para llenar la pieza

  const fontCss = await inlineInterFontCss();
  if (fontCss) {
    const style = document.createElementNS(SVG_NS, 'style');
    style.textContent = fontCss;
    root.appendChild(style);
  }

  for (const layer of layers) {
    const clone = layer.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute('style');
    clone.setAttribute('x', '0');
    clone.setAttribute('y', '0');
    clone.setAttribute('width', String(logical.width));
    clone.setAttribute('height', String(logical.height));
    if (codeHref) clone.querySelectorAll(CODE_SELECTOR).forEach((el) => el.remove());
    clone.querySelectorAll('text').forEach((t) => t.setAttribute('font-family', 'Inter, Arial, Helvetica, sans-serif'));
    root.appendChild(clone);
  }

  await Promise.all(
    [...root.querySelectorAll('image')].map(async (img) => {
      const href = img.getAttribute('href');
      if (href && !href.startsWith('data:')) img.setAttribute('href', await fetchDataUrl(href, opts.cache));
    }),
  );

  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(root)], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    if (opts.radiusMm) {
      const r = mmToPx(opts.radiusMm, opts.dpi);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.arcTo(W, 0, W, H, r);
      ctx.arcTo(W, H, 0, H, r);
      ctx.arcTo(0, H, 0, 0, r);
      ctx.arcTo(0, 0, W, 0, r);
      ctx.closePath();
      ctx.clip();
    }
    const paint = () => {
      if (opts.background) {
        ctx.fillStyle = opts.background;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.drawImage(image, 0, 0, W, H);
    };
    paint();
    // La fuente incrustada puede decodificarse tras el primer dibujo: se espera y se repinta.
    await new Promise((r) => setTimeout(r, 200));
    ctx.clearRect(0, 0, W, H);
    paint();

    if (codeHref) {
      const codeImg = new Image();
      codeImg.src = await fetchDataUrl(codeHref, opts.cache);
      await codeImg.decode();
      const w = (620 * W) / 1000;
      ctx.drawImage(codeImg, (W - w) / 2, (1117.5 * H) / 1500 - w / 8, w, w / 4);
    }
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = (bytes: Uint8Array) => {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

// Inserta el chunk pHYs (píxeles por metro) tras IHDR para que el PNG declare su tamaño físico.
export async function withPrintDpi(png: Blob, dpi: number): Promise<Blob> {
  const src = new Uint8Array(await png.arrayBuffer());
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21); // longitud(4) + tipo(4) + datos(9) + crc(4)
  const v = new DataView(chunk.buffer);
  v.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  v.setUint32(8, ppm);
  v.setUint32(12, ppm);
  chunk[16] = 1; // unidad: metro
  v.setUint32(17, crc32(chunk.subarray(4, 17)));
  const ihdrEnd = 8 + 25; // firma + chunk IHDR completo
  return new Blob([src.subarray(0, ihdrEnd), chunk, src.subarray(ihdrEnd)], { type: 'image/png' });
}

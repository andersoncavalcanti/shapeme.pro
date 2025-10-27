// frontend/src/utils/image.js
/**
 * Insere transformações Cloudinary após "/upload/".
 * Ex.: https://res.cloudinary.com/xxx/image/upload/v123/foo.jpg
 * vira: https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_600,h_400,ar_4:3/v123/foo.jpg
 */
export function transformCloudinary(url, opts = {}) {
  try {
    if (!url || typeof url !== 'string') return url;
    const isCloudinary =
      url.includes('res.cloudinary.com') || url.includes('/image/upload/');
    if (!isCloudinary) return url;

    const idx = url.indexOf('/upload/');
    if (idx === -1) return url;

    const {
      f = 'auto',
      q = 'auto',
      dpr = 'auto',
      c = 'fill',
      g = 'auto',
      w,
      h,
      ar, // ex: '4:3' ou '3:2'
    } = opts;

    const parts = [
      `f_${f}`,
      `q_${q}`,
      `dpr_${dpr}`,
      `c_${c}`,
      `g_${g}`,
      w ? `w_${w}` : null,
      h ? `h_${h}` : null,
      ar ? `ar_${ar}` : null,
    ].filter(Boolean);

    const prefix = url.slice(0, idx + 8); // inclui "/upload/"
    const rest = url.slice(idx + 8);
    return `${prefix}${parts.join(',')}/${rest}`;
  } catch {
    return url;
  }
}

// Presets prontos
export const cldCard = (url) =>
  transformCloudinary(url, { w: 600, h: 400, ar: '4:3', c: 'fill', g: 'auto' });

export const cldHero = (url) =>
  transformCloudinary(url, { w: 1200, h: 800, ar: '3:2', c: 'fill', g: 'auto' });

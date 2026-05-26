import { clamp255 } from '@/lib/utils/clamp';

// RGB to HSV
export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s, v];
}

// HSV to RGB
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [clamp255((r + m) * 255), clamp255((g + m) * 255), clamp255((b + m) * 255)];
}

// RGB to IHS (Intensity-Hue-Saturation)
export function rgbToIhs(r: number, g: number, b: number): [number, number, number] {
  const intensity = (r + g + b) / 3;
  const v1 = (-r - g + 2 * b) / Math.sqrt(6);
  const v2 = (r - g) / Math.sqrt(2);
  const hue = Math.atan2(v2, v1);
  const saturation = Math.sqrt(v1 * v1 + v2 * v2);
  return [intensity, hue, saturation];
}

// IHS to RGB
export function ihsToRgb(intensity: number, hue: number, saturation: number): [number, number, number] {
  const v1 = saturation * Math.cos(hue);
  const v2 = saturation * Math.sin(hue);
  const r = intensity - v1 / Math.sqrt(6) + v2 / Math.sqrt(2);
  const g = intensity - v1 / Math.sqrt(6) - v2 / Math.sqrt(2);
  const b = intensity + 2 * v1 / Math.sqrt(6);
  return [clamp255(r), clamp255(g), clamp255(b)];
}

// RGB to YCbCr
export function rgbToYcbcr(r: number, g: number, b: number): [number, number, number] {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return [y, cb, cr];
}

// YCbCr to RGB
export function ycbcrToRgb(y: number, cb: number, cr: number): [number, number, number] {
  const r = y + 1.402 * (cr - 128);
  const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128);
  const b = y + 1.772 * (cb - 128);
  return [clamp255(r), clamp255(g), clamp255(b)];
}

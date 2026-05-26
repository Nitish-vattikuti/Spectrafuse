import { getColormap, type ColormapName } from '@/lib/utils/color-maps';
import { imageDataToGrayscale } from '@/lib/utils/canvas';

export function applyFalseColor(
  imageData: ImageData,
  colormap: ColormapName,
  opacity: number = 1
): ImageData {
  const gray = imageDataToGrayscale(imageData);
  const lut = getColormap(colormap);
  const { width, height } = imageData;
  const out = new ImageData(width, height);

  for (let i = 0; i < width * height; i++) {
    const v = Math.max(0, Math.min(255, Math.round(gray[i])));
    const [r, g, b] = lut[v];
    const idx = i * 4;
    out.data[idx] = r;
    out.data[idx + 1] = g;
    out.data[idx + 2] = b;
    out.data[idx + 3] = Math.round(opacity * 255);
  }
  return out;
}

export function overlayFalseColor(
  baseImageData: ImageData,
  thermalImageData: ImageData,
  colormap: ColormapName,
  opacity: number
): ImageData {
  const gray = imageDataToGrayscale(thermalImageData);
  const lut = getColormap(colormap);
  const { width, height } = baseImageData;
  const out = new ImageData(width, height);

  for (let i = 0; i < width * height; i++) {
    const v = Math.max(0, Math.min(255, Math.round(gray[i])));
    const [tr, tg, tb] = lut[v];
    const idx = i * 4;
    const br = baseImageData.data[idx];
    const bg = baseImageData.data[idx + 1];
    const bb = baseImageData.data[idx + 2];
    out.data[idx] = Math.round(br * (1 - opacity) + tr * opacity);
    out.data[idx + 1] = Math.round(bg * (1 - opacity) + tg * opacity);
    out.data[idx + 2] = Math.round(bb * (1 - opacity) + tb * opacity);
    out.data[idx + 3] = 255;
  }
  return out;
}

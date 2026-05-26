import { imageDataToGrayscale, imageDataToRGBArrays, rgbArraysToImageData } from '@/lib/utils/canvas';
import { rgbToIhs, ihsToRgb } from '@/lib/image/converter';
import { clamp255 } from '@/lib/utils/clamp';
import type { AlgorithmParams } from '@/types/fusion.types';

/**
 * IHS (Intensity-Hue-Saturation) Fusion
 * 1. Convert RGB to IHS
 * 2. Replace Intensity channel with normalized thermal band
 * 3. Convert back to RGB
 */
export function ihsFusion(
  bands: ImageData[],
  _params: AlgorithmParams,
  onProgress?: (p: number) => void
): ImageData {
  const visible = bands[0];
  const thermal = bands[bands.length - 1];
  const width = visible.width;
  const height = visible.height;
  const { r, g, b } = imageDataToRGBArrays(visible);
  const therm = imageDataToGrayscale(thermal);
  const total = width * height;

  // Normalize thermal to match intensity range
  let thermMin = Infinity, thermMax = -Infinity;
  let intMin = Infinity, intMax = -Infinity;
  for (let i = 0; i < total; i++) {
    const intensity = (r[i] + g[i] + b[i]) / 3;
    if (therm[i] < thermMin) thermMin = therm[i];
    if (therm[i] > thermMax) thermMax = therm[i];
    if (intensity < intMin) intMin = intensity;
    if (intensity > intMax) intMax = intensity;
  }

  const thermRange = thermMax - thermMin || 1;
  const intRange = intMax - intMin || 1;
  onProgress?.(20);

  const outR = new Float64Array(total);
  const outG = new Float64Array(total);
  const outB = new Float64Array(total);

  for (let i = 0; i < total; i++) {
    // Convert to IHS
    const [, hue, saturation] = rgbToIhs(r[i], g[i], b[i]);

    // Replace intensity with histogram-matched thermal
    const normThermal = ((therm[i] - thermMin) / thermRange) * intRange + intMin;

    // Convert back to RGB
    const [nr, ng, nb] = ihsToRgb(normThermal, hue, saturation);
    outR[i] = clamp255(nr);
    outG[i] = clamp255(ng);
    outB[i] = clamp255(nb);

    if (onProgress && i % 50000 === 0) {
      onProgress(20 + Math.round((i / total) * 80));
    }
  }
  onProgress?.(100);
  return rgbArraysToImageData(outR, outG, outB, width, height);
}

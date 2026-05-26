import { imageDataToGrayscale, imageDataToRGBArrays, rgbArraysToImageData } from '@/lib/utils/canvas';
import { clamp255 } from '@/lib/utils/clamp';
import type { AlgorithmParams } from '@/types/fusion.types';

/**
 * Brovey Transform — pan-sharpening with thermal injection
 * DNF = Thermal / (R + G + B + ε)
 * Fused_R = R × DNF × scaleFactor
 * Fused_G = G × DNF × scaleFactor
 * Fused_B = B × DNF × scaleFactor
 */
export function broveyFusion(
  bands: ImageData[],
  params: AlgorithmParams,
  onProgress?: (p: number) => void
): ImageData {
  // bands[0] = visible (RGB), bands[last] = thermal or NIR
  const visible = bands[0];
  const thermal = bands[bands.length - 1];
  const width = visible.width;
  const height = visible.height;
  const { r, g, b } = imageDataToRGBArrays(visible);
  const therm = imageDataToGrayscale(thermal);
  const scaleFactor = params.scaleFactor;
  const epsilon = 0.001;

  const outR = new Float64Array(width * height);
  const outG = new Float64Array(width * height);
  const outB = new Float64Array(width * height);
  const total = width * height;

  for (let i = 0; i < total; i++) {
    const sum = r[i] + g[i] + b[i] + epsilon;
    const dnf = therm[i] / sum;
    outR[i] = clamp255(r[i] * dnf * scaleFactor);
    outG[i] = clamp255(g[i] * dnf * scaleFactor);
    outB[i] = clamp255(b[i] * dnf * scaleFactor);
    if (onProgress && i % 50000 === 0) {
      onProgress(Math.round((i / total) * 100));
    }
  }
  onProgress?.(100);
  return rgbArraysToImageData(outR, outG, outB, width, height);
}

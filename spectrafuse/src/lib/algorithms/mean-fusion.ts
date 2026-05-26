import { imageDataToGrayscale, grayscaleToImageData } from '@/lib/utils/canvas';
import type { AlgorithmParams } from '@/types/fusion.types';

/**
 * Mean Fusion — weighted pixel averaging baseline
 * For each pixel: Output = sum(band[i] × weight[i]) / sum(weights)
 */
export function meanFusion(
  bands: ImageData[],
  params: AlgorithmParams,
  onProgress?: (p: number) => void
): ImageData {
  const weights = [params.visibleWeight, params.nirWeight, params.thermalWeight].slice(0, bands.length);
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const width = bands[0].width;
  const height = bands[0].height;
  const grayBands = bands.map(b => imageDataToGrayscale(b));
  const output = new Float64Array(width * height);

  const totalPixels = width * height;
  for (let i = 0; i < totalPixels; i++) {
    let sum = 0;
    for (let b = 0; b < grayBands.length; b++) {
      sum += grayBands[b][i] * weights[b];
    }
    output[i] = sum / totalWeight;
    if (onProgress && i % 50000 === 0) {
      onProgress(Math.round((i / totalPixels) * 100));
    }
  }
  onProgress?.(100);
  return grayscaleToImageData(output, width, height);
}

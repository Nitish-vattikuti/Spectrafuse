import { imageDataToGrayscale } from '@/lib/utils/canvas';

/**
 * SSIM (Structural Similarity Index)
 * Computed over 8×8 windows, averaged across image.
 * C1 = (0.01 × 255)² = 6.5025
 * C2 = (0.03 × 255)² = 58.5225
 */
export function computeSSIM(original: ImageData, fused: ImageData): number {
  const orig = imageDataToGrayscale(original);
  const fus = imageDataToGrayscale(fused);
  const width = original.width;
  const height = original.height;
  const windowSize = 8;
  const C1 = 6.5025;
  const C2 = 58.5225;

  let ssimSum = 0;
  let count = 0;

  for (let y = 0; y <= height - windowSize; y += windowSize) {
    for (let x = 0; x <= width - windowSize; x += windowSize) {
      let muX = 0, muY = 0;
      const wPixels = windowSize * windowSize;

      // Compute means
      for (let wy = 0; wy < windowSize; wy++) {
        for (let wx = 0; wx < windowSize; wx++) {
          const idx = (y + wy) * width + (x + wx);
          muX += orig[idx];
          muY += fus[idx];
        }
      }
      muX /= wPixels;
      muY /= wPixels;

      // Compute variances and covariance
      let sigmaXX = 0, sigmaYY = 0, sigmaXY = 0;
      for (let wy = 0; wy < windowSize; wy++) {
        for (let wx = 0; wx < windowSize; wx++) {
          const idx = (y + wy) * width + (x + wx);
          const dx = orig[idx] - muX;
          const dy = fus[idx] - muY;
          sigmaXX += dx * dx;
          sigmaYY += dy * dy;
          sigmaXY += dx * dy;
        }
      }
      sigmaXX /= wPixels - 1;
      sigmaYY /= wPixels - 1;
      sigmaXY /= wPixels - 1;

      const ssim = ((2 * muX * muY + C1) * (2 * sigmaXY + C2)) /
                   ((muX * muX + muY * muY + C1) * (sigmaXX + sigmaYY + C2));
      ssimSum += ssim;
      count++;
    }
  }

  return count > 0 ? ssimSum / count : 0;
}

import { imageDataToGrayscale } from '@/lib/utils/canvas';

/**
 * PSNR (Peak Signal-to-Noise Ratio)
 * MSE = (1/N) × Σ(original[i] - fused[i])²
 * PSNR = 10 × log10(255² / MSE)
 */
export function computePSNR(original: ImageData, fused: ImageData): number {
  const orig = imageDataToGrayscale(original);
  const fus = imageDataToGrayscale(fused);
  const n = orig.length;
  let mse = 0;
  for (let i = 0; i < n; i++) {
    const diff = orig[i] - fus[i];
    mse += diff * diff;
  }
  mse /= n;
  if (mse === 0) return 100; // identical images
  return 10 * Math.log10((255 * 255) / mse);
}

export { computePSNR } from './psnr';
export { computeSSIM } from './ssim';
export { computeEntropy } from './entropy';

import type { ImageMetrics } from '@/types/fusion.types';
import { computePSNR } from './psnr';
import { computeSSIM } from './ssim';
import { computeEntropy } from './entropy';

export function computeAllMetrics(original: ImageData, fused: ImageData): ImageMetrics {
  const psnr = computePSNR(original, fused);
  const ssim = computeSSIM(original, fused);
  const entropy = computeEntropy(fused);

  let quality: ImageMetrics['quality'] = 'poor';
  if (psnr > 35 && ssim > 0.85) quality = 'excellent';
  else if (psnr > 28 && ssim > 0.7) quality = 'good';
  else if (psnr > 20 && ssim > 0.5) quality = 'fair';

  return { psnr, ssim, entropy, quality };
}

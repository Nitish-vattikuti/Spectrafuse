import { imageDataToGrayscale } from '@/lib/utils/canvas';

/**
 * Shannon Entropy
 * H = -Σ p(i) × log2(p(i)) for i in histogram bins [0,255]
 * Range: 0–8 bits. Higher = more information content.
 */
export function computeEntropy(imageData: ImageData): number {
  const gray = imageDataToGrayscale(imageData);
  const n = gray.length;
  const histogram = new Float64Array(256);

  for (let i = 0; i < n; i++) {
    const bin = Math.max(0, Math.min(255, Math.round(gray[i])));
    histogram[bin]++;
  }

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > 0) {
      const p = histogram[i] / n;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

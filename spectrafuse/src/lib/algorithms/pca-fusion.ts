import { imageDataToGrayscale, grayscaleToImageData } from '@/lib/utils/canvas';
import { clamp255 } from '@/lib/utils/clamp';
import type { AlgorithmParams } from '@/types/fusion.types';

/**
 * PCA Fusion (Principal Component Analysis)
 * 1. Stack all bands as matrix M
 * 2. Compute covariance matrix
 * 3. Compute eigenvalues/eigenvectors
 * 4. Replace PC1 with histogram-matched thermal
 * 5. Reconstruct via inverse PCA
 */
export function pcaFusion(
  bands: ImageData[],
  _params: AlgorithmParams,
  onProgress?: (p: number) => void
): ImageData {
  const width = bands[0].width;
  const height = bands[0].height;
  const n = width * height;
  const numBands = bands.length;
  const grayBands = bands.map(b => imageDataToGrayscale(b));
  onProgress?.(10);

  // Compute means
  const means = grayBands.map(band => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += band[i];
    return sum / n;
  });

  // Center the data
  const centered = grayBands.map((band, b) => {
    const c = new Float64Array(n);
    for (let i = 0; i < n; i++) c[i] = band[i] - means[b];
    return c;
  });
  onProgress?.(20);

  // Compute covariance matrix (numBands × numBands)
  const cov: number[][] = Array.from({ length: numBands }, () => new Array(numBands).fill(0));
  for (let i = 0; i < numBands; i++) {
    for (let j = i; j < numBands; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) sum += centered[i][k] * centered[j][k];
      cov[i][j] = sum / (n - 1);
      cov[j][i] = cov[i][j];
    }
  }
  onProgress?.(30);

  // Eigendecomposition using Jacobi iteration (for small matrices)
  const { eigenvalues, eigenvectors } = jacobiEigen(cov);
  onProgress?.(40);

  // Sort by eigenvalue descending
  const indices = eigenvalues.map((_, i) => i).sort((a, b) => eigenvalues[b] - eigenvalues[a]);
  const sortedVecs = indices.map(i => eigenvectors.map(row => row[i]));

  // Project onto PCs: PC[j][i] = sum_b centered[b][i] * eigvec[j][b]
  const pcs = sortedVecs.map(vec => {
    const pc = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let b = 0; b < numBands; b++) sum += centered[b][i] * vec[b];
      pc[i] = sum;
    }
    return pc;
  });
  onProgress?.(60);

  // Histogram-match thermal to PC1
  const thermal = grayBands[grayBands.length - 1];
  const matchedThermal = histogramMatch(thermal, pcs[0]);

  // Replace PC1 with matched thermal
  pcs[0] = matchedThermal as any;
  onProgress?.(70);

  // Reconstruct: pixel[b] = sum_j PC[j][i] * eigvec[j][b] + mean[b]
  const result = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let val = 0;
    for (let j = 0; j < numBands; j++) {
      val += pcs[j][i] * sortedVecs[j][0]; // reconstruct first band channel
    }
    result[i] = clamp255(val + means[0]);
    if (onProgress && i % 50000 === 0) {
      onProgress(70 + Math.round((i / n) * 30));
    }
  }
  onProgress?.(100);
  return grayscaleToImageData(result, width, height);
}

function histogramMatch(source: Float64Array, target: Float64Array): Float64Array {
  const n = source.length;
  const result = new Float64Array(n);

  // Compute CDFs
  const srcHist = new Float64Array(256);
  const tgtHist = new Float64Array(256);
  for (let i = 0; i < n; i++) {
    srcHist[clamp255(source[i])]++;
    tgtHist[clamp255(target[i])]++;
  }
  const srcCdf = new Float64Array(256);
  const tgtCdf = new Float64Array(256);
  srcCdf[0] = srcHist[0]; tgtCdf[0] = tgtHist[0];
  for (let i = 1; i < 256; i++) {
    srcCdf[i] = srcCdf[i - 1] + srcHist[i];
    tgtCdf[i] = tgtCdf[i - 1] + tgtHist[i];
  }
  // Normalize CDFs
  for (let i = 0; i < 256; i++) {
    srcCdf[i] /= n;
    tgtCdf[i] /= n;
  }
  // Build mapping
  const mapping = new Uint8Array(256);
  for (let s = 0; s < 256; s++) {
    let bestJ = 0;
    let bestDiff = Infinity;
    for (let j = 0; j < 256; j++) {
      const diff = Math.abs(srcCdf[s] - tgtCdf[j]);
      if (diff < bestDiff) { bestDiff = diff; bestJ = j; }
    }
    mapping[s] = bestJ;
  }
  for (let i = 0; i < n; i++) {
    result[i] = mapping[clamp255(source[i])];
  }
  return result;
}

/**
 * Jacobi eigenvalue algorithm for small symmetric matrices
 */
function jacobiEigen(matrix: number[][]): { eigenvalues: number[]; eigenvectors: number[][] } {
  const n = matrix.length;
  const a = matrix.map(row => [...row]);
  const v: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let iter = 0; iter < 100; iter++) {
    // Find largest off-diagonal
    let maxVal = 0, p = 0, q = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(a[i][j]) > maxVal) {
          maxVal = Math.abs(a[i][j]);
          p = i; q = j;
        }
      }
    }
    if (maxVal < 1e-10) break;

    const theta = 0.5 * Math.atan2(2 * a[p][q], a[p][p] - a[q][q]);
    const c = Math.cos(theta), s = Math.sin(theta);

    // Rotate
    const newPP = c * c * a[p][p] + 2 * s * c * a[p][q] + s * s * a[q][q];
    const newQQ = s * s * a[p][p] - 2 * s * c * a[p][q] + c * c * a[q][q];
    a[p][q] = 0; a[q][p] = 0;
    a[p][p] = newPP; a[q][q] = newQQ;

    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const aip = c * a[i][p] + s * a[i][q];
        const aiq = -s * a[i][p] + c * a[i][q];
        a[i][p] = aip; a[p][i] = aip;
        a[i][q] = aiq; a[q][i] = aiq;
      }
    }
    for (let i = 0; i < n; i++) {
      const vip = c * v[i][p] + s * v[i][q];
      const viq = -s * v[i][p] + c * v[i][q];
      v[i][p] = vip;
      v[i][q] = viq;
    }
  }

  const eigenvalues = Array.from({ length: n }, (_, i) => a[i][i]);
  return { eigenvalues, eigenvectors: v };
}

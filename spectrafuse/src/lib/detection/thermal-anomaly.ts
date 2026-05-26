import { imageDataToGrayscale } from '@/lib/utils/canvas';
import type { Anomaly } from '@/types/detection.types';

/**
 * Thermal anomaly detection via thresholding
 * 1. Compute mean and std deviation of thermal band
 * 2. Flag pixels > mean + threshold × σ as hotspots
 * 3. Connected component labeling to group adjacent hotspots
 * 4. Filter by minimum area
 */
export function detectThermalAnomalies(
  thermalImageData: ImageData,
  threshold: number = 2.0,
  minArea: number = 40
): Anomaly[] {
  const width = thermalImageData.width;
  const height = thermalImageData.height;
  const rawGray = imageDataToGrayscale(thermalImageData);
  const n = rawGray.length;

  // 1. Apply a simple 3x3 box blur to eliminate single-pixel (salt and pepper) noise
  const gray = new Float32Array(n);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += rawGray[ny * width + nx];
            count++;
          }
        }
      }
      gray[y * width + x] = sum / count;
    }
  }

  // Compute mean and std
  let sum = 0;
  for (let i = 0; i < n; i++) sum += gray[i];
  const mean = sum / n;

  let varSum = 0;
  for (let i = 0; i < n; i++) {
    const diff = gray[i] - mean;
    varSum += diff * diff;
  }
  const std = Math.sqrt(varSum / n);
  const cutoff = mean + threshold * std;

  // Binary mask of hot pixels
  const mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    mask[i] = gray[i] > cutoff ? 1 : 0;
  }

  // Connected component labeling (4-connected)
  const labels = new Int32Array(n);
  let nextLabel = 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx] === 0) continue;

      const neighbors: number[] = [];
      if (x > 0 && labels[idx - 1] > 0) neighbors.push(labels[idx - 1]);
      if (y > 0 && labels[idx - width] > 0) neighbors.push(labels[idx - width]);

      if (neighbors.length === 0) {
        labels[idx] = nextLabel++;
      } else {
        const minLabel = Math.min(...neighbors);
        labels[idx] = minLabel;
        // Union: merge all neighbor labels to minimum
        for (const nl of neighbors) {
          if (nl !== minLabel) {
            for (let i = 0; i < n; i++) {
              if (labels[i] === nl) labels[i] = minLabel;
            }
          }
        }
      }
    }
  }

  // Collect regions
  const regions = new Map<number, { pixels: number[]; xs: number[]; ys: number[] }>();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const label = labels[idx];
      if (label === 0) continue;
      if (!regions.has(label)) regions.set(label, { pixels: [], xs: [], ys: [] });
      const r = regions.get(label)!;
      r.pixels.push(idx);
      r.xs.push(x);
      r.ys.push(y);
    }
  }

  // Build anomaly objects
  const anomalies: Anomaly[] = [];
  let id = 0;
  for (const [, region] of regions) {
    if (region.pixels.length < minArea) continue;

    const minX = Math.min(...region.xs);
    const maxX = Math.max(...region.xs);
    const minY = Math.min(...region.ys);
    const maxY = Math.max(...region.ys);

    let peak = 0, total = 0;
    for (const px of region.pixels) {
      const val = gray[px];
      total += val;
      if (val > peak) peak = val;
    }

    anomalies.push({
      id: `anomaly-${id++}`,
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      peakIntensity: peak,
      meanIntensity: total / region.pixels.length,
      area: region.pixels.length,
      confidence: Math.min(1, (peak - cutoff) / (std * 2)),
    });
  }

  return anomalies.sort((a, b) => b.peakIntensity - a.peakIntensity);
}

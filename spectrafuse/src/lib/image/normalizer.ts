import { clamp255 } from '@/lib/utils/clamp';

export function normalizeImageData(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const out = new ImageData(width, height);
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  for (let i = 0; i < data.length; i += 4) {
    const norm = ((data[i] - min) / range) * 255;
    out.data[i] = clamp255(norm);
    out.data[i + 1] = clamp255(norm);
    out.data[i + 2] = clamp255(norm);
    out.data[i + 3] = 255;
  }
  return out;
}

export function normalizeToRange(arr: Float64Array): Float64Array {
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min || 1;
  const out = new Float64Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    out[i] = ((arr[i] - min) / range) * 255;
  }
  return out;
}

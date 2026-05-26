export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function imageDataToGrayscale(imageData: ImageData): Float64Array {
  const { data, width, height } = imageData;
  const gray = new Float64Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }
  return gray;
}

export function grayscaleToImageData(gray: Float64Array, width: number, height: number): ImageData {
  const imageData = new ImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    const v = Math.max(0, Math.min(255, Math.round(gray[i])));
    const idx = i * 4;
    imageData.data[idx] = v;
    imageData.data[idx + 1] = v;
    imageData.data[idx + 2] = v;
    imageData.data[idx + 3] = 255;
  }
  return imageData;
}

export function imageDataToRGBArrays(imageData: ImageData): { r: Float64Array; g: Float64Array; b: Float64Array } {
  const len = imageData.width * imageData.height;
  const r = new Float64Array(len);
  const g = new Float64Array(len);
  const b = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const idx = i * 4;
    r[i] = imageData.data[idx];
    g[i] = imageData.data[idx + 1];
    b[i] = imageData.data[idx + 2];
  }
  return { r, g, b };
}

export function rgbArraysToImageData(
  r: Float64Array,
  g: Float64Array,
  b: Float64Array,
  width: number,
  height: number
): ImageData {
  const imageData = new ImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    imageData.data[idx] = Math.max(0, Math.min(255, Math.round(r[i])));
    imageData.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g[i])));
    imageData.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b[i])));
    imageData.data[idx + 3] = 255;
  }
  return imageData;
}

export function resizeImageData(source: ImageData, targetWidth: number, targetHeight: number): ImageData {
  const canvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(targetWidth, targetHeight)
    : (() => { const c = document.createElement('canvas'); c.width = targetWidth; c.height = targetHeight; return c; })();
  const ctx = canvas.getContext('2d')!;
  const srcCanvas = typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(source.width, source.height)
    : (() => { const c = document.createElement('canvas'); c.width = source.width; c.height = source.height; return c; })();
  const srcCtx = srcCanvas.getContext('2d')!;
  srcCtx.putImageData(source, 0, 0);
  ctx.drawImage(srcCanvas as unknown as CanvasImageSource, 0, 0, targetWidth, targetHeight);
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

import type { ImageBand, BandType } from '@/types/image.types';

export async function loadImageFromFile(file: File, bandType: BandType): Promise<ImageBand> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Could not get 2d context')); return; }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const channels = bandType === 'visible' ? 3 : 1;
      resolve({
        file,
        url,
        imageData,
        width: img.width,
        height: img.height,
        channels: channels as 1 | 3 | 4,
        bandType,
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export async function loadImageFromUrl(url: string, bandType: BandType, fileName: string): Promise<ImageBand> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return loadImageFromFile(file, bandType);
}

export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

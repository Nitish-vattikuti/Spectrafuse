import { saveAs } from 'file-saver';

export function canvasToBlob(canvas: HTMLCanvasElement, type: string = 'image/png', quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Export failed. Try a different format.'));
      },
      type,
      quality
    );
  });
}

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export async function exportAsPng(imageData: ImageData, algorithm: string): Promise<void> {
  const canvas = imageDataToCanvas(imageData);
  const blob = await canvasToBlob(canvas, 'image/png');
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  saveAs(blob, `spectrafuse_${algorithm}_${ts}.png`);
}

export async function exportAsJpeg(imageData: ImageData, algorithm: string): Promise<void> {
  const canvas = imageDataToCanvas(imageData);
  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  saveAs(blob, `spectrafuse_${algorithm}_${ts}.jpg`);
}

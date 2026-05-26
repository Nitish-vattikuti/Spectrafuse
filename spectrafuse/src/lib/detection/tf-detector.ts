import type { DetectionResult } from '@/types/detection.types';

let cocoModel: unknown = null;
let loading = false;

/**
 * Lazy-load TensorFlow.js and COCO-SSD model
 */
async function loadModel(): Promise<unknown> {
  if (cocoModel) return cocoModel;
  if (loading) {
    // Wait for existing load
    while (loading) await new Promise(r => setTimeout(r, 100));
    return cocoModel;
  }
  loading = true;
  try {
    const tf = await import('@tensorflow/tfjs');
    await tf.ready();
    const cocoSsd = await import('@tensorflow-models/coco-ssd');
    cocoModel = await cocoSsd.load();
    return cocoModel;
  } catch (err) {
    throw new Error('Object detection requires internet for first load. Retry.');
  } finally {
    loading = false;
  }
}

/**
 * Run COCO-SSD object detection on an image
 */
export async function detectObjects(imageData: ImageData): Promise<DetectionResult[]> {
  const model = await loadModel() as { detect: (input: HTMLCanvasElement) => Promise<Array<{ class: string; score: number; bbox: [number, number, number, number] }>> };

  // Create canvas from ImageData
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);

  const predictions = await model.detect(canvas);

  // Filter out classes that don't make sense from an aerial perspective (like person, dog)
  // and enforce a stricter confidence threshold
  const allowedClasses = ['car', 'truck', 'bus', 'train', 'airplane', 'boat', 'motorcycle'];

  return predictions
    .filter(p => allowedClasses.includes(p.class) && p.score >= 0.6)
    .map(p => ({
      label: p.class,
      confidence: Math.round(p.score * 100) / 100,
      bbox: p.bbox as [number, number, number, number],
    }));
}

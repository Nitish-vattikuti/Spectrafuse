import React, { useEffect, useRef } from 'react';
import type { DetectionResult, Anomaly } from '@/types/detection.types';

interface DetectionOverlayProps {
  imageData: ImageData | null;
  detections: DetectionResult[];
  anomalies: Anomaly[];
  width: number;
  height: number;
}

export function DetectionOverlay({ imageData, detections, anomalies, width, height }: DetectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const scaleX = width / imageData.width;
    const scaleY = height / imageData.height;

    // Draw detection boxes
    detections.forEach(det => {
      const [x, y, w, h] = det.bbox;
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);

      ctx.fillStyle = 'rgba(14, 165, 233, 0.85)';
      const label = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = '11px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x * scaleX, y * scaleY - 16, textWidth + 8, 16);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, x * scaleX + 4, y * scaleY - 4);
    });

    // Draw anomaly boxes
    anomalies.forEach(a => {
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(a.x * scaleX, a.y * scaleY, a.width * scaleX, a.height * scaleY);
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(249, 115, 22, 0.12)';
      ctx.fillRect(a.x * scaleX, a.y * scaleY, a.width * scaleX, a.height * scaleY);

      ctx.fillStyle = 'rgba(249, 115, 22, 0.85)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillRect(a.x * scaleX, a.y * scaleY - 14, 60, 14);
      ctx.fillStyle = '#fff';
      ctx.fillText(`Hotspot`, a.x * scaleX + 4, a.y * scaleY - 3);
    });
  }, [imageData, detections, anomalies, width, height]);

  if (!imageData) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

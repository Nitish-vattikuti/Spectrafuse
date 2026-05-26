import React, { useRef, useState, useEffect, useCallback } from 'react';

interface FusedImageViewerProps {
  imageData: ImageData | null;
  overlayAnomalies?: { x: number; y: number; width: number; height: number; id: string }[];
  overlayDetections?: { label: string; confidence: number; bbox: [number, number, number, number] }[];
}

export function FusedImageViewer({ imageData, overlayAnomalies = [], overlayDetections = [] }: FusedImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);

    // Draw detection overlays
    overlayDetections.forEach(det => {
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      ctx.strokeRect(det.bbox[0], det.bbox[1], det.bbox[2], det.bbox[3]);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
      ctx.font = '12px Inter';
      const label = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      const tw = ctx.measureText(label).width;
      ctx.fillRect(det.bbox[0], det.bbox[1] - 18, tw + 8, 18);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, det.bbox[0] + 4, det.bbox[1] - 5);
    });

    // Draw anomaly overlays
    overlayAnomalies.forEach(a => {
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(a.x, a.y, a.width, a.height);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
      ctx.fillRect(a.x, a.y, a.width, a.height);
    });
  }, [imageData, overlayDetections, overlayAnomalies]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.25, Math.min(8, z * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  if (!imageData) {
    return (
      <div className="flex items-center justify-center h-80 bg-dark-bg rounded-lg border border-dark-border">
        <div className="text-center">
          <div className="text-4xl mb-3 opacity-30">🛰️</div>
          <p className="text-dark-muted text-sm">Fused image will appear here</p>
          <p className="text-dark-muted text-xs mt-1">Upload bands and run fusion to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-dark-border bg-dark-bg cursor-grab active:cursor-grabbing"
      style={{ maxHeight: '500px' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        className="block mx-auto"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          maxHeight: '500px',
          objectFit: 'contain',
          width: '100%',
        }}
        aria-label="Fused image viewer"
      />
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-dark-bg/80 rounded text-xs text-dark-muted font-mono backdrop-blur-sm">
        {Math.round(zoom * 100)}% | {imageData.width}×{imageData.height}
      </div>
    </div>
  );
}

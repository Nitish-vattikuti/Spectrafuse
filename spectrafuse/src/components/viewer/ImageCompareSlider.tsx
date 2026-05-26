import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImageCompareSliderProps {
  beforeImageData: ImageData | null;
  afterImageData: ImageData | null;
}

export function ImageCompareSlider({ beforeImageData, afterImageData }: ImageCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  // Draw images onto canvases
  useEffect(() => {
    if (beforeImageData && beforeCanvasRef.current) {
      const ctx = beforeCanvasRef.current.getContext('2d')!;
      beforeCanvasRef.current.width = beforeImageData.width;
      beforeCanvasRef.current.height = beforeImageData.height;
      ctx.putImageData(beforeImageData, 0, 0);
    }
    if (afterImageData && afterCanvasRef.current) {
      const ctx = afterCanvasRef.current.getContext('2d')!;
      afterCanvasRef.current.width = afterImageData.width;
      afterCanvasRef.current.height = afterImageData.height;
      ctx.putImageData(afterImageData, 0, 0);
    }
  }, [beforeImageData, afterImageData]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  }, []);

  const handleMouseDown = useCallback(() => setDragging(true), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { if (dragging) handleMove(e.clientX); };
    const handleMouseUp = () => setDragging(false);
    const handleTouchMove = (e: TouchEvent) => { if (dragging && e.touches[0]) handleMove(e.touches[0].clientX); };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, handleMove]);

  if (!beforeImageData || !afterImageData) {
    return (
      <div className="flex items-center justify-center h-64 bg-dark-bg rounded-lg border border-dark-border">
        <p className="text-dark-muted text-sm">Upload images and run fusion to compare</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-dark-border cursor-ew-resize select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPos)}
    >
      {/* After (fused) - full width */}
      <canvas ref={afterCanvasRef} className="w-full h-auto block" style={{ maxHeight: '500px', objectFit: 'contain' }} />

      {/* Before (original) - clipped */}
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <canvas ref={beforeCanvasRef} className="h-full" style={{ maxHeight: '500px', objectFit: 'contain', width: containerRef.current?.offsetWidth || '100%' }} />
      </div>

      {/* Slider line */}
      <div className="absolute top-0 h-full w-0.5 bg-white shadow-lg" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-dark-bg text-xs font-bold">⟷</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-dark-bg/80 rounded text-xs text-dark-text backdrop-blur-sm">Original</div>
      <div className="absolute top-2 right-2 px-2 py-1 bg-primary/80 rounded text-xs text-white backdrop-blur-sm">Fused</div>
    </div>
  );
}

import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Square } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onActualSize: () => void;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onFit, onActualSize }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-lg hover:bg-dark-card text-dark-muted hover:text-dark-text transition-colors"
        aria-label="Zoom in"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-lg hover:bg-dark-card text-dark-muted hover:text-dark-text transition-colors"
        aria-label="Zoom out"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onFit}
        className="p-1.5 rounded-lg hover:bg-dark-card text-dark-muted hover:text-dark-text transition-colors"
        aria-label="Fit to view"
        title="Fit"
      >
        <Maximize className="w-4 h-4" />
      </button>
      <button
        onClick={onActualSize}
        className="p-1.5 rounded-lg hover:bg-dark-card text-dark-muted hover:text-dark-text transition-colors"
        aria-label="Actual size (1:1)"
        title="1:1"
      >
        <Square className="w-4 h-4" />
      </button>
      <span className="text-xs text-dark-muted font-mono ml-1">{Math.round(zoom * 100)}%</span>
    </div>
  );
}

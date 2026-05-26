import React from 'react';
import { useFusionStore } from '@/store/fusionStore';

export function DetectionReport() {
  const detectedObjects = useFusionStore((s) => s.detectedObjects);
  const thermalAnomalies = useFusionStore((s) => s.thermalAnomalies);

  if (detectedObjects.length === 0 && thermalAnomalies.length === 0) return null;

  return (
    <div className="space-y-3">
      {detectedObjects.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2">
            Objects ({detectedObjects.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {detectedObjects.map((det, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded bg-dark-bg text-xs">
                <span className="text-dark-text font-medium">{det.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono">{(det.confidence * 100).toFixed(0)}%</span>
                  <span className="text-dark-muted font-mono">x:{Math.round(det.bbox[0])}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {thermalAnomalies.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider mb-2">
            Hotspots ({thermalAnomalies.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {thermalAnomalies.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-dark-bg text-xs">
                <span className="text-accent font-medium">🔥 Hotspot</span>
                <div className="flex items-center gap-2">
                  <span className="text-dark-muted font-mono">{a.area}px</span>
                  <span className="text-accent font-mono">peak:{Math.round(a.peakIntensity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function ProcessingStatus() {
  const status = useFusionStore((s) => s.status);
  const progress = useFusionStore((s) => s.progress);
  const processingTime = useFusionStore((s) => s.processingTime);
  const errorMessage = useFusionStore((s) => s.errorMessage);

  if (status === 'idle') return null;

  return (
    <div className="space-y-2" aria-live="polite">
      {status === 'processing' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" className="text-primary" />
            <span className="text-sm text-dark-muted">Processing... {progress}%</span>
          </div>
          <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full progress-bar" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      )}
      {status === 'complete' && (
        <div className="flex items-center gap-2 text-sm text-success">
          <span>✓</span>
          <span>Fusion completed in {(processingTime / 1000).toFixed(1)}s</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <span>✕</span>
          <span>{errorMessage || 'Processing failed'}</span>
        </div>
      )}
    </div>
  );
}

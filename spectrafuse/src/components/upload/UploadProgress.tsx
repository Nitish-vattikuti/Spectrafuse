import React from 'react';

export function UploadProgress({ progress }: { progress: number }) {
  if (progress <= 0 || progress >= 100) return null;
  return (
    <div className="w-full bg-dark-border rounded-full h-1.5 overflow-hidden">
      <div className="bg-primary h-full rounded-full progress-bar" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
    </div>
  );
}

import React from 'react';
import { useDetection } from '@/hooks/useDetection';
import { useFusionStore } from '@/store/fusionStore';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Crosshair } from 'lucide-react';

import { InfoTooltip } from '@/components/ui/InfoTooltip';

export function TargetDetector() {
  const { runObjectDetection, detecting, detectionError } = useDetection();
  const result = useFusionStore((s) => s.result);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center">
          Detect Objects
          <InfoTooltip content="Runs a TensorFlow.js object detection model (COCO-SSD) on the fused image to identify vehicles, people, and other targets." />
        </span>
      </div>
      <Button
        onClick={runObjectDetection}
        disabled={!result || detecting}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {detecting ? (
          <>
            <LoadingSpinner size="sm" /> Detecting...
          </>
        ) : (
          <>
            <Crosshair className="w-4 h-4" /> Detect Objects
          </>
        )}
      </Button>
      {detectionError && (
        <p className="text-xs text-danger">{detectionError}</p>
      )}
    </div>
  );
}

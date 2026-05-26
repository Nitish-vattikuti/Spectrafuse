import React, { useState } from 'react';
import { useDetection } from '@/hooks/useDetection';
import { useImageStore } from '@/store/imageStore';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Flame } from 'lucide-react';

import { InfoTooltip } from '@/components/ui/InfoTooltip';

export function ThermalAnomalyFinder() {
  const { runAnomalyDetection, detectingAnomalies } = useDetection();
  const thermalBand = useImageStore((s) => s.thermalBand);
  const [threshold, setThreshold] = useState(2.0);

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center">
          Find Thermal Anomalies
          <InfoTooltip content="Scans the thermal band for localized hot spots (pixels exceeding the standard deviation threshold). Lower threshold = more sensitive." />
        </span>
      </div>
      <Slider
        id="anomaly-threshold"
        label="Threshold (σ)"
        value={threshold}
        min={1}
        max={4}
        step={0.1}
        onChange={setThreshold}
      />
      <Button
        onClick={() => runAnomalyDetection(threshold)}
        disabled={!thermalBand || detectingAnomalies}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {detectingAnomalies ? (
          <>
            <LoadingSpinner size="sm" /> Scanning...
          </>
        ) : (
          <>
            <Flame className="w-4 h-4" /> Find Thermal Anomalies
          </>
        )}
      </Button>
      {!thermalBand && (
        <p className="text-xs text-dark-muted">Upload a thermal band first</p>
      )}
    </div>
  );
}

import React from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { AlgorithmSelector } from './AlgorithmSelector';
import { ParameterPanel } from './ParameterPanel';

import { InfoTooltip } from '@/components/ui/InfoTooltip';

export function FusionControls() {
  const params = useFusionStore((s) => s.params);
  const setParam = useFusionStore((s) => s.setParam);

  return (
    <div className="space-y-5">
      <AlgorithmSelector />
      <div className="border-t border-dark-border pt-4">
        <ParameterPanel />
      </div>
      <div className="border-t border-dark-border pt-4 space-y-3">
        <label className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center">
          🎨 False Color
          <InfoTooltip content="Applies a false-color mapping (like Jet or Inferno) to highlight temperature variations from the thermal band. Opacity controls how strongly the colors overlay the image." />
        </label>
        <Select
          id="colormap-select"
          label="Colormap"
          value={params.falseColormap}
          options={[
            { value: 'inferno', label: 'Inferno' },
            { value: 'jet', label: 'Jet' },
            { value: 'viridis', label: 'Viridis' },
          ]}
          onChange={(v) => setParam('falseColormap', v)}
        />
        <Slider id="therm-opacity" label="Thermal Opacity" value={params.thermOpacity} min={0} max={1} step={0.05} onChange={(v) => setParam('thermOpacity', v)} />
      </div>
    </div>
  );
}

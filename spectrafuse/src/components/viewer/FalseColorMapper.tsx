import React from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';

export function FalseColorMapper() {
  const params = useFusionStore((s) => s.params);
  const setParam = useFusionStore((s) => s.setParam);

  return (
    <div className="space-y-3">
      <Select
        id="false-color-map"
        label="Thermal Colormap"
        value={params.falseColormap}
        options={[
          { value: 'inferno', label: '🔥 Inferno' },
          { value: 'jet', label: '🌈 Jet' },
          { value: 'viridis', label: '🟢 Viridis' },
        ]}
        onChange={(v) => setParam('falseColormap', v)}
      />
      <Slider
        id="thermal-opacity"
        label="Overlay Opacity"
        value={params.thermOpacity}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => setParam('thermOpacity', v)}
      />
    </div>
  );
}

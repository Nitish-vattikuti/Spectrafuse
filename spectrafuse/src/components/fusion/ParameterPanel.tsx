import React from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { Slider } from '@/components/ui/Slider';
import { Select } from '@/components/ui/Select';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

export function ParameterPanel() {
  const algorithm = useFusionStore((s) => s.algorithm);
  const params = useFusionStore((s) => s.params);
  const setParam = useFusionStore((s) => s.setParam);

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center">
        ⚙️ Parameters
        <InfoTooltip content="Fine-tune how much each band contributes to the final fused image. Adjust these values based on the specific features you want to highlight." />
      </label>

      {/* DWT specific */}
      {algorithm === 'dwt' && (
        <>
          <Slider id="decomp-level" label="Decomposition Level" value={params.decompositionLevel} min={1} max={5} step={1} onChange={(v) => setParam('decompositionLevel', v)} />
          <Select id="fusion-rule" label="Fusion Rule" value={params.fusionRule} options={[
            { value: 'max', label: 'Max (preserve edges)' },
            { value: 'mean', label: 'Mean (smooth)' },
            { value: 'min', label: 'Min (conservative)' },
          ]} onChange={(v) => setParam('fusionRule', v)} />
          <Slider id="alpha-weight" label="Alpha (approx weight)" value={params.alpha} min={0} max={1} step={0.05} onChange={(v) => setParam('alpha', v)} />
        </>
      )}

      {/* Brovey specific */}
      {algorithm === 'brovey' && (
        <Slider id="scale-factor" label="Scale Factor" value={params.scaleFactor} min={0.5} max={3} step={0.1} onChange={(v) => setParam('scaleFactor', v)} />
      )}

      {/* Mean / General weights */}
      {(algorithm === 'mean' || algorithm === 'dwt') && (
        <>
          <Slider id="vis-weight" label="Visible Weight" value={params.visibleWeight} min={0} max={1} step={0.05} onChange={(v) => setParam('visibleWeight', v)} />
          <Slider id="nir-weight" label="NIR Weight" value={params.nirWeight} min={0} max={1} step={0.05} onChange={(v) => setParam('nirWeight', v)} />
          <Slider id="therm-weight" label="Thermal Weight" value={params.thermalWeight} min={0} max={1} step={0.05} onChange={(v) => setParam('thermalWeight', v)} />
        </>
      )}
    </div>
  );
}

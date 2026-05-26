import React from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { ALGORITHM_INFO } from '@/types/fusion.types';
import type { Algorithm } from '@/types/fusion.types';
import { Badge } from '@/components/ui/Badge';

import { InfoTooltip } from '@/components/ui/InfoTooltip';

export function AlgorithmSelector() {
  const algorithm = useFusionStore((s) => s.algorithm);
  const setAlgorithm = useFusionStore((s) => s.setAlgorithm);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center">
        🔬 Algorithm
        <InfoTooltip content="Choose a fusion method. DWT preserves edges well. PCA is great for statistical variance. Brovey and IHS emphasize color/thermal injection." />
      </label>
      <div className="space-y-1">
        {ALGORITHM_INFO.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setAlgorithm(algo.id as Algorithm)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              algorithm === algo.id
                ? 'bg-primary/20 border border-primary/50 text-dark-text'
                : 'hover:bg-dark-bg border border-transparent text-dark-muted hover:text-dark-text'
            }`}
            aria-label={`Select ${algo.name}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{algo.id.toUpperCase()}</span>
              <Badge variant="secondary">{algo.bestFor}</Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import type { ImageBand } from '@/types/image.types';
import { Badge } from '@/components/ui/Badge';

export function ImagePreview({ band }: { band: ImageBand }) {
  return (
    <div className="rounded-lg border border-dark-border overflow-hidden bg-dark-bg">
      <img src={band.url} alt={`${band.bandType} band`} className="w-full h-24 object-cover" />
      <div className="p-2 flex items-center justify-between">
        <Badge variant={band.bandType === 'visible' ? 'primary' : band.bandType === 'nir' ? 'success' : 'warning'}>
          {band.bandType.toUpperCase()}
        </Badge>
        <span className="text-xs text-dark-muted font-mono">{band.width}×{band.height}</span>
      </div>
    </div>
  );
}

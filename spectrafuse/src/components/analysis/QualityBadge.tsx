import React from 'react';
import { Badge } from '@/components/ui/Badge';
import type { ImageMetrics } from '@/types/fusion.types';

export function QualityBadge({ quality }: { quality: ImageMetrics['quality'] | undefined }) {
  if (!quality) return null;

  const config = {
    excellent: { variant: 'success' as const, label: '★ Excellent' },
    good: { variant: 'primary' as const, label: '● Good' },
    fair: { variant: 'warning' as const, label: '◐ Fair' },
    poor: { variant: 'danger' as const, label: '○ Poor' },
  };

  const c = config[quality];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

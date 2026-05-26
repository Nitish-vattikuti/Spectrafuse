import React, { useEffect, useState } from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { QualityBadge } from './QualityBadge';

function AnimatedNumber({ value, decimals = 2, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    const startVal = 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(startVal + (value - startVal) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="font-mono text-dark-text">{display.toFixed(decimals)}{suffix}</span>;
}

function MetricBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full progress-bar ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function MetricsPanel() {
  const metrics = useFusionStore((s) => s.metrics);

  if (!metrics) {
    return (
      <div className="text-xs text-dark-muted text-center py-4">
        Run fusion to see quality metrics
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs font-medium text-dark-muted uppercase tracking-wider">Quality Metrics</h4>
        <QualityBadge quality={metrics.quality} />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-dark-muted">PSNR</span>
            <AnimatedNumber value={metrics.psnr} suffix=" dB" />
          </div>
          <MetricBar value={metrics.psnr} max={50} color="bg-primary" />
          <p className="text-[10px] text-dark-muted mt-0.5">{metrics.psnr > 35 ? 'Excellent' : metrics.psnr > 28 ? 'Good' : 'Fair'} (&gt;35 dB = excellent)</p>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-dark-muted">SSIM</span>
            <AnimatedNumber value={metrics.ssim} decimals={4} />
          </div>
          <MetricBar value={metrics.ssim} max={1} color="bg-secondary" />
          <p className="text-[10px] text-dark-muted mt-0.5">{metrics.ssim > 0.85 ? 'Excellent' : metrics.ssim > 0.7 ? 'Good' : 'Fair'} (&gt;0.85 = excellent)</p>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-dark-muted">Entropy</span>
            <AnimatedNumber value={metrics.entropy} suffix=" bits" />
          </div>
          <MetricBar value={metrics.entropy} max={8} color="bg-accent" />
          <p className="text-[10px] text-dark-muted mt-0.5">Info content (0–8 bits, higher = more detail)</p>
        </div>
      </div>
    </div>
  );
}

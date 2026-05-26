import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { imageDataToGrayscale, imageDataToRGBArrays } from '@/lib/utils/canvas';

interface BandHistogramProps {
  imageData: ImageData | null;
  isRGB?: boolean;
}

export function BandHistogram({ imageData, isRGB = false }: BandHistogramProps) {
  const data = useMemo(() => {
    if (!imageData) return [];
    const bins = 64;
    const binSize = 256 / bins;

    if (isRGB) {
      const { r, g, b } = imageDataToRGBArrays(imageData);
      const histR = new Array(bins).fill(0);
      const histG = new Array(bins).fill(0);
      const histB = new Array(bins).fill(0);
      for (let i = 0; i < r.length; i++) {
        histR[Math.min(bins - 1, Math.floor(r[i] / binSize))]++;
        histG[Math.min(bins - 1, Math.floor(g[i] / binSize))]++;
        histB[Math.min(bins - 1, Math.floor(b[i] / binSize))]++;
      }
      const max = Math.max(...histR, ...histG, ...histB) || 1;
      return Array.from({ length: bins }, (_, i) => ({
        bin: Math.round(i * binSize),
        R: Math.round((histR[i] / max) * 100),
        G: Math.round((histG[i] / max) * 100),
        B: Math.round((histB[i] / max) * 100),
      }));
    } else {
      const gray = imageDataToGrayscale(imageData);
      const hist = new Array(bins).fill(0);
      for (let i = 0; i < gray.length; i++) {
        hist[Math.min(bins - 1, Math.floor(gray[i] / binSize))]++;
      }
      const max = Math.max(...hist) || 1;
      return Array.from({ length: bins }, (_, i) => ({
        bin: Math.round(i * binSize),
        value: Math.round((hist[i] / max) * 100),
      }));
    }
  }, [imageData, isRGB]);

  if (!imageData) return null;

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <XAxis dataKey="bin" tick={{ fontSize: 8, fill: '#94A3B8' }} interval={15} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: 11 }} />
          {isRGB ? (
            <>
              <Bar dataKey="R" fill="#EF4444" opacity={0.7} />
              <Bar dataKey="G" fill="#22C55E" opacity={0.7} />
              <Bar dataKey="B" fill="#3B82F6" opacity={0.7} />
            </>
          ) : (
            <Bar dataKey="value" fill="#0EA5E9" opacity={0.8} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { imageDataToGrayscale } from '@/lib/utils/canvas';
import type { ImageBand } from '@/types/image.types';

interface SpectralPlotProps {
  bands: (ImageBand | null)[];
  fusedImageData: ImageData | null;
  row?: number; // which row to sample (default: center)
}

export function SpectralPlot({ bands, fusedImageData, row }: SpectralPlotProps) {
  const data = useMemo(() => {
    const activeBands = bands.filter(Boolean) as ImageBand[];
    if (activeBands.length === 0 && !fusedImageData) return [];

    const refBand = fusedImageData || activeBands[0].imageData;
    const sampleRow = row ?? Math.floor(refBand.height / 2);
    const width = refBand.width;
    const step = Math.max(1, Math.floor(width / 100)); // max 100 data points

    const points: Record<string, number>[] = [];

    for (let x = 0; x < width; x += step) {
      const point: Record<string, number> = { x };

      activeBands.forEach(band => {
        const gray = imageDataToGrayscale(band.imageData);
        const idx = sampleRow * band.imageData.width + Math.min(x, band.imageData.width - 1);
        point[band.bandType] = Math.round(gray[idx]);
      });

      if (fusedImageData) {
        const fusedGray = imageDataToGrayscale(fusedImageData);
        const idx = sampleRow * fusedImageData.width + Math.min(x, fusedImageData.width - 1);
        point['fused'] = Math.round(fusedGray[idx]);
      }

      points.push(point);
    }
    return points;
  }, [bands, fusedImageData, row]);

  if (data.length === 0) return null;

  const colors: Record<string, string> = {
    visible: '#3B82F6',
    nir: '#22C55E',
    thermal: '#F97316',
    fused: '#0EA5E9',
  };

  const keys = Object.keys(data[0]).filter(k => k !== 'x');

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <XAxis dataKey="x" tick={{ fontSize: 8, fill: '#94A3B8' }} />
          <YAxis domain={[0, 255]} tick={{ fontSize: 8, fill: '#94A3B8' }} width={30} />
          <Tooltip
            contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          {keys.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[key] || '#94A3B8'}
              dot={false}
              strokeWidth={1.5}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

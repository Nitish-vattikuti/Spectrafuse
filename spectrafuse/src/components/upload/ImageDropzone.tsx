import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import type { BandType } from '@/types/image.types';
import { useImageLoader } from '@/hooks/useImageLoader';

interface ImageDropzoneProps {
  bandType: BandType;
  label: string;
  hasImage: boolean;
  imageUrl?: string;
}

const bandColors: Record<BandType, string> = {
  visible: 'border-blue-500/50 hover:border-blue-400',
  nir: 'border-green-500/50 hover:border-green-400',
  thermal: 'border-orange-500/50 hover:border-orange-400',
};

const bandIcons: Record<BandType, string> = {
  visible: '🔵',
  nir: '🟢',
  thermal: '🟠',
};

import { InfoTooltip } from '@/components/ui/InfoTooltip';

const bandDescriptions: Record<BandType, string> = {
  visible: 'RGB image capturing natural colors as seen by the human eye. Best for context and spatial details.',
  nir: 'Near-Infrared band (750-1400nm). Excellent for penetrating haze and highlighting vegetation health.',
  thermal: 'Thermal Infrared band (8-15µm). Captures heat signatures from vehicles, machinery, or bodies regardless of lighting.'
};

export function ImageDropzone({ bandType, label, hasImage, imageUrl }: ImageDropzoneProps) {
  const { loadImage } = useImageLoader();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) return;
    try {
      await loadImage(acceptedFiles[0], bandType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    }
  }, [bandType, loadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.webp'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-dark-muted uppercase tracking-wider flex items-center gap-1">
        {bandIcons[bandType]} {label}
        <InfoTooltip content={bandDescriptions[bandType]} />
      </label>
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed p-3 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-primary bg-primary/10' : hasImage ? 'border-success/50 bg-success/5' : bandColors[bandType]
        } ${hasImage ? 'h-20' : 'h-24'}`}
        role="button"
        aria-label={`Upload ${label}`}
      >
        <input {...getInputProps()} />
        {hasImage && imageUrl ? (
          <div className="flex items-center gap-2 h-full">
            <img src={imageUrl} alt={`${label} preview`} className="h-full w-16 object-cover rounded" />
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-success font-medium">✓ Loaded</p>
              <p className="text-xs text-dark-muted truncate">Click to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1">
            <Upload className="w-5 h-5 text-dark-muted" />
            <p className="text-xs text-dark-muted">
              {isDragActive ? 'Drop here' : 'Drop or click'}
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 text-xs text-danger mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

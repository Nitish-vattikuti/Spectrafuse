import { useCallback } from 'react';
import { loadImageFromFile } from '@/lib/image/loader';
import { useImageStore } from '@/store/imageStore';
import type { BandType } from '@/types/image.types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'];

export function useImageLoader() {
  const setVisibleBand = useImageStore((s) => s.setVisibleBand);
  const setNirBand = useImageStore((s) => s.setNirBand);
  const setThermalBand = useImageStore((s) => s.setThermalBand);

  const loadImage = useCallback(async (file: File, bandType: BandType) => {
    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image exceeds 50MB limit.');
    }
    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|tiff?|bmp|webp)$/i)) {
      throw new Error('Please upload JPG, PNG, or TIFF images only.');
    }

    const band = await loadImageFromFile(file, bandType);

    switch (bandType) {
      case 'visible': setVisibleBand(band); break;
      case 'nir': setNirBand(band); break;
      case 'thermal': setThermalBand(band); break;
    }

    return band;
  }, [setVisibleBand, setNirBand, setThermalBand]);

  return { loadImage };
}

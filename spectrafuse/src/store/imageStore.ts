import { create } from 'zustand';
import type { ImageBand } from '@/types/image.types';
import { loadImageFromUrl } from '@/lib/image/loader';

interface ImageState {
  visibleBand: ImageBand | null;
  nirBand: ImageBand | null;
  thermalBand: ImageBand | null;
  setVisibleBand: (band: ImageBand | null) => void;
  setNirBand: (band: ImageBand | null) => void;
  setThermalBand: (band: ImageBand | null) => void;
  loadSampleImages: () => Promise<void>;
  clearAll: () => void;
  getAvailableBands: () => ImageData[];
}

export const useImageStore = create<ImageState>((set, get) => ({
  visibleBand: null,
  nirBand: null,
  thermalBand: null,

  setVisibleBand: (band) => set({ visibleBand: band }),
  setNirBand: (band) => set({ nirBand: band }),
  setThermalBand: (band) => set({ thermalBand: band }),

  loadSampleImages: async () => {
    try {
      const [visible, nir, thermal] = await Promise.all([
        loadImageFromUrl('/samples/visible.png', 'visible', 'sample_visible.png'),
        loadImageFromUrl('/samples/nir.png', 'nir', 'sample_nir.png'),
        loadImageFromUrl('/samples/thermal.png', 'thermal', 'sample_thermal.png'),
      ]);
      set({ visibleBand: visible, nirBand: nir, thermalBand: thermal });
    } catch (err) {
      console.error('Failed to load sample images:', err);
    }
  },

  clearAll: () => {
    const state = get();
    if (state.visibleBand?.url) URL.revokeObjectURL(state.visibleBand.url);
    if (state.nirBand?.url) URL.revokeObjectURL(state.nirBand.url);
    if (state.thermalBand?.url) URL.revokeObjectURL(state.thermalBand.url);
    set({ visibleBand: null, nirBand: null, thermalBand: null });
  },

  getAvailableBands: () => {
    const state = get();
    const bands: ImageData[] = [];
    if (state.visibleBand) bands.push(state.visibleBand.imageData);
    if (state.nirBand) bands.push(state.nirBand.imageData);
    if (state.thermalBand) bands.push(state.thermalBand.imageData);
    return bands;
  },
}));

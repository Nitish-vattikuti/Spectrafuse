export type Algorithm = 'dwt' | 'pca' | 'brovey' | 'ihs' | 'mean';

export interface AlgorithmParams {
  decompositionLevel: number;
  fusionRule: 'max' | 'mean' | 'min';
  alpha: number;
  scaleFactor: number;
  visibleWeight: number;
  nirWeight: number;
  thermalWeight: number;
  falseColormap: 'jet' | 'inferno' | 'viridis';
  thermOpacity: number;
}

export interface FusedResult {
  imageData: ImageData;
  algorithm: Algorithm;
  params: AlgorithmParams;
  timestamp: Date;
  processingTimeMs: number;
}

export interface ImageMetrics {
  psnr: number;
  ssim: number;
  entropy: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface AlgorithmInfo {
  id: Algorithm;
  name: string;
  description: string;
  bestFor: string;
}

export const DEFAULT_PARAMS: AlgorithmParams = {
  decompositionLevel: 3,
  fusionRule: 'max',
  alpha: 0.6,
  scaleFactor: 1.5,
  visibleWeight: 0.5,
  nirWeight: 0.3,
  thermalWeight: 0.2,
  falseColormap: 'inferno',
  thermOpacity: 0.7,
};

export const ALGORITHM_INFO: AlgorithmInfo[] = [
  { id: 'dwt', name: 'DWT (Discrete Wavelet Transform)', description: 'Uses Haar wavelets to decompose images into frequency sub-bands, then fuses detail and approximation coefficients.', bestFor: 'Detail preservation' },
  { id: 'pca', name: 'PCA (Principal Component Analysis)', description: 'Projects multi-band data onto principal components, replaces PC1 with high-resolution thermal data.', bestFor: 'Statistical independence' },
  { id: 'brovey', name: 'Brovey Transform', description: 'Pan-sharpening method using digital number factor to inject thermal information into visible bands.', bestFor: 'Color sharpening' },
  { id: 'ihs', name: 'IHS (Intensity-Hue-Saturation)', description: 'Replaces intensity channel with thermal data while preserving hue and saturation from visible imagery.', bestFor: 'Geometric accuracy' },
  { id: 'mean', name: 'Weighted Mean Fusion', description: 'Simple weighted pixel averaging across all input bands. Fast baseline method.', bestFor: 'Quick baseline check' },
];

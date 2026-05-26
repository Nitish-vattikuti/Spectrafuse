import { meanFusion } from './mean-fusion';
import { broveyFusion } from './brovey-fusion';
import { ihsFusion } from './ihs-fusion';
import { pcaFusion } from './pca-fusion';
import { dwtFusion } from './dwt-fusion';
import type { Algorithm, AlgorithmParams } from '@/types/fusion.types';

export type FusionFunction = (
  bands: ImageData[],
  params: AlgorithmParams,
  onProgress?: (p: number) => void
) => ImageData;

const algorithms: Record<Algorithm, FusionFunction> = {
  mean: meanFusion,
  brovey: broveyFusion,
  ihs: ihsFusion,
  pca: pcaFusion,
  dwt: dwtFusion,
};

export function runFusionAlgorithm(
  algorithm: Algorithm,
  bands: ImageData[],
  params: AlgorithmParams,
  onProgress?: (p: number) => void
): ImageData {
  const fn = algorithms[algorithm];
  if (!fn) throw new Error(`Unknown algorithm: ${algorithm}`);
  return fn(bands, params, onProgress);
}

export { meanFusion, broveyFusion, ihsFusion, pcaFusion, dwtFusion };

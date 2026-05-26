import { useCallback } from 'react';
import { useImageStore } from '@/store/imageStore';
import { useFusionStore } from '@/store/fusionStore';
import { runFusionAlgorithm } from '@/lib/algorithms';
import { computeAllMetrics } from '@/lib/metrics';
import { resizeImageData } from '@/lib/utils/canvas';

export function useFusion() {
  const getAvailableBands = useImageStore((s) => s.getAvailableBands);
  const visibleBand = useImageStore((s) => s.visibleBand);
  const algorithm = useFusionStore((s) => s.algorithm);
  const params = useFusionStore((s) => s.params);
  const setResult = useFusionStore((s) => s.setResult);
  const setStatus = useFusionStore((s) => s.setStatus);
  const setProgress = useFusionStore((s) => s.setProgress);
  const setProcessingTime = useFusionStore((s) => s.setProcessingTime);
  const setMetrics = useFusionStore((s) => s.setMetrics);
  const setError = useFusionStore((s) => s.setError);

  const runFusion = useCallback(async () => {
    const bands = getAvailableBands();
    if (bands.length === 0) {
      setError('Upload at least one image to begin.');
      return;
    }

    setStatus('processing');
    setProgress(0);
    setError(null);

    try {
      const startTime = performance.now();

      // Resize all bands to match the first band
      const targetW = bands[0].width;
      const targetH = bands[0].height;
      const resizedBands = bands.map((b) => {
        if (b.width !== targetW || b.height !== targetH) {
          return resizeImageData(b, targetW, targetH);
        }
        return b;
      });

      // Run fusion (yield to UI so processing spinners appear instantly)
      await new Promise(resolve => setTimeout(resolve, 50));
      const fusedImageData = runFusionAlgorithm(algorithm, resizedBands, params, (p) => {
        setProgress(p);
      });

      const elapsed = performance.now() - startTime;
      setProcessingTime(Math.round(elapsed));

      setResult({
        imageData: fusedImageData,
        algorithm,
        params: { ...params },
        timestamp: new Date(),
        processingTimeMs: Math.round(elapsed),
      });

      // Compute metrics
      const reference = resizedBands[0]; // Use first band as reference
      const metrics = computeAllMetrics(reference, fusedImageData);
      setMetrics(metrics);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed. Try a smaller image or different algorithm.');
      setStatus('error');
    }
  }, [algorithm, params, getAvailableBands, setResult, setStatus, setProgress, setProcessingTime, setMetrics, setError]);

  return { runFusion };
}

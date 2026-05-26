import { useCallback, useState } from 'react';
import { useFusionStore } from '@/store/fusionStore';
import { useImageStore } from '@/store/imageStore';
import { useUIStore } from '@/store/uiStore';
import { detectObjects } from '@/lib/detection/tf-detector';
import { detectThermalAnomalies } from '@/lib/detection/thermal-anomaly';

export function useDetection() {
  const result = useFusionStore((s) => s.result);
  const thermalBand = useImageStore((s) => s.thermalBand);
  const setDetectedObjects = useFusionStore((s) => s.setDetectedObjects);
  const setThermalAnomalies = useFusionStore((s) => s.setThermalAnomalies);
  const setViewMode = useUIStore((s) => s.setViewMode);
  
  const [detecting, setDetecting] = useState(false);
  const [detectingAnomalies, setDetectingAnomalies] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const runObjectDetection = useCallback(async () => {
    if (!result) return;
    setViewMode('single'); // Ensure the user can see the overlay on the single viewer
    setDetecting(true);
    setDetectionError(null);
    try {
      // Yield to let React render the "Detecting..." state
      await new Promise(resolve => setTimeout(resolve, 50));
      const objects = await detectObjects(result.imageData);
      setDetectedObjects(objects);
      if (objects.length === 0) {
        alert("No objects were detected in the fused image.");
      }
    } catch (err) {
      setDetectionError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setDetecting(false);
    }
  }, [result, setDetectedObjects, setViewMode]);

  const runAnomalyDetection = useCallback(async (threshold = 2.0) => {
    if (!thermalBand) return;
    setViewMode('single'); // Ensure the user can see the overlay
    setDetectingAnomalies(true);
    try {
      // Yield to let React render the "Finding..." state
      await new Promise(resolve => setTimeout(resolve, 50));
      const anomalies = detectThermalAnomalies(thermalBand.imageData, threshold);
      setThermalAnomalies(anomalies);
      if (anomalies.length === 0) {
        alert("No significant thermal anomalies found at this threshold.");
      }
    } finally {
      setDetectingAnomalies(false);
    }
  }, [thermalBand, setThermalAnomalies, setViewMode]);

  return { runObjectDetection, runAnomalyDetection, detecting, detectingAnomalies, detectionError };
}

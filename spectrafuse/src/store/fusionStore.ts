import { create } from 'zustand';
import type { Algorithm, AlgorithmParams, FusedResult, ImageMetrics } from '@/types/fusion.types';
import type { DetectionResult, Anomaly } from '@/types/detection.types';

interface FusionState {
  algorithm: Algorithm;
  params: AlgorithmParams;
  result: FusedResult | null;
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  processingTime: number;
  metrics: ImageMetrics | null;
  detectedObjects: DetectionResult[];
  thermalAnomalies: Anomaly[];
  errorMessage: string | null;
  setAlgorithm: (algo: Algorithm) => void;
  setParam: (key: string, value: number | string) => void;
  setResult: (result: FusedResult) => void;
  setStatus: (status: FusionState['status']) => void;
  setProgress: (progress: number) => void;
  setProcessingTime: (time: number) => void;
  setMetrics: (metrics: ImageMetrics) => void;
  setDetectedObjects: (objects: DetectionResult[]) => void;
  setThermalAnomalies: (anomalies: Anomaly[]) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

const defaultParams: AlgorithmParams = {
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

export const useFusionStore = create<FusionState>((set) => ({
  algorithm: 'dwt',
  params: { ...defaultParams },
  result: null,
  status: 'idle',
  progress: 0,
  processingTime: 0,
  metrics: null,
  detectedObjects: [],
  thermalAnomalies: [],
  errorMessage: null,

  setAlgorithm: (algo) => set({ algorithm: algo }),
  setParam: (key, value) => set((state) => ({
    params: { ...state.params, [key]: value },
  })),
  setResult: (result) => set({ result, status: 'complete' }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setProcessingTime: (time) => set({ processingTime: time }),
  setMetrics: (metrics) => set({ metrics }),
  setDetectedObjects: (objects) => set({ detectedObjects: objects }),
  setThermalAnomalies: (anomalies) => set({ thermalAnomalies: anomalies }),
  setError: (msg) => set({ errorMessage: msg, status: msg ? 'error' : 'idle' }),
  reset: () => set({
    result: null,
    status: 'idle',
    progress: 0,
    processingTime: 0,
    metrics: null,
    detectedObjects: [],
    thermalAnomalies: [],
    errorMessage: null,
  }),
}));

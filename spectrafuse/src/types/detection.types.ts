export interface DetectionResult {
  label: string;
  confidence: number;
  bbox: [x: number, y: number, width: number, height: number];
}

export interface Anomaly {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  peakIntensity: number;
  meanIntensity: number;
  area: number;
  confidence: number;
}

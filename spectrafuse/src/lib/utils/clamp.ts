export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clamp255(value: number): number {
  return clamp(Math.round(value), 0, 255);
}

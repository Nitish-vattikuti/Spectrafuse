import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  id: string;
}

export function Slider({ label, value, min, max, step = 0.1, onChange, unit, id }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-dark-muted">{label}</label>
        <span className="text-sm font-mono text-dark-text">{value}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label={label}
      />
    </div>
  );
}

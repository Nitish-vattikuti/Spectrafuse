import React from 'react';

interface SelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  id: string;
}

export function Select({ label, value, options, onChange, id }: SelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm text-dark-muted">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

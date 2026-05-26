import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <Tooltip content={content}>
      <span className="inline-flex items-center justify-center text-dark-muted hover:text-primary transition-colors cursor-help ml-1.5">
        <Info className="w-3.5 h-3.5" />
      </span>
    </Tooltip>
  );
}

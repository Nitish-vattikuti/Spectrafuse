import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 text-xs bg-dark-bg border border-dark-border rounded-lg text-dark-text w-56 text-center leading-relaxed z-50 shadow-lg animate-fade-in" role="tooltip">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-dark-bg border-r border-b border-dark-border rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}

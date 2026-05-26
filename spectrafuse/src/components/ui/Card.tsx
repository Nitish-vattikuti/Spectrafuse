import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}

export function Card({ className, children, glow }: CardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-dark-border bg-dark-card p-6 transition-all duration-200',
      glow && 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('text-lg font-semibold text-dark-text', className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('text-dark-muted text-sm', className)}>{children}</div>;
}

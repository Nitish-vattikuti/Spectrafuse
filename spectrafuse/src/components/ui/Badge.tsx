import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-dark-border text-dark-muted',
      variant === 'primary' && 'bg-primary/20 text-primary',
      variant === 'secondary' && 'bg-secondary/20 text-secondary',
      variant === 'success' && 'bg-success/20 text-success',
      variant === 'warning' && 'bg-warning/20 text-warning',
      variant === 'danger' && 'bg-danger/20 text-danger',
      className
    )}>
      {children}
    </span>
  );
}

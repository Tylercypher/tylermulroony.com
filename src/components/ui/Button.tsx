'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'electric';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-[var(--accent)] text-[var(--bg-primary)] hover:shadow-lg hover:shadow-[var(--accent-glow)]',
      secondary:
        'border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
      ghost:
        'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover-glow)]',
      electric:
        'electric-border text-[var(--accent)] border border-[var(--border-color)] hover:text-[var(--text-primary)]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-7 py-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

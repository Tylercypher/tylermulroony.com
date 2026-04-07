import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm',
          'placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]',
          'transition-all duration-300',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;

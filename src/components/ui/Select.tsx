import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm',
          'focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]',
          'transition-all duration-300 appearance-none',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
export default Select;

import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm',
          'placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]',
          'transition-all duration-300 resize-y min-h-[120px]',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;

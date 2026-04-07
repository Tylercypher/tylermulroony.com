import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 transition-all duration-300',
        hover && 'card-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

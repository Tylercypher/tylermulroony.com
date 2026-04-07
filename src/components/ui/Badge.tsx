import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export default function Badge({ children, variant = 'default', className, onClick, active }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
    accent: 'bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]',
    outline: 'border border-[var(--border-color)] text-[var(--text-secondary)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono transition-all duration-300',
        variants[variant],
        active && 'bg-[var(--accent)] text-[var(--bg-primary)]',
        onClick && 'cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)]',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}

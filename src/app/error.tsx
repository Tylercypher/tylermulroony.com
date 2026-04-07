'use client';

import Button from '@/components/ui/Button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-mono text-4xl font-bold text-red-500 mb-4">
          System Error
        </div>
        <div className="font-mono text-sm text-[var(--text-muted)] mb-6 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-left">
          <p className="text-[var(--text-secondary)]">$ process --status</p>
          <p className="text-red-500 mt-1">FATAL: An unexpected error occurred</p>
          <p className="text-[var(--text-muted)] mt-1">The process encountered an unrecoverable exception.</p>
        </div>
        <Button variant="primary" onClick={reset}>
          Retry Operation
        </Button>
      </div>
    </div>
  );
}

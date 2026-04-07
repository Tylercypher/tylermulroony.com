import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-mono text-6xl font-bold text-[var(--accent)] mb-4">
          404
        </div>
        <div className="font-mono text-sm text-[var(--text-muted)] mb-2 p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-left inline-block">
          <p className="text-[var(--text-secondary)]">$ access --path /requested-resource</p>
          <p className="text-red-500 mt-1">ERROR: Access Denied — Resource not found</p>
          <p className="text-[var(--text-muted)] mt-1">The requested endpoint does not exist or has been moved.</p>
          <p className="text-[var(--text-muted)] mt-2">$ suggest --action redirect</p>
          <p className="text-[var(--accent)] mt-1">Redirecting to known safe routes...</p>
        </div>
        <div className="mt-8">
          <Link href="/">
            <Button variant="electric" size="lg">
              Return to Home Base &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

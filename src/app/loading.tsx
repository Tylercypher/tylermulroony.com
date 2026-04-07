export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-[var(--text-muted)]">Loading...</p>
      </div>
    </div>
  );
}

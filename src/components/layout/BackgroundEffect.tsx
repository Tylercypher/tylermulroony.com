'use client';

import { useTheme } from '@/hooks/useTheme';

export default function BackgroundEffect() {
  const { theme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid / Dots */}
      <div
        className={`absolute inset-0 ${
          theme === 'cleartext' ? 'bg-dots' : 'bg-grid'
        }`}
        style={{
          opacity: theme === 'stealth' ? 0.3 : theme === 'neon' ? 0.5 : 0.4,
        }}
      />

      {/* Neon pulse overlay */}
      {theme === 'neon' && (
        <div className="absolute inset-0 bg-grid animate-pulse-glow" />
      )}

      {/* Scanline (neon only) */}
      {theme === 'neon' && <div className="scanline-overlay" />}
    </div>
  );
}

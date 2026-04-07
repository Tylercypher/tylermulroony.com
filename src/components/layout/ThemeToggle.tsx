'use client';

import { useTheme } from '@/hooks/useTheme';
import { themes, Theme } from '@/lib/themes';
import { Shield, Zap, Sun } from 'lucide-react';

const iconMap: Record<Theme, typeof Shield> = {
  stealth: Shield,
  neon: Zap,
  cleartext: Sun,
};

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return <div className="w-[120px] h-9" />;

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] p-1">
      {themes.map((t) => {
        const Icon = iconMap[t.id];
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`relative flex items-center justify-center w-8 h-7 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
            aria-label={`Switch to ${t.label} theme`}
            title={t.label}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

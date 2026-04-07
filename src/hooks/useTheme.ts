'use client';

import { useState, useEffect, useCallback } from 'react';
import { Theme, DEFAULT_THEME } from '@/lib/themes';

const STORAGE_KEY = 'tm-theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const validThemes: Theme[] = ['stealth', 'neon', 'cleartext'];
    const initial = stored && validThemes.includes(stored) ? stored : DEFAULT_THEME;
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return { theme, setTheme, mounted };
}

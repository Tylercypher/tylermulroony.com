export type Theme = 'stealth' | 'neon' | 'cleartext';

export const themes: { id: Theme; label: string; icon: string }[] = [
  { id: 'stealth', label: 'Stealth', icon: '🔒' },
  { id: 'neon', label: 'Neon', icon: '⚡' },
  { id: 'cleartext', label: 'Cleartext', icon: '☀️' },
];

export const DEFAULT_THEME: Theme = 'stealth';

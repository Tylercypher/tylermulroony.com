'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import { useTheme } from '@/hooks/useTheme';

export default function Footer() {
  const { theme } = useTheme();
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data?.socialLinks) return;
        try {
          const parsed = JSON.parse(data.socialLinks);
          setSocialLinks({
            github: parsed.github || '',
            linkedin: parsed.linkedin || '',
          });
        } catch {
          // ignore parse errors
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative mt-20">
      {/* Top border - animated gradient in neon mode */}
      <div
        className={`h-px w-full ${
          theme === 'neon'
            ? 'neon-gradient-border h-[2px]'
            : 'bg-[var(--border-color)]'
        }`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)] font-mono">
            &copy; 2026 Tyler Mulroony
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
            )}
            <Link
              href="/contact"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="Contact"
            >
              <Mail size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

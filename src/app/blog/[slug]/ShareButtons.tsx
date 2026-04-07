'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { LinkedinIcon, TwitterIcon } from '@/components/ui/Icons';

interface ShareButtonsProps {
  slug: string;
  title: string;
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--text-muted)] font-mono">Share:</span>
      <button
        onClick={copyLink}
        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--hover-glow)] transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--hover-glow)] transition-colors"
        aria-label="Share on X"
      >
        <TwitterIcon size={16} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--hover-glow)] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon size={16} />
      </a>
    </div>
  );
}

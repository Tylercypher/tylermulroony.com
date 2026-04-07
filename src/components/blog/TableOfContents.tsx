'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Parse headings from content
    const headingRegex = /^#{1,3}\s+(.+)$/gm;
    const parsed: TocItem[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[0].indexOf(' ');
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      parsed.push({ id, text, level });
    }
    setItems(parsed);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <List size={16} />
          Table of Contents
          <ChevronDown
            size={14}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <nav className="mt-3 pl-4 border-l border-[var(--border-color)]">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={`block py-1 text-sm transition-colors ${
                  item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : ''
                } ${
                  activeId === item.id
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden lg:block sticky top-24 max-h-[70vh] overflow-y-auto pl-4 border-l border-[var(--border-color)]">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
          On this page
        </p>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-1.5 text-sm transition-colors ${
              item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : ''
            } ${
              activeId === item.id
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </>
  );
}

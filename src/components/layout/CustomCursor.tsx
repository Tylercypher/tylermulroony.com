'use client';

import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isDesktop = useMediaQuery('(pointer: fine)');

  useEffect(() => {
    if (!isDesktop) return;

    document.documentElement.setAttribute('data-custom-cursor', 'true');

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (trailRef.current) {
        setTimeout(() => {
          if (trailRef.current) {
            trailRef.current.style.left = `${e.clientX}px`;
            trailRef.current.style.top = `${e.clientY}px`;
          }
        }, 80);
      }
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.removeAttribute('data-custom-cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Crosshair */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" stroke="var(--cursor-color)" strokeWidth="1" opacity="0.8" />
          <line x1="10" y1="0" x2="10" y2="6" stroke="var(--cursor-color)" strokeWidth="1" opacity="0.6" />
          <line x1="10" y1="14" x2="10" y2="20" stroke="var(--cursor-color)" strokeWidth="1" opacity="0.6" />
          <line x1="0" y1="10" x2="6" y2="10" stroke="var(--cursor-color)" strokeWidth="1" opacity="0.6" />
          <line x1="14" y1="10" x2="20" y2="10" stroke="var(--cursor-color)" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      {/* Trail glow */}
      <div
        ref={trailRef}
        className={`fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle, var(--accent-glow), transparent 70%)`,
          filter: 'blur(4px)',
        }}
      />
    </>
  );
}

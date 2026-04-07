'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-color)] shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative group" aria-label="Home">
              <span
                className="glitch-text text-2xl font-bold font-mono text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors"
                data-text="T.M"
              >
                T.M
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                    pathname === link.href
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="ml-4">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--accent)]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  );
}

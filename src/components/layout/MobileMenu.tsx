'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-72 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-l border-[var(--border-color)] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)]"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3 rounded-lg text-lg font-mono transition-colors ${
                      pathname === link.href
                        ? 'text-[var(--accent)] bg-[var(--accent-glow)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover-glow)]'
                    }`}
                  >
                    <span className="text-[var(--text-muted)] mr-2">&gt;</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

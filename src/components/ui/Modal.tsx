'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl">
              {title && (
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                  <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)]">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="p-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

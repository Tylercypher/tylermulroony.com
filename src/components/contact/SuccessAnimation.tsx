'use client';

import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';

export default function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full border-2 border-[var(--accent)] flex items-center justify-center bg-[var(--accent-glow)]">
          <Lock size={32} className="text-[var(--accent)]" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center"
        >
          <Check size={16} className="text-[var(--bg-primary)]" />
        </motion.div>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl font-bold font-mono text-[var(--text-primary)] mb-2"
      >
        Message Encrypted &amp; Sent
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-[var(--text-secondary)]"
      >
        Thanks for reaching out. I&apos;ll get back to you soon.
      </motion.p>
    </motion.div>
  );
}

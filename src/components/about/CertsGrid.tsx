'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award } from 'lucide-react';
import Card from '@/components/ui/Card';

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface CertsGridProps {
  certifications: Certification[];
}

export default function CertsGrid({ certifications }: CertsGridProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  if (certifications.length === 0) return null;

  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8 text-center">
        <span className="text-[var(--accent)]">{"// "}</span> Certifications
      </h2>
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="text-center">
              <Award size={28} className="text-[var(--accent)] mx-auto mb-3" />
              <h3 className="font-semibold font-mono text-[var(--text-primary)]">
                {cert.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {cert.issuer}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {cert.year}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

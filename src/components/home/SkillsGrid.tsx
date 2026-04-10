'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Shield, Network, Code2, Cloud, AlertTriangle, Terminal,
  Lock, Server, Database, Globe, Cpu, Search, Eye, Key,
  Wifi, Bug, FileCode, Layers, LucideIcon,
} from 'lucide-react';
import Card from '@/components/ui/Card';

const iconMap: Record<string, LucideIcon> = {
  Shield, Network, Code2, Cloud, AlertTriangle, Terminal,
  Lock, Server, Database, Globe, Cpu, Search, Eye, Key,
  Wifi, Bug, FileCode, Layers,
};

interface Skill {
  icon: string;
  title: string;
  description: string;
}

interface SkillsGridProps {
  skills?: Skill[];
}

export default function SkillsGrid({ skills: propSkills }: SkillsGridProps) {
  const [skills, setSkills] = useState<Skill[]>(propSkills || []);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (propSkills && propSkills.length > 0) return;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data?.skills) return;
        try {
          const parsed = JSON.parse(data.skills);
          if (Array.isArray(parsed) && parsed.length > 0) setSkills(parsed);
        } catch {}
      })
      .catch(() => {});
  }, [propSkills]);

  if (skills.length === 0) return null;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold font-mono text-[var(--text-primary)] mb-4">
          <span className="text-[var(--accent)]">{"// "}</span> Skills & Services
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          A comprehensive toolkit spanning offensive security, defensive operations, and modern software development.
        </p>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => {
          const IconComponent = iconMap[skill.icon] || Shield;
          return (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <IconComponent
                  size={32}
                  className="text-[var(--accent)] mb-4"
                />
                <h3 className="text-lg font-semibold font-mono text-[var(--text-primary)] mb-2">
                  {skill.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {skill.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

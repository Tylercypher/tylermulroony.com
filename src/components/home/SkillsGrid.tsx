'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Network, Code2, Cloud, AlertTriangle, Terminal } from 'lucide-react';
import Card from '@/components/ui/Card';

const skills = [
  {
    icon: Shield,
    title: 'Penetration Testing & Vulnerability Assessment',
    description:
      'Comprehensive security assessments using industry-standard methodologies. Identifying vulnerabilities before adversaries do.',
  },
  {
    icon: Network,
    title: 'Network Security & Architecture',
    description:
      'Designing and implementing secure network architectures. Firewall configuration, segmentation, and traffic analysis.',
  },
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Building secure, performant web applications with modern frameworks. React, Next.js, Node.js, and beyond.',
  },
  {
    icon: Cloud,
    title: 'Cloud Security (AWS/Azure)',
    description:
      'Securing cloud infrastructure and workloads. IAM policies, encryption, compliance frameworks, and cloud-native security tools.',
  },
  {
    icon: AlertTriangle,
    title: 'Incident Response & Forensics',
    description:
      'Rapid threat containment and investigation. Digital forensics, malware analysis, and post-incident reporting.',
  },
  {
    icon: Terminal,
    title: 'Scripting & Automation',
    description:
      'Automating security workflows and repetitive tasks with Python, Bash, and PowerShell. Building custom security tools.',
  },
];

export default function SkillsGrid() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

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
        {skills.map((skill, index) => (
          <motion.div
            key={skill.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <skill.icon
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
        ))}
      </div>
    </section>
  );
}

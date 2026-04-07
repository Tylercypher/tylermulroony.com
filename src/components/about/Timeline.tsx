'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '2024 - Present',
    title: 'Senior Security Engineer',
    company: 'Strategic Micro Systems',
    description:
      'Leading penetration testing engagements and security architecture reviews. Developing internal security automation tools and conducting red team exercises.',
  },
  {
    year: '2022 - 2024',
    title: 'Security Analyst',
    company: 'Cybersecurity Firm',
    description:
      'Performed vulnerability assessments and penetration tests for enterprise clients. Built custom scanning tools and automated reporting pipelines.',
  },
  {
    year: '2020 - 2022',
    title: 'Full-Stack Developer',
    company: 'Tech Startup',
    description:
      'Designed and built secure web applications using React, Node.js, and AWS. Implemented CI/CD pipelines and infrastructure-as-code with Terraform.',
  },
  {
    year: '2018 - 2020',
    title: 'IT Systems Administrator',
    company: 'Enterprise Corp',
    description:
      'Managed network infrastructure, Active Directory, and endpoint security. Responded to security incidents and implemented hardening policies.',
  },
];

export default function Timeline() {
  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-10 text-center">
        <span className="text-[var(--accent)]">//</span> Career Journey
      </h2>
      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-color)] md:-translate-x-px" />

        {timelineData.map((item, index) => (
          <TimelineNode key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function TimelineNode({ item, index }: { item: TimelineItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start mb-12 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Node dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-[var(--accent)] -translate-x-1.5 mt-2 z-10"
        style={{
          boxShadow: inView ? '0 0 10px var(--accent-glow), 0 0 20px var(--accent-glow)' : 'none',
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15 }}
        className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'
        }`}
      >
        <span className="text-xs font-mono text-[var(--accent)] tracking-wider uppercase">
          {item.year}
        </span>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-1">
          {item.title}
        </h3>
        <p className="text-sm font-mono text-[var(--text-secondary)] mt-0.5">
          {item.company}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
}

const timelineData: TimelineItem[] = [
  {
    year: '2025 – Present',
    title: 'Junior Systems Administrator',
    company: 'Strategic Micro Systems',
    location: 'New Jersey',
    bullets: [
      'Administer M365, Intune, and Azure AD / Entra ID across multiple client tenants — handling user lifecycle, device compliance, and Conditional Access.',
      'Manage Windows Server environments (AD, DNS, DHCP, GPO) and implement MFA, email security, and EDR/AV solutions.',
      'Utilize ConnectWise and NinjaRMM for RMM, patch management, ticketing, and backup/disaster recovery operations.',
    ],
  },
  {
    year: 'May 2025 – Sep 2025',
    title: 'Junior SysAdmin',
    company: 'MTP',
    location: 'Whippany, NJ',
    bullets: [
      'Deployed and configured endpoints for end users, managed IT inventory, and performed system maintenance and patch management.',
      'Supported on-site and remote clients through ticketing systems, structured cabling, and network configuration projects.',
    ],
  },
  {
    year: 'Oct 2024 – Present (Part-Time)',
    title: 'IT Technician',
    company: 'PC Visions',
    location: 'Old Bridge, NJ',
    bullets: [
      'Diagnose, repair, and maintain computers, security cameras, and network infrastructure for local clients.',
      'Hardware troubleshooting, device hardening, and system optimization including PC builds and component installations.',
    ],
  },
  {
    year: '2021 – Present',
    title: 'Technician',
    company: 'Passaic County Superintendent of Elections',
    location: 'New Jersey',
    bullets: [
      'Support election system operations including ESS software, networked poll books, and Wi-Fi modules, ensuring integrity and uptime.',
      'Provide on-site technical support during Election Day to ensure secure, compliant, and efficient system operation.',
    ],
  },
];

export default function Timeline() {
  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-10 text-center">
        <span className="text-[var(--accent)]">{"// "}</span> Career Journey
      </h2>
      <div className="relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[var(--border-color)]" />

        {timelineData.map((item, index) => (
          <TimelineNode key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function TimelineNode({ item, index }: { item: TimelineItem; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start mb-16 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Node dot — centered on the same anchor as the line */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--accent)] mt-1.5 z-10"
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
          {item.company} — {item.location}
        </p>
        <ul className={`mt-3 space-y-2 ${isLeft ? 'md:text-right' : ''}`}>
          {item.bullets.map((bullet, i) => (
            <li key={i} className="text-sm text-[var(--text-primary)] leading-relaxed flex gap-2 items-start">
              <span className={`text-[var(--accent)] mt-1 flex-shrink-0 ${isLeft ? 'md:order-last' : ''}`}>▹</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

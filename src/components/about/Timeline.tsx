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
      'Administer Microsoft 365 across multiple client tenants — user lifecycle, licensing, Exchange Online, SharePoint, OneDrive, and Azure AD / Entra ID.',
      'Deploy and manage Intune (MDM/MAM) for device compliance, configuration profiles, and Conditional Access policy enforcement across client endpoints.',
      'Implement MFA, email security (anti-phishing, spam filtering), and EDR/AV solutions to reduce client attack surface and strengthen overall security posture.',
      'Manage Windows Server environments including Active Directory, DNS, DHCP, and Group Policy across multi-client infrastructure.',
      'Oversee backup and disaster recovery operations to ensure business continuity and RPO/RTO compliance for clients.',
      'Utilize ConnectWise and NinjaRMM for RMM, patch management, ticketing, VPN support, and client onboarding documentation.',
    ],
  },
  {
    year: 'May 2025 – Sep 2025',
    title: 'Junior SysAdmin',
    company: 'MTP',
    location: 'Whippany, NJ',
    bullets: [
      'Deployed and configured new computers and software for end users, ensuring secure and efficient onboarding with minimal downtime.',
      'Managed IT inventory, hardware, and software assets to maintain accurate tracking for compliance and risk visibility.',
      'Performed system maintenance and patch management to mitigate vulnerabilities and enhance operational security.',
      'Supported both on-site and remote clients by resolving technical issues, escalating critical incidents when necessary.',
      'Assisted in structured cabling, wiring, and system configuration projects to support network reliability and scalability.',
      'Utilized ticketing systems to log, prioritize, and track issues, ensuring timely resolution and adherence to internal SLAs.',
    ],
  },
  {
    year: 'Oct 2024 – Present (Part-Time)',
    title: 'IT Technician',
    company: 'PC Visions',
    location: 'Old Bridge, NJ',
    bullets: [
      'Diagnose, repair, and maintain computers, IT systems, security cameras, and network infrastructure for local clients.',
      'Hands-on hardware troubleshooting, software installations, network configurations, and endpoint security management.',
      'Contribute to improving system stability through proper device hardening, updates, and configuration management.',
      'Document system performance issues and resolutions to improve operational risk tracking and prevent recurrence.',
      'Expand technical skills in PC building, component installation, and system optimization.',
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

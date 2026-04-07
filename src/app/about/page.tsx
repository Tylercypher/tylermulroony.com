import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { parseJsonField } from '@/lib/utils';
import { Download, MapPin } from 'lucide-react';
import Image from 'next/image';
import PageTransition from '@/components/layout/PageTransition';
import Timeline from '@/components/about/Timeline';
import CertsGrid from '@/components/about/CertsGrid';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Tyler Mulroony — cybersecurity professional and full-stack developer.',
};

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst({
    where: { id: 'default' },
  });

  const certifications = parseJsonField<{ name: string; issuer: string; year: string }[]>(
    settings?.certifications || '[]',
    []
  );

  const contactInfo = parseJsonField<{ location?: string }>(settings?.contactInfo || '{}', {});

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Split */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl border-2 border-[var(--border-color)] overflow-hidden bg-[var(--bg-tertiary)] relative">
              {settings?.profilePhotoUrl ? (
                <Image
                  src={settings.profilePhotoUrl}
                  alt="Tyler Mulroony"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl font-mono text-[var(--accent)]">
                  T.M
                </div>
              )}
            </div>
          </div>

          {/* Intro */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
              <span className="text-[var(--accent)]">&gt;</span> About Me
            </h1>
            {contactInfo.location && (
              <p className="flex items-center justify-center md:justify-start gap-2 text-sm text-[var(--text-muted)] mb-4">
                <MapPin size={14} />
                {contactInfo.location}
              </p>
            )}
            <div
              className="text-[var(--text-secondary)] leading-relaxed space-y-4 prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: settings?.aboutBio || `
                  <p>I'm a cybersecurity professional and full-stack developer with a passion for building secure systems and breaking insecure ones. My career spans penetration testing, network security architecture, incident response, and modern web development.</p>
                  <p>I believe that understanding how to build software makes you better at breaking it — and vice versa. This dual perspective drives everything I do, from designing secure applications to conducting thorough security assessments.</p>
                  <p>When I'm not hunting vulnerabilities or writing code, you'll find me contributing to open-source security tools, writing about emerging threats, and mentoring the next generation of cybersecurity professionals.</p>
                `,
              }}
            />
            {settings?.resumeUrl && (
              <a href={settings.resumeUrl} download className="inline-block mt-6">
                <Button variant="secondary">
                  <Download size={16} className="mr-2" />
                  Download Resume
                </Button>
              </a>
            )}
          </div>
        </section>

        {/* Timeline */}
        <Timeline />

        {/* Certifications */}
        <CertsGrid certifications={certifications} />

        {/* Fun Facts */}
        <section className="py-16 text-center">
          <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
            <span className="text-[var(--accent)]">{"// "}</span> When I&apos;m Not Hacking
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'CTF Competitions', detail: 'Competing and learning in capture-the-flag events' },
              { label: 'Home Lab', detail: 'Running a self-hosted security research environment' },
              { label: 'Open Source', detail: 'Contributing to security tools and frameworks' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]"
              >
                <h3 className="font-mono font-semibold text-[var(--accent)] mb-2">{item.label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

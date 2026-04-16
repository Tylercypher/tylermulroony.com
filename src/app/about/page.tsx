export const dynamic = 'force-dynamic';

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
  description: 'Learn about Tyler Mulroony — systems administrator, aspiring AI enthusiast, and lifelong learner.',
};

export default async function AboutPage() {
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findFirst>> = null;

  try {
    settings = await prisma.siteSettings.findFirst({
      where: { id: 'default' },
    });
  } catch {
    // DB temporarily unavailable
  }

  const certifications = parseJsonField<{ name: string; issuer: string; year: string }[]>(
    settings?.certifications || '[]',
    []
  );

  const contactInfo = parseJsonField<{ location?: string }>(settings?.contactInfo || '{}', {});

  const careerTimeline = parseJsonField<
    { year: string; title: string; company: string; location: string; bullets: string[] }[]
  >(settings?.careerTimeline || '[]', []);

  const funFacts = parseJsonField<{ label: string; detail: string }[]>(
    settings?.funFacts || '[]',
    []
  );

  const funFactsHeading = settings?.funFactsHeading || "When I'm Not Working";

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
                  <p>I'm a Junior Systems Administrator at Strategic Micro Systems, where I manage M365, Intune, Azure AD / Entra ID, Windows Server environments, and security tooling across multiple client tenants. Every day brings a different challenge — and that's exactly what I love about this field.</p>
                  <p>I'm driven by a constant desire to learn. Whether it's studying for my next certification, spinning up something new in my home lab, or diving into a CTF competition, I'm always looking for the next thing to get better at. Lately, I've been especially drawn to AI and how it's reshaping IT operations, security, and development workflows. I'm actively exploring tools like Claude, building projects that integrate AI, and finding ways to bring that into my day-to-day work.</p>
                  <p>I also build full-stack web apps — like this site — to sharpen my development skills and stay creative outside of infrastructure work.</p>
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
        <Timeline items={careerTimeline} />

        {/* Certifications */}
        <CertsGrid certifications={certifications} />

        {/* Fun Facts / Interests */}
        {(funFacts.length > 0 || !settings?.funFacts) && (
          <section className="py-16 text-center">
            <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
              <span className="text-[var(--accent)]">{"// "}</span> {funFactsHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {(funFacts.length > 0
                ? funFacts
                : [
                    { label: 'AI & Automation', detail: 'Exploring how AI tools like Claude can streamline IT operations and development' },
                    { label: 'Continuous Learning', detail: 'Always studying for the next cert, building projects, and pushing into new technologies' },
                    { label: 'Home Lab', detail: 'Running a self-hosted environment for security research, testing, and hands-on learning' },
                  ]
              ).map((item) => (
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
        )}
      </div>
    </PageTransition>
  );
}

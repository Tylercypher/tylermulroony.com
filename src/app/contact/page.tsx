export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { parseJsonField } from '@/lib/utils';
import { Mail, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';
import PageTransition from '@/components/layout/PageTransition';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Tyler Mulroony for security consultations, project collaborations, or opportunities.',
};

export default async function ContactPage() {
  let settings: Awaited<ReturnType<typeof prisma.siteSettings.findFirst>> = null;

  try {
    settings = await prisma.siteSettings.findFirst({
      where: { id: 'default' },
    });
  } catch {
    // DB temporarily unavailable
  }

  const contactInfo = parseJsonField<{ email?: string; location?: string }>(
    settings?.contactInfo || '{}',
    {}
  );
  const socialLinks = parseJsonField<{ github?: string; linkedin?: string }>(
    settings?.socialLinks || '{}',
    {}
  );
  const contactHeading = settings?.contactPageHeading || "Have a project in mind, a security concern, or just want to connect? Let's talk.";
  const subjects = parseJsonField<string[]>(settings?.contactPageSubjects || '[]', []);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> Contact
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {contactHeading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="order-2 lg:order-1">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8">
              <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] mb-6">
                <span className="text-[var(--accent)]">{"// "}</span> Send a Message
              </h2>
              <ContactForm subjects={subjects} />
            </div>
          </div>

          {/* Info */}
          <div className="order-1 lg:order-2">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] mb-6">
                <span className="text-[var(--accent)]">{"// "}</span> Contact Info
              </h2>
              <div className="space-y-6">
                {contactInfo.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-[var(--text-muted)] mb-1">Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                {contactInfo.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-[var(--text-muted)] mb-1">Location</p>
                      <p className="text-[var(--text-primary)]">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
                {socialLinks.github && (
                  <div className="flex items-start gap-3">
                    <GithubIcon size={20} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-[var(--text-muted)] mb-1">GitHub</p>
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                      >
                        {socialLinks.github.replace('https://github.com/', '@')}
                      </a>
                    </div>
                  </div>
                )}
                {socialLinks.linkedin && (
                  <div className="flex items-start gap-3">
                    <LinkedinIcon size={20} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-[var(--text-muted)] mb-1">LinkedIn</p>
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal decoration */}
              <div className="mt-8 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono text-xs">
                <p className="text-[var(--text-muted)]">$ ping tylermulroony.com</p>
                <p className="text-[var(--accent)] mt-1">PONG — Response time: &lt;24h</p>
                <p className="text-[var(--text-muted)] mt-1">$ _</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

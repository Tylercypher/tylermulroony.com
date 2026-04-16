'use client';

import { useState, useEffect, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface TimelineEntry {
  year: string;
  title: string;
  company: string;
  location: string;
  bullets: string[];
}

interface FunFact {
  label: string;
  detail: string;
}

const defaultTimeline: TimelineEntry[] = [
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

const defaultFunFacts: FunFact[] = [
  { label: 'AI & Automation', detail: 'Exploring how AI tools like Claude can streamline IT operations and development' },
  { label: 'Continuous Learning', detail: 'Always studying for the next cert, building projects, and pushing into new technologies' },
  { label: 'Home Lab', detail: 'Running a self-hosted environment for security research, testing, and hands-on learning' },
];

export default function AdminAboutPage() {
  const [aboutBio, setAboutBio] = useState('');
  const [timeline, setTimeline] = useState<TimelineEntry[]>(defaultTimeline);
  const [funFacts, setFunFacts] = useState<FunFact[]>(defaultFunFacts);
  const [funFactsHeading, setFunFactsHeading] = useState("When I'm Not Working");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data) {
          setLoading(false);
          return;
        }
        if (data.aboutBio) setAboutBio(data.aboutBio);
        try {
          const parsed = JSON.parse(data.careerTimeline || '[]');
          if (parsed.length > 0) setTimeline(parsed);
        } catch { /* use default */ }
        try {
          const parsed = JSON.parse(data.funFacts || '[]');
          if (parsed.length > 0) setFunFacts(parsed);
        } catch { /* use default */ }
        if (data.funFactsHeading) setFunFactsHeading(data.funFactsHeading);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aboutBio,
        careerTimeline: JSON.stringify(timeline),
        funFacts: JSON.stringify(funFacts),
        funFactsHeading,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  // Timeline helpers
  const addTimelineEntry = () => {
    setTimeline([...timeline, { year: '', title: '', company: '', location: '', bullets: [''] }]);
  };

  const removeTimelineEntry = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const updateTimelineEntry = (index: number, field: keyof TimelineEntry, value: string) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const addBullet = (timelineIndex: number) => {
    const updated = [...timeline];
    updated[timelineIndex] = {
      ...updated[timelineIndex],
      bullets: [...updated[timelineIndex].bullets, ''],
    };
    setTimeline(updated);
  };

  const removeBullet = (timelineIndex: number, bulletIndex: number) => {
    const updated = [...timeline];
    updated[timelineIndex] = {
      ...updated[timelineIndex],
      bullets: updated[timelineIndex].bullets.filter((_, i) => i !== bulletIndex),
    };
    setTimeline(updated);
  };

  const updateBullet = (timelineIndex: number, bulletIndex: number, value: string) => {
    const updated = [...timeline];
    const bullets = [...updated[timelineIndex].bullets];
    bullets[bulletIndex] = value;
    updated[timelineIndex] = { ...updated[timelineIndex], bullets };
    setTimeline(updated);
  };

  const moveTimelineEntry = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= timeline.length) return;
    const updated = [...timeline];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTimeline(updated);
  };

  // Fun Facts helpers
  const addFunFact = () => {
    setFunFacts([...funFacts, { label: '', detail: '' }]);
  };

  const removeFunFact = (index: number) => {
    setFunFacts(funFacts.filter((_, i) => i !== index));
  };

  const updateFunFact = (index: number, field: keyof FunFact, value: string) => {
    const updated = [...funFacts];
    updated[index] = { ...updated[index], [field]: value };
    setFunFacts(updated);
  };

  if (loading) {
    return <p className="text-[var(--text-muted)] font-mono">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
        <span className="text-[var(--accent)]">&gt;</span> About Page
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
        {/* About Me Bio */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            About Me
          </h2>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">
              Bio (HTML supported)
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              This is the main paragraph on the About page. Wrap paragraphs in &lt;p&gt; tags.
            </p>
            <Textarea
              value={aboutBio}
              onChange={(e) => setAboutBio(e.target.value)}
              rows={8}
              placeholder="<p>Write about yourself here...</p>"
            />
          </div>
        </section>

        {/* Career Timeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)]">
              Career Journey
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addTimelineEntry}>
              <Plus size={14} className="mr-1" /> Add Role
            </Button>
          </div>

          {timeline.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] font-mono py-4">
              No roles added yet. Click &quot;Add Role&quot; to get started.
            </p>
          )}

          {timeline.map((entry, tIndex) => (
            <div
              key={tIndex}
              className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical size={16} className="text-[var(--text-muted)]" />
                  <span className="text-sm font-mono font-semibold text-[var(--accent)]">
                    Role {tIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => moveTimelineEntry(tIndex, 'up')}
                    disabled={tIndex === 0}
                  >
                    &uarr;
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => moveTimelineEntry(tIndex, 'down')}
                    disabled={tIndex === timeline.length - 1}
                  >
                    &darr;
                  </Button>
                  <button
                    type="button"
                    onClick={() => removeTimelineEntry(tIndex)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Time Period
                  </label>
                  <Input
                    value={entry.year}
                    onChange={(e) => updateTimelineEntry(tIndex, 'year', e.target.value)}
                    placeholder="e.g. 2025 – Present"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Job Title
                  </label>
                  <Input
                    value={entry.title}
                    onChange={(e) => updateTimelineEntry(tIndex, 'title', e.target.value)}
                    placeholder="e.g. Junior Systems Administrator"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Company
                  </label>
                  <Input
                    value={entry.company}
                    onChange={(e) => updateTimelineEntry(tIndex, 'company', e.target.value)}
                    placeholder="e.g. Strategic Micro Systems"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
                    Location
                  </label>
                  <Input
                    value={entry.location}
                    onChange={(e) => updateTimelineEntry(tIndex, 'location', e.target.value)}
                    placeholder="e.g. New Jersey"
                  />
                </div>
              </div>

              {/* Bullets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-[var(--text-muted)]">
                    Description Bullets
                  </label>
                  <button
                    type="button"
                    onClick={() => addBullet(tIndex)}
                    className="text-xs font-mono text-[var(--accent)] hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {entry.bullets.map((bullet, bIndex) => (
                    <div key={bIndex} className="flex gap-2">
                      <span className="text-[var(--accent)] mt-2.5 flex-shrink-0 text-sm">&#9657;</span>
                      <Textarea
                        value={bullet}
                        onChange={(e) => updateBullet(tIndex, bIndex, e.target.value)}
                        rows={2}
                        className="min-h-[60px]"
                        placeholder="Describe what you did..."
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(tIndex, bIndex)}
                        className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors mt-1 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Fun Facts / Interests */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)]">
              Interests Section
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addFunFact}>
              <Plus size={14} className="mr-1" /> Add Item
            </Button>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">
              Section Heading
            </label>
            <Input
              value={funFactsHeading}
              onChange={(e) => setFunFactsHeading(e.target.value)}
              placeholder="e.g. When I'm Not Working"
            />
          </div>

          {funFacts.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] font-mono py-4">
              No items added yet. Click &quot;Add Item&quot; to get started.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {funFacts.map((fact, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--accent)]">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFunFact(index)}
                    className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <Input
                  value={fact.label}
                  onChange={(e) => updateFunFact(index, 'label', e.target.value)}
                  placeholder="Label (e.g. Home Lab)"
                />
                <Input
                  value={fact.detail}
                  onChange={(e) => updateFunFact(index, 'detail', e.target.value)}
                  placeholder="Description"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save About Page'}
          </Button>
          {saved && (
            <span className="text-sm text-[var(--accent)] font-mono">About page saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}

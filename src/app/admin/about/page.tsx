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

export default function AdminAboutPage() {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [funFactsHeading, setFunFactsHeading] = useState("When I'm Not Working");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
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

'use client';

import { useState, useEffect, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

interface SiteSettings {
  heroTagline: string;
  heroTitles: string;
  aboutBio: string;
  certifications: string;
  resumeUrl: string | null;
  socialLinks: string;
  contactInfo: string;
  defaultTheme: string;
  profilePhotoUrl: string | null;
  skills: string;
  contactPageHeading: string;
  contactPageSubjects: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({
    heroTagline: '',
    heroTitles: '',
    aboutBio: '',
    certifications: '',
    resumeUrl: '',
    github: '',
    linkedin: '',
    email: '',
    location: '',
    defaultTheme: 'stealth',
    profilePhotoUrl: '',
    skills: '',
    contactPageHeading: '',
    contactPageSubjects: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data: SiteSettings) => {
        if (!data) return;
        setSettings(data);
        const social = (() => { try { return JSON.parse(data.socialLinks); } catch { return {}; } })();
        const contact = (() => { try { return JSON.parse(data.contactInfo); } catch { return {}; } })();
        const certs = (() => {
          try {
            const parsed = JSON.parse(data.certifications);
            return JSON.stringify(parsed, null, 2);
          } catch { return data.certifications; }
        })();

        const skillsStr = (() => {
          try {
            const parsed = JSON.parse(data.skills || '[]');
            return JSON.stringify(parsed, null, 2);
          } catch { return data.skills || '[]'; }
        })();
        const subjectsStr = (() => {
          try {
            const parsed = JSON.parse(data.contactPageSubjects || '[]');
            return JSON.stringify(parsed, null, 2);
          } catch { return data.contactPageSubjects || '[]'; }
        })();

        const titlesStr = (() => {
          try {
            const parsed = JSON.parse(data.heroTitles || '[]');
            return JSON.stringify(parsed, null, 2);
          } catch { return data.heroTitles || '[]'; }
        })();

        setForm({
          heroTagline: data.heroTagline,
          heroTitles: titlesStr,
          aboutBio: data.aboutBio,
          certifications: certs,
          resumeUrl: data.resumeUrl || '',
          github: social.github || '',
          linkedin: social.linkedin || '',
          email: contact.email || '',
          location: contact.location || '',
          defaultTheme: data.defaultTheme,
          profilePhotoUrl: data.profilePhotoUrl || '',
          skills: skillsStr,
          contactPageHeading: data.contactPageHeading || '',
          contactPageSubjects: subjectsStr,
        });
      });
  }, []);

  const handleUpload = async (file: File, type: 'resume' | 'photo') => {
    const setUploading = type === 'resume' ? setUploadingResume : setUploadingPhoto;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      if (type === 'resume') {
        setForm((f) => ({ ...f, resumeUrl: url }));
      } else {
        setForm((f) => ({ ...f, profilePhotoUrl: url }));
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      heroTagline: form.heroTagline,
      heroTitles: form.heroTitles,
      aboutBio: form.aboutBio,
      certifications: form.certifications,
      resumeUrl: form.resumeUrl || null,
      socialLinks: JSON.stringify({ github: form.github, linkedin: form.linkedin }),
      contactInfo: JSON.stringify({ email: form.email, location: form.location }),
      defaultTheme: form.defaultTheme,
      profilePhotoUrl: form.profilePhotoUrl || null,
      skills: form.skills,
      contactPageHeading: form.contactPageHeading,
      contactPageSubjects: form.contactPageSubjects,
    };

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!settings) {
    return <p className="text-[var(--text-muted)] font-mono">Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
        <span className="text-[var(--accent)]">&gt;</span> Site Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {/* Hero */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Hero Section
          </h2>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">
              Rotating Titles (JSON array of strings)
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              These cycle in the typing animation on the home page (e.g. your name, job titles)
            </p>
            <Textarea
              value={form.heroTitles}
              onChange={(e) => setForm({ ...form, heroTitles: e.target.value })}
              rows={5}
              className="font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Tagline</label>
            <Input value={form.heroTagline} onChange={(e) => setForm({ ...form, heroTagline: e.target.value })} />
          </div>
        </section>

        {/* About */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            About Page
          </h2>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Bio (HTML)</label>
            <Textarea value={form.aboutBio} onChange={(e) => setForm({ ...form, aboutBio: e.target.value })} rows={8} />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">
              Certifications (JSON array: [{'"name"'}, {'"issuer"'}, {'"year"'}])
            </label>
            <Textarea
              value={form.certifications}
              onChange={(e) => setForm({ ...form, certifications: e.target.value })}
              rows={6}
              className="font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Profile Photo</label>
            <div className="flex items-center gap-3">
              <Input value={form.profilePhotoUrl} onChange={(e) => setForm({ ...form, profilePhotoUrl: e.target.value })} placeholder="URL or upload" />
              <label className="cursor-pointer">
                <Button type="button" variant="secondary" size="sm" disabled={uploadingPhoto}>
                  {uploadingPhoto ? 'Uploading...' : 'Upload'}
                </Button>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'photo')} />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Resume PDF</label>
            <div className="flex items-center gap-3">
              <Input value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} placeholder="URL or upload" />
              <label className="cursor-pointer">
                <Button type="button" variant="secondary" size="sm" disabled={uploadingResume}>
                  {uploadingResume ? 'Uploading...' : 'Upload'}
                </Button>
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'resume')} />
              </label>
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">GitHub URL</label>
              <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">LinkedIn URL</label>
              <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Contact Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Location</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Home Page Skills
          </h2>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">
              Skills (JSON array: [{'"icon"'}, {'"title"'}, {'"description"'}])
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              Available icons: Shield, Network, Code2, Cloud, AlertTriangle, Terminal, Lock, Server, Database, Globe, Cpu, Search, Eye, Key, Wifi, Bug, FileCode, Layers
            </p>
            <Textarea
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              rows={12}
              className="font-mono text-xs"
            />
          </div>
        </section>

        {/* Contact Page */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Contact Page
          </h2>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Page Subtitle</label>
            <Input
              value={form.contactPageHeading}
              onChange={(e) => setForm({ ...form, contactPageHeading: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">
              Subject Dropdown Options (JSON array of strings)
            </label>
            <Textarea
              value={form.contactPageSubjects}
              onChange={(e) => setForm({ ...form, contactPageSubjects: e.target.value })}
              rows={4}
              className="font-mono text-xs"
            />
          </div>
        </section>

        {/* Theme */}
        <section className="space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
            Default Theme
          </h2>
          <Select value={form.defaultTheme} onChange={(e) => setForm({ ...form, defaultTheme: e.target.value })}>
            <option value="stealth">Stealth Mode</option>
            <option value="neon">Neon Override</option>
            <option value="cleartext">Cleartext</option>
          </Select>
        </section>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          {saved && (
            <span className="text-sm text-[var(--accent)] font-mono">Settings saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}

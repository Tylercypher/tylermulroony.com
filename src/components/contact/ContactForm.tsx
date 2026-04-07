'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import SuccessAnimation from './SuccessAnimation';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Anti-spam honeypot
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessAnimation />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot - hidden from users */}
      <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-mono text-[var(--text-secondary)] mb-1.5">
          Name
        </label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1 font-mono">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-mono text-[var(--text-secondary)] mb-1.5">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 font-mono">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-mono text-[var(--text-secondary)] mb-1.5">
          Subject
        </label>
        <Select
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        >
          <option value="">Select a subject...</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Project Collaboration">Project Collaboration</option>
          <option value="Job Opportunity">Job Opportunity</option>
          <option value="Security Consultation">Security Consultation</option>
          <option value="Other">Other</option>
        </Select>
        {errors.subject && <p className="text-red-500 text-xs mt-1 font-mono">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-mono text-[var(--text-secondary)] mb-1.5">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Your message..."
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1 font-mono">{errors.message}</p>}
      </div>

      {serverError && (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-mono">
          {serverError}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Encrypting...' : 'Send Message'}
      </Button>
    </form>
  );
}

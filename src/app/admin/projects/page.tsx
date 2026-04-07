'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { slugify } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  techStack: string;
  thumbnailUrl: string | null;
  galleryUrls: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  published: boolean;
}

const defaultForm = {
  title: '',
  slug: '',
  shortDesc: '',
  fullDesc: '',
  category: '',
  techStack: '',
  thumbnailUrl: '',
  galleryUrls: '',
  githubUrl: '',
  demoUrl: '',
  featured: false,
  published: true,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const techStackArray = form.techStack.split(',').map((t) => t.trim()).filter(Boolean);
    const galleryArray = form.galleryUrls.split(',').map((u) => u.trim()).filter(Boolean);

    const body = {
      ...form,
      slug: form.slug || slugify(form.title),
      techStack: techStackArray,
      galleryUrls: galleryArray,
      thumbnailUrl: form.thumbnailUrl || null,
      githubUrl: form.githubUrl || null,
      demoUrl: form.demoUrl || null,
      ...(editingId ? { id: editingId } : {}),
    };

    const res = await fetch('/api/projects', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    const techStack = (() => {
      try { return JSON.parse(project.techStack).join(', '); } catch { return project.techStack; }
    })();
    const galleryUrls = (() => {
      try { return JSON.parse(project.galleryUrls || '[]').join(', '); } catch { return project.galleryUrls || ''; }
    })();

    setForm({
      title: project.title,
      slug: project.slug,
      shortDesc: project.shortDesc,
      fullDesc: project.fullDesc,
      category: project.category,
      techStack,
      thumbnailUrl: project.thumbnailUrl || '',
      galleryUrls,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      featured: project.featured,
      published: project.published,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)]">
          <span className="text-[var(--accent)]">&gt;</span> Projects
        </h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setForm(defaultForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Project list */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">Title</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden sm:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">
                  No projects yet
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-[var(--hover-glow)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {project.featured && <Star size={14} className="text-yellow-500" />}
                      <span className="font-mono text-sm text-[var(--text-primary)]">{project.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] hidden md:table-cell">
                    {project.category}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {project.published ? (
                      <span className="flex items-center gap-1 text-xs text-green-500 font-mono">
                        <Eye size={12} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-mono">
                        <EyeOff size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
        title={editingId ? 'Edit Project' : 'New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Short Description *</label>
            <Input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Full Description (HTML/Markdown) *</label>
            <Textarea
              value={form.fullDesc}
              onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
              rows={8}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Category *</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Tech Stack (comma-separated)</label>
              <Input
                value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="Python, React, AWS"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Thumbnail URL</label>
              <Input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">GitHub URL</label>
              <Input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Demo URL</label>
            <Input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-[var(--border-color)]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-[var(--border-color)]"
              />
              Published
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

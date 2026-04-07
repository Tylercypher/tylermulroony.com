'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { slugify, formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const defaultForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImageUrl: '',
  tags: '',
  published: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch('/api/blog');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

    const body = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: tagsArray,
      coverImageUrl: form.coverImageUrl || null,
      ...(editingId ? { id: editingId } : {}),
    };

    const res = await fetch('/api/blog', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      fetchPosts();
    }
  };

  const handleEdit = (post: BlogPost) => {
    const tags = (() => {
      try { return JSON.parse(post.tags).join(', '); } catch { return post.tags; }
    })();

    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl || '',
      tags,
      published: post.published,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)]">
          <span className="text-[var(--accent)]">&gt;</span> Blog Posts
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
          New Post
        </Button>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">Title</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden sm:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">Loading...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">No posts yet</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--hover-glow)]">
                  <td className="px-4 py-3 font-mono text-sm text-[var(--text-primary)]">{post.title}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] hidden md:table-cell">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.published ? (
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
                      <button onClick={() => handleEdit(post)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500" aria-label="Delete">
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

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); }}
        title={editingId ? 'Edit Post' : 'New Post'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Excerpt *</label>
            <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Content (MDX) *</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              required
              className="font-mono text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Tags (comma-separated)</label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="security, tutorial" />
            </div>
            <div>
              <label className="block text-sm font-mono text-[var(--text-secondary)] mb-1">Cover Image URL</label>
              <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)] cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit" variant="primary">{editingId ? 'Update' : 'Create'} Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

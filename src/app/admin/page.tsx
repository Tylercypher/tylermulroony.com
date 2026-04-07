export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { FolderOpen, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [projectCount, postCount, unreadCount, recentMessages] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const stats = [
    { label: 'Projects', value: projectCount, icon: FolderOpen, href: '/admin/projects' },
    { label: 'Blog Posts', value: postCount, icon: FileText, href: '/admin/blog' },
    { label: 'Unread Messages', value: unreadCount, icon: MessageSquare, href: '/admin/messages' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
        <span className="text-[var(--accent)]">&gt;</span> Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)] font-mono">{stat.label}</p>
                <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
              </div>
              <stat.icon size={32} className="text-[var(--accent)] opacity-50" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="font-mono font-semibold text-[var(--text-primary)]">Recent Messages</h2>
          <Link
            href="/admin/messages"
            className="text-sm text-[var(--accent)] hover:underline font-mono"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {recentMessages.length === 0 ? (
            <p className="p-4 text-sm text-[var(--text-muted)] font-mono">No messages yet.</p>
          ) : (
            recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    msg.read ? 'bg-[var(--text-muted)]' : 'bg-[var(--accent)]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-[var(--text-primary)]">
                      {msg.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{msg.subject}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] truncate">{msg.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{formatDate(msg.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

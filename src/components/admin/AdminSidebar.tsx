'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col">
      <div className="p-6 border-b border-[var(--border-color)]">
        <Link href="/" className="text-lg font-bold font-mono text-[var(--text-primary)]">
          <span className="text-[var(--accent)]">T.M</span> Admin
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors ${
                isActive
                  ? 'bg-[var(--accent-glow)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-glow)]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-[var(--text-muted)] hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

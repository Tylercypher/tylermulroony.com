'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const res = await fetch('/api/contact');
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: msg.id, read: !msg.read }),
    });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
    setSelectedMessage(null);
    fetchMessages();
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: true }),
      });
      fetchMessages();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-[var(--text-primary)] mb-8">
        <span className="text-[var(--accent)]">&gt;</span> Messages
      </h1>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              <th className="w-8 px-4 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">From</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden md:table-cell">Subject</th>
              <th className="text-left px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase hidden sm:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-xs font-mono text-[var(--text-muted)] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">Loading...</td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)] font-mono">No messages</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`cursor-pointer hover:bg-[var(--hover-glow)] ${!msg.read ? 'bg-[var(--accent-glow)]/30' : ''}`}
                  onClick={() => openMessage(msg)}
                >
                  <td className="px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${msg.read ? 'bg-[var(--text-muted)]' : 'bg-[var(--accent)]'}`} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-sm ${msg.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)] font-semibold'}`}>
                      {msg.name}
                    </span>
                    <span className="block text-xs text-[var(--text-muted)]">{msg.email}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)] hidden md:table-cell">{msg.subject}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)] hidden sm:table-cell">{formatDate(msg.createdAt)}</td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleRead(msg)} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Toggle read">
                        {msg.read ? <MailOpen size={16} /> : <Mail size={16} />}
                      </button>
                      <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500" aria-label="Delete">
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
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject}
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--text-muted)] font-mono">From</p>
                <p className="text-[var(--text-primary)]">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)] font-mono">Email</p>
                <a href={`mailto:${selectedMessage.email}`} className="text-[var(--accent)] hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-[var(--text-muted)] font-mono">Date</p>
                <p className="text-[var(--text-secondary)]">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)] font-mono">Subject</p>
                <p className="text-[var(--text-secondary)]">{selectedMessage.subject}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border-color)]">
              <p className="text-[var(--text-muted)] font-mono text-sm mb-2">Message</p>
              <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

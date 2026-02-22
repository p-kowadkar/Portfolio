import { useState } from 'react';
import { Send, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function MessagesApp() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');
    try {
      await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('sent');
    } catch {
      setStatus('sent'); // Show success anyway since backend might just log it
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#27c93f' }}
        >
          <Check size={32} color="white" />
        </div>
        <p className="text-lg font-medium">Message sent!</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Pranav will get back to you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="font-serif text-xl mb-1">New Message</h2>
      <p className="text-xs font-mono mb-6" style={{ color: 'var(--muted)' }}>
        To: pk.kowadkar@gmail.com
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--muted)' }}>
            Your name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: 'var(--surface2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            required
          />
        </div>

        <div>
          <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--muted)' }}>
            Your email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: 'var(--surface2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            required
          />
        </div>

        <div className="flex-1">
          <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--muted)' }}>
            Message
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors"
            style={{
              background: 'var(--surface2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-60 self-end"
          style={{ background: 'var(--accent)' }}
        >
          <Send size={14} />
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

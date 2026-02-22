import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ChatPKApp() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hey! I'm PK — Pranav's AI twin. Ask me anything about his work, projects, or experience.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: "Hmm, I couldn't connect right now. Try again in a sec?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="relative">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            pk
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: '#27c93f', borderColor: 'var(--bg)' }} />
        </div>
        <div>
          <span className="text-sm font-medium">ChatPK</span>
          <span className="text-[10px] font-mono ml-2" style={{ color: '#27c93f' }}>online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-serif text-[10px] font-bold shrink-0 mr-2 mt-1"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                pk
              </div>
            )}
            <div
              className="max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={{
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface2)',
                color: 'var(--text)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                borderBottomLeftRadius: msg.role === 'model' ? '4px' : undefined,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-serif text-[10px] font-bold shrink-0 mr-2 mt-1"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              pk
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ background: 'var(--surface2)', borderBottomLeftRadius: '4px' }}
            >
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask PK anything..."
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-colors"
          style={{
            background: 'var(--surface2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-full transition-colors disabled:opacity-40"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

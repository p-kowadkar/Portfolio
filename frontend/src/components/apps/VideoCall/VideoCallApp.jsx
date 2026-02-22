import { motion } from 'framer-motion';
import { PhoneOff } from 'lucide-react';
import { useState } from 'react';

export default function VideoCallApp() {
  const [toast, setToast] = useState(false);

  const handleEndCall = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-6 relative"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)
        `,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%',
      }}
    >
      {/* Pulsing ring + avatar */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--accent)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--accent)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-serif text-3xl font-bold"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #ff4757)',
            color: 'white',
          }}
        >
          PK
        </div>
      </div>

      <div className="text-center">
        <p className="font-medium text-lg mb-1">Digital Twin — Coming Soon</p>
        <p className="text-xs max-w-xs" style={{ color: 'var(--muted)' }}>
          An AI version of Pranav with real-time voice and vision. Check back soon.
        </p>
      </div>

      <button
        onClick={handleEndCall}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
        style={{ background: '#dc2626' }}
      >
        <PhoneOff size={16} />
        End Call
      </button>

      {/* Toast */}
      {toast && (
        <motion.div
          className="absolute bottom-6 px-4 py-2 rounded-lg text-xs font-mono"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Not live yet
        </motion.div>
      )}
    </div>
  );
}

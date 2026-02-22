import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Folder, MessageCircle, Video, Mail, Globe, Send } from 'lucide-react';

const dockItems = [
  { id: 'projects', label: 'Projects', icon: Folder, color: '#f97316' },
  { id: 'chat', label: 'ChatPK', icon: MessageCircle, color: '#E50914' },
  { id: 'videocall', label: 'Video Call', icon: Video, color: '#6366f1' },
  { id: 'messages', label: 'Messages', icon: Mail, color: '#22c55e' },
  { id: 'browser', label: 'Browser', icon: Globe, color: '#3b82f6' },
  { id: 'telegram', label: 'Telegram', icon: Send, color: '#0ea5e9' },
];

function DockIcon({ item, mouseX, onOpen, isActive }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 200;
    return val - rect.x - rect.width / 2;
  });

  const scale = useTransform(distance, [-120, 0, 120], [1, 1.3, 1]);
  const smoothScale = useSpring(scale, { mass: 0.1, stiffness: 200, damping: 15 });

  const handleClick = () => {
    if (item.id === 'telegram') {
      window.open('https://t.me/pk_kowadkar', '_blank');
      return;
    }
    onOpen(item.id);
  };

  return (
    <motion.button
      ref={ref}
      className="relative flex flex-col items-center group"
      style={{ scale: smoothScale }}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      title={item.label}
    >
      <div
        className="w-[52px] h-[52px] rounded-xl flex items-center justify-center transition-colors"
        style={{
          background: item.color,
        }}
      >
        <item.icon size={26} strokeWidth={1.5} color="white" />
      </div>
      {/* Tooltip */}
      <span className="absolute -top-8 px-2 py-1 rounded text-[11px] font-mono bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {item.label}
      </span>
      {/* Active dot */}
      {isActive && (
        <div
          className="absolute -bottom-1.5 w-1 h-1 rounded-full"
          style={{ background: 'var(--accent)' }}
        />
      )}
    </motion.button>
  );
}

export default function Dock({ onOpen, windows }) {
  const mouseX = useMotionValue(-200);

  const activeIds = (windows || [])
    .filter((w) => w.isOpen && !w.isMinimized)
    .map((w) => w.id);

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] flex items-end gap-3 px-3 py-2 rounded-2xl"
      style={{
        background: 'var(--dock-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
      }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(-200)}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
    >
      {dockItems.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          onOpen={onOpen}
          isActive={activeIds.includes(item.id)}
        />
      ))}
    </motion.div>
  );
}

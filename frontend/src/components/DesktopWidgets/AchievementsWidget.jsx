import { motion } from 'framer-motion';

const achievements = [
  { icon: '🏆', text: '1st Place — Pulse NYC Hackathon (Search Sentinel)' },
  { icon: '🏆', text: 'n8n Sponsor Prize — ElevenLabs Global Hackathon (EZ OnCall)' },
  { icon: '🎤', text: 'Speaker — LLM Day NYC · March 6, 2026' },
];

export default function AchievementsWidget() {
  return (
    <motion.div
      className="fixed top-4 right-4 z-[5] rounded-lg overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        maxWidth: '360px',
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="p-3 flex flex-col gap-2">
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2 font-mono text-[11px]"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.15 }}
          >
            <span className="shrink-0">{a.icon}</span>
            <span>{a.text}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

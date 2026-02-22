import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit → done
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if intro was already shown this session
    if (sessionStorage.getItem('pk_intro_shown')) {
      onComplete();
      return;
    }

    // Try to play sound
    const audio = new Audio('/sounds/intro.mp3');
    audioRef.current = audio;
    audio.play().catch(() => {}); // silently fail if no user interaction

    // Phase timing: enter(0) → hold(1s) → exit(1.2s later) → done(0.6s later)
    const holdTimer = setTimeout(() => setPhase('exit'), 1200);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('pk_intro_shown', 'true');
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={
              phase === 'exit'
                ? { scale: 1.5, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{
              duration: phase === 'exit' ? 0.6 : 0.8,
              ease: 'easeOut',
            }}
          >
            {/* Red glow behind */}
            <motion.div
              className="absolute inset-0 blur-[60px] rounded-full"
              style={{ background: 'var(--accent)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'exit' ? 0 : 0.3 }}
              transition={{ duration: 0.8 }}
            />
            <span
              className="relative italic text-white select-none"
              style={{ fontSize: '6rem', fontFamily: "'DM Serif Display', serif" }}
            >
              pk
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

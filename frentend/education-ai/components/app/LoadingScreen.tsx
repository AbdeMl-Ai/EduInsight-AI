'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

type LoadingScreenProps = {
  onComplete: () => void;
};

type AnimationPhase = 'icon' | 'reveal' | 'exit';

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<AnimationPhase>('icon');
  const hasCompleted = useRef(false);

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setPhase('reveal'), 500);
    const exitTimeout = window.setTimeout(() => setPhase('exit'), 2350);

    return () => {
      window.clearTimeout(revealTimeout);
      window.clearTimeout(exitTimeout);
    };
  }, []);

  function finishAnimation() {
    if (phase !== 'exit' || hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete();
  }

  return (
    <motion.div
      role="status"
      aria-label="Signing in to EduInsight AI"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      onAnimationComplete={finishAnimation}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute size-[min(70vw,560px)] rounded-full bg-[#c6a96b]/[0.035] blur-3xl"
      />
      <motion.div
        className="relative flex size-14 items-center justify-center text-[#d9bd7d]"
        animate={{ y: phase === 'icon' ? 0 : -45 }}
        transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
      >
        <GraduationCap size={48} strokeWidth={1.25} />
        <motion.span
          className="absolute top-[calc(100%+1.25rem)] whitespace-nowrap text-sm font-semibold tracking-[0.2em] text-[#d9bd7d] sm:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: phase === 'icon' ? 0 : 1,
            y: phase === 'icon' ? 12 : 0,
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          EDUINSIGHT AI
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

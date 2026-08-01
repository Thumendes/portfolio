// components/effects/DynamicWordField.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = [
  'TypeScript de ponta a ponta',
  'Next.js & React 19',
  'Node.js e Bun',
  'Prisma & Drizzle',
  'Filas com BullMQ e Redis',
  'Agentes de IA com Vercel AI SDK',
  'Expo & React Native',
  'Playwright & automação',
  'SaaS multi-tenant',
  'Streaming em tempo real',
];

const SLOTS: { top: string; left: string; size: string }[] = [
  { top: '18%', left: '6%', size: 'text-[15px] md:text-[18px]' },
  { top: '68%', left: '12%', size: 'text-[13px] md:text-[15px]' },
  { top: '12%', left: '42%', size: 'text-[17px] md:text-[21px]' },
  { top: '72%', left: '48%', size: 'text-[14px] md:text-[16px]' },
  { top: '30%', left: '72%', size: 'text-[15px] md:text-[18px]' },
  { top: '62%', left: '80%', size: 'text-[13px] md:text-[15px]' },
];

function WordSlot({
  slot,
  offset,
  interval,
}: {
  slot: (typeof SLOTS)[number];
  offset: number;
  interval: number;
}) {
  const [index, setIndex] = useState(offset % WORDS.length);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 max-w-[70%] md:max-w-[40%]"
      style={{ top: slot.top, left: slot.left }}
    >
      <AnimatePresence mode="wait">
        <motion.em
          key={index}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className={`font-display not-italic italic text-muted whitespace-nowrap ${slot.size}`}
        >
          {WORDS[index]}
        </motion.em>
      </AnimatePresence>
    </div>
  );
}

export function DynamicWordField() {
  return (
    <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden border-y border-border-muted">
      {/* Moving shadow blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-10 left-[10%] w-64 h-64 rounded-full bg-foreground/[0.06] blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 right-[15%] w-72 h-72 rounded-full bg-foreground/[0.05] blur-3xl"
        animate={{ x: [0, -30, 20, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-[40%] w-56 h-56 rounded-full bg-foreground/[0.05] blur-3xl"
        animate={{ x: [0, 20, -30, 0], y: [0, -25, 10, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />

      {SLOTS.map((slot, i) => (
        <WordSlot key={i} slot={slot} offset={i} interval={3200 + i * 400} />
      ))}
    </div>
  );
}

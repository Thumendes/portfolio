// components/effects/DynamicWordField.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
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
  'Monorepo com Turborepo',
  'APIs type-safe',
];

const SIZES = ['text-[13px] md:text-[15px]', 'text-[15px] md:text-[18px]', 'text-[17px] md:text-[21px]'];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickWord(exclude: string) {
  let next = exclude;
  while (next === exclude) {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  }
  return next;
}

interface Spot {
  word: string;
  top: number;
  left: number;
  size: string;
}

function makeSpot(band: number, bandWidth: number, prevWord = ''): Spot {
  // Keep words hugging the top/bottom edges so they don't collide with the
  // centered hero copy.
  const top = Math.random() < 0.5 ? randomBetween(4, 20) : randomBetween(80, 96);
  return {
    word: pickWord(prevWord),
    top,
    left: randomBetween(band * bandWidth + 2, (band + 1) * bandWidth - 2),
    size: SIZES[Math.floor(Math.random() * SIZES.length)],
  };
}

function FloatingWord({ band, bandWidth, initialDelay }: { band: number; bandWidth: number; initialDelay: number }) {
  const [spot, setSpot] = useState<Spot | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const start = setTimeout(() => {
      setSpot(makeSpot(band, bandWidth));
    }, initialDelay + randomBetween(0, 600));
    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!spot) return;
    timeoutRef.current = setTimeout(
      () => {
        setSpot((prev) => makeSpot(band, bandWidth, prev?.word));
      },
      randomBetween(2200, 4200),
    );
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot]);

  if (!spot) return null;

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 max-w-[75%] md:max-w-[38%] pointer-events-none ${
        band >= 4 ? 'hidden sm:block' : ''
      }`}
      style={{ top: `${spot.top}%`, left: `${spot.left}%` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={spot.word}
          initial={{ opacity: 0, filter: 'blur(11px)' }}
          animate={{ opacity: 1, filter: 'blur(1.5px)', transition: { duration: 1.1, ease: 'easeIn' } }}
          exit={{ opacity: 0, filter: 'blur(11px)', transition: { duration: 1, ease: 'easeOut' } }}
          className="block"
        >
          <motion.span
            animate={{ x: [0, 10, -8, 4, 0], y: [0, -6, 5, -3, 0] }}
            transition={{ duration: randomBetween(7, 11), repeat: Infinity, ease: 'easeInOut' }}
            className={`font-display font-medium text-muted whitespace-nowrap block ${spot.size}`}
          >
            {spot.word}
          </motion.span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const SLOT_COUNT = 6;

export function DynamicWordField() {
  const bandWidth = 100 / SLOT_COUNT;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <FloatingWord key={i} band={i} bandWidth={bandWidth} initialDelay={i * 450} />
      ))}
    </div>
  );
}

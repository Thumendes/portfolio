// components/effects/Terminal.tsx
'use client';

import { useEffect, useState } from 'react';

interface TerminalLine {
  text: string;
  type: 'command' | 'output';
}

const lines: TerminalLine[] = [
  { text: '$ bun run dev', type: 'command' },
  { text: '✓ web ready on :3007', type: 'output' },
  { text: '✓ worker ready', type: 'output' },
  { text: '$ git log --oneline -3', type: 'command' },
  { text: 'a3f1c2 feat: seat allocation', type: 'output' },
  { text: 'b9e0d1 fix: cielo webhook', type: 'output' },
  { text: 'c7a4e8 chore: bump prisma 7', type: 'output' },
];

const CHAR_DELAY = 35;
const LINE_DELAY = 400;
const INITIAL_DELAY = 1000;

export function Terminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), INITIAL_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    if (charIndex < line.text.length) {
      const t = setTimeout(() => {
        setCurrentLineText((prev) => prev + line.text[charIndex]);
        setCharIndex((c) => c + 1);
      }, CHAR_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.text]);
        setCurrentLineText('');
        setCharIndex(0);
        setLineIndex((i) => i + 1);
      }, LINE_DELAY);
      return () => clearTimeout(t);
    }
  }, [started, lineIndex, charIndex]);

  return (
    <div
      className="rounded-lg border border-[#1e293b] overflow-hidden text-[12px] font-mono w-full max-w-xs"
      style={{ background: '#0f172a' }}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1e293b]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[#475569] text-[10px]">~ thumendes</span>
      </div>

      <div className="p-3 space-y-0.5">
        {visibleLines.map((text, i) => {
          const isCommand = text.startsWith('$');
          return (
            <div
              key={i}
              style={{ color: isCommand ? '#22c55e' : '#e2e8f0' }}
            >
              {text}
            </div>
          );
        })}

        {lineIndex < lines.length && (
          <div
            style={{
              color: lines[lineIndex].type === 'command' ? '#22c55e' : '#e2e8f0',
            }}
          >
            {currentLineText}
            <span className="cursor-blink">▋</span>
          </div>
        )}

        {lineIndex >= lines.length && (
          <div style={{ color: '#22c55e' }}>
            $ <span className="cursor-blink">▋</span>
          </div>
        )}
      </div>
    </div>
  );
}

// components/ui/ResumeDropdown.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const resumes = [
  { label: 'Fullstack Dev Web', href: '/curriculo-arthur-dev-web.pdf' },
  { label: 'Automação & RPA', href: '/curriculo-arthur-automacao-rpa.pdf' },
  { label: 'Fullstack IA', href: '/curriculo-arthur-fullstack-ia.pdf' },
];

interface ResumeDropdownProps {
  className?: string;
}

export function ResumeDropdown({ className }: ResumeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer bg-accent text-white hover:bg-accent-dim border border-accent"
      >
        <IconDownload size={15} />
        Baixar currículo
        <IconChevronDown
          size={14}
          className={cn('transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 rounded-lg border border-border bg-background shadow-lg overflow-hidden"
          >
            {resumes.map((r) => (
              <a
                key={r.href}
                href={r.href}
                download
                onClick={() => setOpen(false)}
                role="menuitem"
                className="block px-4 py-2.5 text-[13px] font-body text-muted hover:text-foreground hover:bg-secondary transition-colors"
              >
                {r.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

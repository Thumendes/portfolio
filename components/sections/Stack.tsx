// components/sections/Stack.tsx
'use client';

import { motion } from 'framer-motion';
import { stack } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Stack() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Stack Principal</SectionLabel>

      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {stack.map((item, i) => (
          <motion.div
            key={item.abbr}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
            className="flex flex-col gap-2 p-3 rounded-xl border border-border-muted bg-background hover:bg-secondary transition-colors"
          >
            {/* Abbr icon */}
            <span
              data-badge={item.color}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-mono font-medium"
              style={{ background: 'var(--badge-bg)', color: 'var(--badge-fg)' }}
            >
              {item.abbr}
            </span>

            <div>
              <p className="text-[13px] font-medium font-body text-foreground leading-none">
                {item.name}
              </p>
              <p className="text-[11px] font-body text-subtle mt-1 truncate">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

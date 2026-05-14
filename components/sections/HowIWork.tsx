// components/sections/HowIWork.tsx
'use client';

import { motion } from 'framer-motion';
import { howIWork } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function HowIWork() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Como Trabalho</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {howIWork.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
            className="border-l-2 border-accent pl-4 py-1"
          >
            <h3 className="text-[14px] font-medium font-body text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-[13px] font-light font-body text-muted leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

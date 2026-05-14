// components/sections/Timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { IconSchool } from '@tabler/icons-react';
import { timeline, type ExperienceItem } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

function TimelineItem({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      className="relative pl-7"
    >
      {/* Dot */}
      <div
        className={cn(
          'absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center',
          item.active
            ? 'bg-accent border-accent'
            : 'bg-background border-border',
        )}
      >
        {item.active && (
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        )}
        {item.type === 'education' && !item.active && (
          <IconSchool size={8} className="text-muted" />
        )}
      </div>

      <div className="space-y-1 pb-8">
        <div className="flex flex-wrap items-baseline gap-2 justify-between">
          <h3 className="text-[15px] font-medium font-body text-foreground">
            {item.role}
          </h3>
          <span className="text-[12px] font-mono text-subtle flex-shrink-0">
            {item.period}
          </span>
        </div>

        <p className="text-[13px] font-body text-accent">{item.company}</p>

        <p className="text-[13px] font-light font-body text-muted leading-relaxed pt-1">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const workItems = timeline.filter((i) => i.type === 'work');
  const eduItems = timeline.filter((i) => i.type === 'education');

  return (
    <section id="experiencia" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Experiência</SectionLabel>

      {/* Work timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-8 w-px bg-border" />

        {workItems.map((item, i) => (
          <TimelineItem key={`${item.company}-${item.period}`} item={item} index={i} />
        ))}
      </div>

      {/* Education */}
      <div className="mt-4">
        <p className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-6">
          Formação
        </p>
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-8 w-px bg-border" />
          {eduItems.map((item, i) => (
            <TimelineItem
              key={`${item.company}-${item.period}`}
              item={item}
              index={workItems.length + i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

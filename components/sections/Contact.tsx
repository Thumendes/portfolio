// components/sections/Contact.tsx
'use client';

import { motion } from 'framer-motion';
import {
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandWhatsapp,
} from '@tabler/icons-react';
import { contact } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';

const iconMap: Record<string, React.ReactNode> = {
  'mail': <IconMail size={16} />,
  'brand-github': <IconBrandGithub size={16} />,
  'brand-linkedin': <IconBrandLinkedin size={16} />,
  'brand-whatsapp': <IconBrandWhatsapp size={16} />,
};

export function Contact() {
  return (
    <section id="contato" className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Contato</SectionLabel>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {contact.map((item, i) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: 'easeOut' }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-secondary transition-colors group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
              {iconMap[item.icon]}
            </div>
            <div>
              <p className="text-[11px] font-mono text-subtle leading-none mb-1">
                {item.label}
              </p>
              <p className="text-[13px] font-medium font-body text-foreground leading-none">
                {item.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-t border-border">
      <span className="text-[12px] font-mono text-subtle">
        // thumendes.com.br · 2026
      </span>
      <span className="text-[12px] font-mono text-subtle">
        BH · disponível para oportunidades
      </span>
    </footer>
  );
}

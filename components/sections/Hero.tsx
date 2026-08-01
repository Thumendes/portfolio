'use client';

import { motion } from 'framer-motion';
import { IconBrandGithub, IconMail } from '@tabler/icons-react';
import { LinkButton } from '@/components/ui/LinkButton';
import { ResumeDropdown } from '@/components/ui/ResumeDropdown';
import { DynamicWordField } from '@/components/effects/DynamicWordField';

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay },
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, delay },
});

export function Hero() {
  return (
    <section id="sobre" className="pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        <motion.p
          {...fadeLeft(0)}
          className="text-[12px] font-mono uppercase tracking-widest text-accent"
        >
          Desenvolvedor Full-Stack Sênior
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="font-display text-[52px] leading-[1.1] text-foreground"
        >
          Arthur
          <br />
          <em className="not-italic italic text-accent">Mendes</em>
        </motion.h1>

        <motion.p
          {...fade(0.3)}
          className="font-body font-light text-[16px] text-muted leading-relaxed max-w-md"
        >
          Construo sistemas complexos de ponta a ponta — APIs, workers assíncronos,
          pipelines de IA e interfaces que fazem sentido. Baseado em Belo Horizonte,
          trabalhando com times remotos há 4 anos.
        </motion.p>

        <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-3">
          <ResumeDropdown />
          <LinkButton variant="secondary" href="https://github.com/Thumendes">
            <IconBrandGithub size={15} />
            GitHub
          </LinkButton>
          <LinkButton variant="secondary" href="#contato">
            <IconMail size={15} />
            Contato
          </LinkButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12"
      >
        <DynamicWordField />
      </motion.div>
    </section>
  );
}

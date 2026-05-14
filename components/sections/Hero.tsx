'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  IconDownload,
  IconBrandGithub,
  IconMail,
  IconBriefcase,
  IconMapPin,
  IconSchool,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/Button';
import { PulsingDot } from '@/components/effects/PulsingDot';

const Terminal = dynamic(
  () => import('@/components/effects/Terminal').then((m) => ({ default: m.Terminal })),
  { ssr: false },
);

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

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, delay },
});

const pills = [
  {
    icon: <PulsingDot />,
    primary: 'Disponível',
    secondary: 'para oportunidades',
  },
  {
    icon: <IconBriefcase size={14} className="text-muted" />,
    primary: '4+',
    secondary: 'anos em produção',
  },
  {
    icon: <IconMapPin size={14} className="text-muted" />,
    primary: 'BH',
    secondary: 'híbrido / presencial',
  },
  {
    icon: <IconSchool size={14} className="text-muted" />,
    primary: 'PUC Minas',
    secondary: 'Eng. Software',
  },
];

export function Hero() {
  return (
    <section
      id="sobre"
      className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1fr_auto] gap-12 items-start"
    >
      {/* Left column */}
      <div className="space-y-6">
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
          <Button variant="primary" href="/curriculo.pdf">
            <IconDownload size={15} />
            Baixar currículo
          </Button>
          <Button
            variant="secondary"
            href="https://github.com/Thumendes"
          >
            <IconBrandGithub size={15} />
            GitHub
          </Button>
          <Button variant="secondary" href="#contato">
            <IconMail size={15} />
            Contato
          </Button>
        </motion.div>

        <motion.div {...fade(0.6)} className="pt-4">
          <Terminal />
        </motion.div>
      </div>

      {/* Right column — status pills */}
      <div className="flex flex-col gap-3 lg:pt-12">
        {pills.map((pill, i) => (
          <motion.div
            key={i}
            {...fadeRight(0.5 + i * 0.08)}
            className="flex items-center gap-3 px-4 py-3 rounded-full border border-border bg-background whitespace-nowrap"
          >
            <span className="flex-shrink-0">{pill.icon}</span>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium font-body text-foreground leading-none">
                {pill.primary}
              </span>
              <span className="text-[11px] font-mono text-subtle leading-none mt-0.5">
                {pill.secondary}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

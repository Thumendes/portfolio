// components/effects/TechMarquee.tsx
import { type CategoryColor } from '@/lib/data';

interface MarqueePhrase {
  text: string;
  color: CategoryColor;
}

const phrases: MarqueePhrase[] = [
  { text: 'TypeScript de ponta a ponta', color: 'blue' },
  { text: 'Next.js & React 19', color: 'cyan' },
  { text: 'Node.js e Bun', color: 'green' },
  { text: 'Prisma & Drizzle', color: 'amber' },
  { text: 'Filas com BullMQ e Redis', color: 'purple' },
  { text: 'Agentes de IA com Vercel AI SDK', color: 'pink' },
  { text: 'Expo & React Native', color: 'indigo' },
  { text: 'Playwright & automação', color: 'coral' },
  { text: 'SaaS multi-tenant', color: 'red' },
  { text: 'Streaming em tempo real', color: 'teal' },
];

function MarqueeTrack() {
  return (
    <div className="flex items-center gap-10 pr-10 flex-shrink-0">
      {phrases.map((p, i) => (
        <span key={i} className="flex items-center gap-3 flex-shrink-0">
          <span data-badge={p.color} className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--badge-solid)' }} />
          <em className="font-display not-italic italic text-[17px] md:text-[19px] text-muted whitespace-nowrap">
            {p.text}
          </em>
        </span>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-border-muted py-4"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}

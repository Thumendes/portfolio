// components/sections/ProjectDiagram.tsx
'use client';

import dynamic from 'next/dynamic';

const MermaidDiagram = dynamic(
  () => import('@/components/effects/MermaidDiagram').then((m) => ({ default: m.MermaidDiagram })),
  {
    ssr: false,
    loading: () => <div className="h-40 rounded-lg bg-secondary animate-pulse" />,
  },
);

export function ProjectDiagram({ chart }: { chart: string }) {
  return <MermaidDiagram chart={chart} />;
}

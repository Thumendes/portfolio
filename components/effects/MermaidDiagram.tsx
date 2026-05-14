// components/effects/MermaidDiagram.tsx
'use client';

import { useEffect, useId, useRef } from 'react';
import { useTheme } from 'next-themes';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const id = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        fontFamily: 'DM Mono, monospace',
        fontSize: 12,
      });

      if (ref.current && !cancelled) {
        try {
          const { svg } = await mermaid.render(id, chart);
          if (ref.current && !cancelled) {
            ref.current.innerHTML = svg;
          }
        } catch {
          // silently ignore mermaid parse errors in dev
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, resolvedTheme, id]);

  return (
    <div ref={ref} className="w-full overflow-x-auto [&_svg]:max-w-full" />
  );
}

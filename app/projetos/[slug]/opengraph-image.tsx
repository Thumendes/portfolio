// app/projetos/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { loadGoogleFont } from '@/lib/og-font';
import { projects } from '@/lib/data';

export const alt = 'Preview do projeto — thumendes.com.br';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  const title = project?.name ?? 'Projeto';
  const badge = project?.badge.label ?? '';
  const description = project?.description ?? '';
  const tags = project?.tags.slice(0, 5).join('   ·   ') ?? '';

  const [bold, mono] = await Promise.all([
    loadGoogleFont('Bricolage+Grotesque', 700, `${title} // thumendes`),
    loadGoogleFont('DM+Mono', 500, `${badge}${description}${tags}thumendes.com.br`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0a',
          color: '#fff',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Mono',
            fontSize: 24,
            letterSpacing: 2,
            color: '#71717a',
          }}
        >
          <span style={{ color: '#fff', fontFamily: 'Bricolage', fontWeight: 700 }}>{'//'}</span>
          &nbsp;thumendes
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 20 }}>
          {badge && (
            <div
              style={{
                display: 'flex',
                fontFamily: 'Mono',
                fontSize: 22,
                color: '#a1a1aa',
                border: '1px solid #3f3f46',
                borderRadius: 999,
                padding: '8px 20px',
                width: 'fit-content',
              }}
            >
              {badge}
            </div>
          )}
          <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 700, fontSize: 84, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: 26, color: '#a1a1aa', maxWidth: 980 }}>
            {description}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Mono', fontSize: 20, color: '#71717a' }}>
          <div style={{ display: 'flex' }}>{tags}</div>
          <div style={{ display: 'flex' }}>thumendes.com.br</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bricolage', data: bold, weight: 700, style: 'normal' },
        { name: 'Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );
}

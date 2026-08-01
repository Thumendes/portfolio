// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { getBricolageBold, getDMMonoMedium } from '@/lib/og-fonts';

export const alt = 'Arthur Mendes — Desenvolvedor Full-Stack Sênior';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const title = 'Arthur Mendes';
  const subtitle = 'DESENVOLVEDOR FULL-STACK SÊNIOR';
  const domain = 'thumendes.com.br';

  const [bold, mono] = await Promise.all([getBricolageBold(), getDMMonoMedium()]);

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

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontFamily: 'Bricolage', fontWeight: 700, fontSize: 104, lineHeight: 1.05 }}>
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Mono',
              fontSize: 28,
              letterSpacing: 6,
              color: '#a1a1aa',
              marginTop: 28,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: 22, color: '#71717a' }}>{domain}</div>
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

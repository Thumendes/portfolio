import type { Metadata } from 'next';
import { Bricolage_Grotesque, Outfit, DM_Mono, Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const displayFont = Bricolage_Grotesque({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display-grotesque',
  display: 'swap',
});

const outfit = Outfit({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thumendes.com.br'),
  title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
  description:
    'Desenvolvedor full-stack com 4+ anos de experiência. TypeScript, Next.js, Node.js, BullMQ, LLMs. Belo Horizonte, MG.',
  openGraph: {
    title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
    description: 'Construo sistemas complexos de ponta a ponta.',
    url: 'https://thumendes.com.br',
    siteName: 'thumendes.com.br',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
    description: 'Construo sistemas complexos de ponta a ponta.',
  },
};

function ConsoleEasterEgg() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          console.log('%c// thumendes.com.br', 'color:#2563EB;font-family:monospace;font-size:14px;font-weight:bold;');
          console.log('%cArthur Mendes — Desenvolvedor Full-Stack Sênior\\nthumendess@gmail.com\\ngithub.com/Thumendes', 'color:#6B7280;font-family:monospace;font-size:12px;');
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <ConsoleEasterEgg />
      </head>
      <body
        className={`${displayFont.variable} ${outfit.variable} ${dmMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}

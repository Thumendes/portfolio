# Portfolio thumendes.com.br — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal portfolio for Arthur Mendes Pereira using Next.js 15, Tailwind v4, Framer Motion, Radix UI Dialog, nuqs, and Mermaid — fully typed, dark-mode-aware, and animated.

**Architecture:** All content lives in `lib/data.ts` with strict TypeScript types; components are purely presentational. Modal state is driven by URL search params via `nuqs` (`?project=<id>`). Badge/stack colors are CSS custom properties set via `data-*` attributes so they work in Server Components with dark mode support.

**Tech Stack:** Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Framer Motion · @radix-ui/react-dialog · nuqs · next-themes · mermaid · @tabler/icons-react · clsx · tailwind-merge · Bun

---

## Task 1: Scaffold project and install dependencies

**Files:**
- Create: `package.json` (via create-next-app)
- Modify: `postcss.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Scaffold Next.js 15 app with Bun (no built-in Tailwind — we install v4 manually)**

```bash
cd /Users/thumendess/www/portfolio
bunx create-next-app@latest . \
  --typescript \
  --app \
  --no-tailwind \
  --no-src-dir \
  --import-alias "@/*" \
  --use-bun
```

Accept all prompts. When asked about `Would you like to use Tailwind CSS?`, answer **No** (or pass `--no-tailwind`).

- [ ] **Step 2: Install Tailwind v4 and all project dependencies**

```bash
bun add tailwindcss @tailwindcss/postcss
bun add framer-motion @radix-ui/react-dialog nuqs next-themes mermaid @tabler/icons-react clsx tailwind-merge
```

- [ ] **Step 3: Replace `postcss.config.mjs` with Tailwind v4 config**

```js
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

- [ ] **Step 4: Confirm TypeScript strict mode is on in `tsconfig.json`**

Open `tsconfig.json` and verify `"strict": true` is present under `compilerOptions`. It should be set by `create-next-app` — no change needed if present.

- [ ] **Step 5: Delete any auto-generated Tailwind config**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

- [ ] **Step 6: Verify the project compiles**

```bash
bunx tsc --noEmit
```

Expected: no errors (may show missing globals.css import warning — that's fine at this stage).

- [ ] **Step 7: Commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + install deps"
```

---

## Task 2: Global styles, CSS tokens, and Tailwind v4 configuration

**Files:**
- Create/Replace: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Write `app/globals.css` with Tailwind v4 import, dark mode variant, semantic tokens, and badge color variables**

```css
/* app/globals.css */
@import "tailwindcss";

/* Class-based dark mode for next-themes */
@custom-variant dark (&:where(.dark, .dark *));

/* Semantic color tokens — defined in :root and overridden in .dark */
:root {
  --background: #ffffff;
  --background-secondary: #f8fafc;
  --foreground: #0f172a;
  --muted: #64748b;
  --subtle: #94a3b8;
  --border-color: #e2e8f0;
  --border-muted-color: #f1f5f9;
}

.dark {
  --background: #09090b;
  --background-secondary: #18181b;
  --foreground: #fafafa;
  --muted: #a1a1aa;
  --subtle: #71717a;
  --border-color: #27272a;
  --border-muted-color: #3f3f46;
}

/* Tailwind theme — inline keeps var() references dynamic */
@theme inline {
  --color-background: var(--background);
  --color-secondary: var(--background-secondary);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-subtle: var(--subtle);
  --color-border: var(--border-color);
  --color-border-muted: var(--border-muted-color);
  --color-accent: #2563eb;
  --color-accent-dim: #1d4ed8;

  /* Font families — variables injected by next/font/google on <body> */
  --font-display: var(--font-dm-serif), serif;
  --font-body: var(--font-outfit), sans-serif;
  --font-mono: var(--font-dm-mono), monospace;
}

@layer base {
  body {
    font-family: var(--font-body);
    color: var(--foreground);
    background: var(--background);
    -webkit-font-smoothing: antialiased;
  }

  html {
    scroll-behavior: smooth;
  }
}

/* ── Badge color variables (data attribute approach, works in Server Components) ── */
[data-badge="blue"]   { --badge-bg: #E6F1FB; --badge-fg: #185FA5; }
[data-badge="amber"]  { --badge-bg: #FAEEDA; --badge-fg: #854F0B; }
[data-badge="coral"]  { --badge-bg: #FAECE7; --badge-fg: #993C1D; }
[data-badge="teal"]   { --badge-bg: #E1F5EE; --badge-fg: #0F6E56; }
[data-badge="green"]  { --badge-bg: #EAF3DE; --badge-fg: #3B6D11; }
[data-badge="purple"] { --badge-bg: #EEEDFE; --badge-fg: #534AB7; }

.dark [data-badge="blue"]   { --badge-bg: #1e3a5f; --badge-fg: #7cb9f0; }
.dark [data-badge="amber"]  { --badge-bg: #4a2c06; --badge-fg: #f5c97a; }
.dark [data-badge="coral"]  { --badge-bg: #4a1e0e; --badge-fg: #f59070; }
.dark [data-badge="teal"]   { --badge-bg: #0a3d30; --badge-fg: #5ecfad; }
.dark [data-badge="green"]  { --badge-bg: #1e3a08; --badge-fg: #90c95a; }
.dark [data-badge="purple"] { --badge-bg: #2a2660; --badge-fg: #a9a4f5; }

/* Terminal cursor blink */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
.cursor-blink { animation: blink 1s step-end infinite; }
```

- [ ] **Step 2: Create `lib/utils.ts`**

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css lib/utils.ts
git commit -m "chore: add Tailwind v4 config, semantic tokens, badge CSS vars"
```

---

## Task 3: `app/layout.tsx` — fonts, metadata, providers, and console easter egg

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the complete layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { DM_Serif_Display, Outfit, DM_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
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
  title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
  description:
    'Desenvolvedor full-stack com 4+ anos de experiência. TypeScript, Next.js, Node.js, BullMQ, LLMs. Belo Horizonte, MG.',
  openGraph: {
    title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
    description: 'Construo sistemas complexos de ponta a ponta.',
    url: 'https://thumendes.com.br',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ConsoleEasterEgg />
      </head>
      <body
        className={`${dmSerifDisplay.variable} ${outfit.variable} ${dmMono.variable}`}
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
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add layout with fonts, metadata, ThemeProvider, NuqsAdapter"
```

---

## Task 4: Data layer — `lib/data.ts`

**Files:**
- Create: `lib/data.ts`

This file contains every piece of content the portfolio displays. No component should contain hard-coded strings after this task.

- [ ] **Step 1: Write `lib/data.ts`**

```ts
// lib/data.ts

export type CategoryColor = 'blue' | 'amber' | 'coral' | 'teal' | 'green' | 'purple';

export interface ProjectData {
  id: string;
  name: string;
  badge: { label: string; color: CategoryColor };
  description: string;
  fullDescription: string[];
  highlights: string[];
  challenges: string[];
  learnings: string[];
  tags: string[];
  diagram: string;
  links: { github?: string; demo?: string };
  featured?: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  active: boolean;
  description: string;
  tags: string[];
  type: 'work' | 'education';
}

export interface StackItem {
  abbr: string;
  name: string;
  description: string;
  color: CategoryColor;
}

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface HowIWorkItem {
  title: string;
  description: string;
}

// ── Projects ────────────────────────────────────────────────────────────────

export const projects: ProjectData[] = [
  {
    id: 'abpf',
    name: 'ABPF',
    badge: { label: 'Plataforma · SaaS', color: 'blue' },
    featured: true,
    description:
      'Plataforma SaaS para associações de bandas filarmônicas com controle de membros, eventos e alocação inteligente de assentos.',
    fullDescription: [
      'ABPF é uma plataforma completa para gestão de associações de bandas filarmônicas. O sistema permite que cada associação gerencie seus membros por instrumento e realize eventos musicais com controle preciso de alocação de assentos.',
      'O núcleo técnico é um algoritmo proprietário de alocação que respeita restrições de instrumento, seção e proximidade entre músicos. O algoritmo roda de forma assíncrona via BullMQ, possibilitando recálculos sem bloquear a UI.',
      'Construído como monorepo Turborepo com 8 pacotes compartilhados — auth, db, email, ui, validators, config, workers e web — com isolamento completo entre tenants e integração com Cielo para pagamentos.',
    ],
    highlights: [
      'Algoritmo de alocação de assentos com restrições de instrumento e seção',
      'Multi-tenant com isolamento completo por associação via Prisma middleware',
      'Integração Cielo para pagamento de anuidades e ingressos de eventos',
      'Workers BullMQ para processamento assíncrono de recálculos de alocação',
      'Monorepo Turborepo com 8 pacotes — build incremental com cache remoto',
    ],
    challenges: [
      'Algoritmo de alocação com restrições aninhadas (instrumento → seção → fileira) sem conflito entre membros',
      'Isolamento de dados multi-tenant em banco único usando Prisma middleware transparente',
    ],
    learnings: [
      'Modelagem de domínio rico em TypeScript para regras de negócio complexas com invariantes',
      'Estratégias de multi-tenancy em SaaS single-database com Prisma e row-level isolation',
    ],
    tags: ['Next.js', 'Prisma', 'BullMQ', 'Redis', 'Cielo', 'Turborepo', 'MySQL'],
    diagram: `graph TD
    Client["Next.js Client"] --> API["App Router\\nAPI Routes"]
    API --> BullMQ["BullMQ\\nWorkers"]
    API --> Prisma["Prisma ORM"]
    BullMQ --> Redis[("Redis")]
    BullMQ --> Seats["Seat Allocation\\nAlgorithm"]
    Seats --> Prisma
    Prisma --> MySQL[("MySQL")]
    API --> Cielo["Cielo\\nPayments"]`,
    links: {},
  },
  {
    id: 'kaptha',
    name: 'Kaptha Agents',
    badge: { label: 'SaaS · Multi-tenant', color: 'purple' },
    description:
      'Plataforma multi-tenant de agentes de IA com streaming em tempo real, tool use e debounce inteligente de persistência.',
    fullDescription: [
      'Kaptha Agents permite que empresas criem e gerenciem agentes de IA customizados para seus clientes. Cada tenant tem agentes, ferramentas e histórico isolados.',
      'O sistema usa Vercel AI SDK com streaming SSE. Um middleware de debounce agrupa tokens antes de persistir no Redis, reduzindo escritas sem perder estado de conversa em caso de falha.',
    ],
    highlights: [],
    challenges: [
      'Streaming com debounce sem perder tokens entre flushes em caso de desconexão',
      'Isolamento de estado de agente entre múltiplos tenants em tempo real',
    ],
    learnings: [
      'Padrões de streaming com Vercel AI SDK e SSE no App Router do Next.js',
      'Debounce de escritas em Redis para balancear latência e durabilidade',
    ],
    tags: ['Next.js', 'Vercel AI SDK', 'Redis', 'BullMQ', 'Prisma', 'Multi-tenant'],
    diagram: `graph LR
    Client["Next.js\\nClient"] --> Stream["Streaming\\nAPI Route"]
    Stream --> Agent["AI Agent\\n(Vercel AI SDK)"]
    Agent --> LLM["Claude /\\nGPT-4o"]
    Agent --> Tools["Tool Use\\n(search, scrape)"]
    Stream --> Debounce["Debounce\\nMiddleware"]
    Debounce --> Redis[("Redis\\nCache")]`,
    links: {},
  },
  {
    id: 'claro-bot',
    name: 'Claro Bot Evo',
    badge: { label: 'Automação · IA', color: 'amber' },
    description:
      'Bot WhatsApp para a Claro Brasil com filtro inteligente de resultados via LLM para reduzir ruído nas respostas de atendimento.',
    fullDescription: [
      'Bot de automação para atendimento interno da Claro Brasil via WhatsApp. O diferencial é um pipeline de filtragem com LLM que avalia relevância das respostas antes de enviá-las.',
      'O sistema processa centenas de consultas simultâneas com filas BullMQ. O Claude classifica e filtra resultados em <200ms, garantindo que apenas respostas relevantes chegam ao usuário.',
    ],
    highlights: [],
    challenges: [
      'Filtrar resultados com LLM sem latência perceptível — cache semântico para queries repetidas',
      'Gerenciar estado de conversas longas com timeout e re-engajamento automático',
    ],
    learnings: [
      'Pipelines de validação LLM como middleware de qualidade, não como lógica principal',
      'Cache semântico com embeddings para reduzir chamadas à API em queries similares',
    ],
    tags: ['Node.js', 'BullMQ', 'Redis', 'Claude API', 'WhatsApp Business API', 'MariaDB'],
    diagram: `graph TD
    WA["WhatsApp\\nWebhook"] --> Engine["Bot Engine\\n(Node.js)"]
    Engine --> Queue["BullMQ\\nQueue"]
    Queue --> Filter["LLM Filter\\n(Claude)"]
    Filter --> Results["Filtered\\nResults"]
    Results --> Reply["Reply\\nHandler"]
    Reply --> WA
    Engine --> DB[("MariaDB")]`,
    links: {},
  },
  {
    id: 'locsystem',
    name: 'LocSystem',
    badge: { label: 'Android · IA', color: 'coral' },
    description:
      'App Android com detecção de objetos em tempo real via YOLO e OCR para leitura automática de placas em depósitos.',
    fullDescription: [
      'LocSystem automatiza a leitura de placas de localização em depósitos e armazéns. CameraX captura frames contínuos, YOLO v8 detecta placas e ML Kit OCR extrai o texto.',
      'O modelo YOLO roda on-device via TFLite com latência <200ms por frame, funcionando offline. Dados são sincronizados em batch quando há conectividade disponível.',
    ],
    highlights: [],
    challenges: [
      'Balancear frequência de inferência YOLO com consumo de bateria em uso prolongado',
      'OCR confiável em condições de iluminação variável e ângulos oblíquos de captura',
    ],
    learnings: [
      'Deploy de modelos TFLite com quantização INT8 para reduzir tamanho e aumentar throughput',
      'Pipeline de pré-processamento (crop, resize, normalização) para maximizar precisão do OCR',
    ],
    tags: ['Kotlin', 'TFLite', 'YOLO v8', 'ML Kit OCR', 'CameraX', 'Room DB'],
    diagram: `graph TD
    Camera["CameraX\\nCapture"] --> YOLO["YOLO v8\\n(TFLite on-device)"]
    YOLO --> Detect["Bounding Box\\nDetection"]
    Detect --> Crop["Image\\nCropping"]
    Crop --> OCR["ML Kit\\nOCR"]
    OCR --> Validate["Text\\nValidation"]
    Validate --> Room[("Room DB\\nLocal")]
    Room --> Sync["Batch\\nSync API"]`,
    links: {},
  },
  {
    id: 'gptexto',
    name: 'GPTexto',
    badge: { label: 'Editor Visual', color: 'teal' },
    description:
      'Editor visual no-code para criação de pipelines de geração de texto com IA, com 15+ tipos de nós e React Flow.',
    fullDescription: [
      'GPTexto permite criar pipelines de geração de texto arrastando e conectando nós. Cada nó tem uma responsabilidade: entrada, transformação, LLM, condicional ou saída.',
      'O executor de grafos usa topological sort para garantir ordem de execução correta em DAGs. Estado de execução é mantido em Zustand com React Flow, usando memoização agressiva para performance.',
    ],
    highlights: [],
    challenges: [
      'Execução de DAGs com dependências paralelas e tratamento de falhas em nós individuais',
      'Performance com React Flow em grafos de 50+ nós sem re-renders desnecessários',
    ],
    learnings: [
      'Algoritmo de topological sort para execução de pipelines com dependências paralelas',
      'Padrões de estado com Zustand + React Flow para minimizar re-renders em grafos complexos',
    ],
    tags: ['Next.js', 'React Flow', 'Vercel AI SDK', 'Zustand', 'TypeScript'],
    diagram: `graph LR
    Input["Input\\nNode"] --> Template["Template\\nNode"]
    Template --> AI["AI Node\\n(LLM call)"]
    AI --> Condition["Condition\\nNode"]
    Condition -->|true| Out1["Output\\nNode A"]
    Condition -->|false| Out2["Output\\nNode B"]
    AI --> Claude["Claude\\nAPI"]`,
    links: {},
  },
  {
    id: 'bro-energy',
    name: 'Bro Energy',
    badge: { label: 'Automação · Fintech', color: 'green' },
    description:
      'RPA para automação de coleta em portal de distribuidoras de energia com resolução de captcha e emissão automática de boletos.',
    fullDescription: [
      'Bro Energy automatiza o processo de coleta de dados de consumo e emissão de boletos em portais de distribuidoras de energia. Playwright navega nos portais, resolve captchas e extrai os dados.',
      'Crawlee gerencia filas de scraping com retry exponential backoff e rate limiting. Os boletos são gerados e enviados por email com Nodemailer após validação dos dados extraídos.',
    ],
    highlights: [],
    challenges: [
      'Resolver captchas variáveis entre distribuidoras de forma confiável e automatizada',
      'Manter sessão browser ativa em portais com timeout curto durante extrações longas',
    ],
    learnings: [
      'Estratégias de resiliência em scraping com retry, circuit breaker e session refresh',
      'Gerenciamento de contexto browser Playwright para operações de longa duração',
    ],
    tags: ['Node.js', 'Playwright', 'Crawlee', 'BullMQ', 'Redis', 'Nodemailer'],
    diagram: `graph TD
    Cron["Cron\\nScheduler"] --> Queue["BullMQ\\nQueue"]
    Queue --> RPA["Playwright\\nRPA"]
    RPA --> Captcha["Captcha\\nSolver"]
    Captcha --> Portal["Energy\\nPortal"]
    Portal --> Extract["Data\\nExtraction"]
    Extract --> Boleto["Boleto\\nGenerator"]
    Boleto --> Email["Nodemailer\\nDelivery"]`,
    links: {},
  },
];

// ── Stack ────────────────────────────────────────────────────────────────────

export const stack: StackItem[] = [
  { abbr: 'TS', name: 'TypeScript', description: 'strict mode, toda a stack', color: 'blue' },
  { abbr: 'Nx', name: 'Next.js / React', description: 'App Router, React 19', color: 'teal' },
  { abbr: 'No', name: 'Node.js / Bun', description: 'APIs, workers, CLIs', color: 'green' },
  { abbr: 'Pr', name: 'Prisma / Drizzle', description: 'MySQL, MariaDB', color: 'amber' },
  { abbr: 'BQ', name: 'BullMQ + Redis', description: 'filas assíncronas', color: 'purple' },
  { abbr: 'AI', name: 'LLMs / Vercel AI SDK', description: 'Claude, GPT, agentes', color: 'coral' },
  { abbr: 'Ex', name: 'Expo / React Native', description: 'apps mobile', color: 'blue' },
  { abbr: 'Pw', name: 'Playwright / Crawlee', description: 'automação e scraping', color: 'green' },
];

// ── Timeline ─────────────────────────────────────────────────────────────────

export const timeline: ExperienceItem[] = [
  {
    role: 'Desenvolvedor Full-Stack Sênior',
    company: 'Green Signal',
    period: 'set 2025 → presente',
    active: true,
    description:
      'Liderança técnica de produtos SaaS multi-tenant. Arquitetura de sistemas com Next.js, BullMQ e Prisma em monorepo Turborepo.',
    tags: ['Next.js', 'BullMQ', 'Prisma', 'Turborepo', 'MySQL'],
    type: 'work',
  },
  {
    role: 'Desenvolvedor Full-Stack',
    company: 'Kaptha Lead',
    period: 'nov 2025 → mar 2026',
    active: true,
    description:
      'Desenvolvimento da plataforma de agentes de IA multi-tenant com streaming em tempo real e Vercel AI SDK.',
    tags: ['Next.js', 'Vercel AI SDK', 'Redis', 'Multi-tenant'],
    type: 'work',
  },
  {
    role: 'Desenvolvedor Full-Stack Pleno',
    company: 'Green Signal',
    period: 'jan 2022 → set 2025',
    active: false,
    description:
      'Desenvolvimento de features em produtos SaaS B2B. Implementação de integrações com APIs de pagamento e pipelines de automação.',
    tags: ['React', 'Node.js', 'MySQL', 'Docker'],
    type: 'work',
  },
  {
    role: 'Desenvolvedor Full-Stack Júnior',
    company: 'Green Signal',
    period: 'jan 2021 → jan 2022',
    active: false,
    description:
      'Primeira experiência em produção com desenvolvimento web full-stack. Foco em manutenção, correção de bugs e pequenas features.',
    tags: ['React', 'Node.js', 'MySQL'],
    type: 'work',
  },
  {
    role: 'Analista de QA',
    company: 'Green Signal',
    period: 'set 2020 → jan 2021',
    active: false,
    description:
      'Testes manuais e automatizados. Criação de casos de teste, reporte de bugs e validação de deploys em ambiente de staging.',
    tags: ['QA', 'Selenium', 'Postman'],
    type: 'work',
  },
  {
    role: 'Engenharia de Software (em andamento)',
    company: 'PUC Minas',
    period: 'fev 2025 → presente',
    active: true,
    description:
      'Curso superior com foco em arquitetura de software, estruturas de dados, algoritmos e metodologias ágeis.',
    tags: ['Engenharia de Software'],
    type: 'education',
  },
  {
    role: 'Técnico em Informática',
    company: 'COTEMIG',
    period: '2018 → 2020',
    active: false,
    description:
      'Formação técnica com base em programação, redes e banco de dados. Projeto final: sistema de gestão escolar em Java.',
    tags: ['Java', 'Redes', 'Banco de Dados'],
    type: 'education',
  },
];

// ── Contact ──────────────────────────────────────────────────────────────────

export const contact: ContactItem[] = [
  {
    icon: 'mail',
    label: 'E-mail',
    value: 'thumendess@gmail.com',
    href: 'mailto:thumendess@gmail.com',
  },
  {
    icon: 'brand-github',
    label: 'GitHub',
    value: 'Thumendes',
    href: 'https://github.com/Thumendes',
  },
  {
    icon: 'brand-linkedin',
    label: 'LinkedIn',
    value: 'arthur-mendes-pereira-dev',
    href: 'https://linkedin.com/in/arthur-mendes-pereira-dev', // confirm slug before deploy
  },
  {
    icon: 'brand-whatsapp',
    label: 'WhatsApp',
    value: '(31) 98473-6688',
    href: 'https://wa.me/5531984736688',
  },
];

// ── How I Work ───────────────────────────────────────────────────────────────

export const howIWork: HowIWorkItem[] = [
  {
    title: 'Monorepo-first',
    description:
      'Turborepo + Bun como base. Pacotes compartilhados para auth, db e email. Build incremental com cache local e remoto.',
  },
  {
    title: 'Type-safe ponta a ponta',
    description:
      'oRPC ou tRPC do banco ao cliente. Zod para validação de fronteiras. Nunca um any em produção.',
  },
  {
    title: 'Async by default',
    description:
      'Workers BullMQ para tudo que pode ser assíncrono. SSE para updates em tempo real. Redis como cola entre serviços.',
  },
  {
    title: 'IA como ferramenta',
    description:
      'Vercel AI SDK com agentes, streaming e tool use. LLMs para filtrar, classificar e gerar — não para substituir lógica.',
  },
];
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add typed data layer — projects, stack, timeline, contact, howIWork"
```

---

## Task 5: UI primitive components

**Files:**
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Tag.tsx`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/SectionLabel.tsx`

- [ ] **Step 1: Create `components/ui/Badge.tsx`**

Uses `data-badge` attribute so CSS variables from `globals.css` apply without `useTheme`.

```tsx
// components/ui/Badge.tsx
import { type CategoryColor } from '@/lib/data';
import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  color: CategoryColor;
  className?: string;
}

export function Badge({ label, color, className }: BadgeProps) {
  return (
    <span
      data-badge={color}
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-mono font-medium leading-none',
        className,
      )}
      style={{ background: 'var(--badge-bg)', color: 'var(--badge-fg)' }}
    >
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create `components/ui/Tag.tsx`**

```tsx
// components/ui/Tag.tsx
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium',
        'bg-secondary text-muted border border-border-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create `components/ui/Button.tsx`**

```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary:  'bg-accent text-white hover:bg-accent-dim border border-accent',
  secondary:'bg-transparent text-foreground border border-border hover:bg-secondary',
  ghost:    'bg-transparent text-muted hover:text-foreground hover:bg-secondary border border-transparent',
};

const base =
  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer';

interface AnchorButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  href: string;
}

interface NativeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: never;
}

type ButtonProps = AnchorButtonProps | NativeButtonProps;

export function Button({ variant = 'secondary', className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if ('href' in props && props.href) {
    const { href, ...rest } = props as AnchorButtonProps;
    const isExternal = href.startsWith('http');
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as NativeButtonProps)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Create `components/ui/SectionLabel.tsx`**

```tsx
// components/ui/SectionLabel.tsx
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-[11px] font-mono font-medium uppercase tracking-[0.1em] text-subtle mb-6',
        className,
      )}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 5: Type-check all primitives**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/ui/
git commit -m "feat: add UI primitives — Badge, Tag, Button, SectionLabel"
```

---

## Task 6: Effect components — PulsingDot, Terminal, MermaidDiagram

**Files:**
- Create: `components/effects/PulsingDot.tsx`
- Create: `components/effects/Terminal.tsx`
- Create: `components/effects/MermaidDiagram.tsx`

- [ ] **Step 1: Create `components/effects/PulsingDot.tsx`**

```tsx
// components/effects/PulsingDot.tsx

export function PulsingDot() {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
    </span>
  );
}
```

- [ ] **Step 2: Create `components/effects/Terminal.tsx`**

```tsx
// components/effects/Terminal.tsx
'use client';

import { useEffect, useState } from 'react';

interface TerminalLine {
  text: string;
  type: 'command' | 'output';
}

const lines: TerminalLine[] = [
  { text: '$ bun run dev', type: 'command' },
  { text: '✓ web ready on :3007', type: 'output' },
  { text: '✓ worker ready', type: 'output' },
  { text: '$ git log --oneline -3', type: 'command' },
  { text: 'a3f1c2 feat: seat allocation', type: 'output' },
  { text: 'b9e0d1 fix: cielo webhook', type: 'output' },
  { text: 'c7a4e8 chore: bump prisma 7', type: 'output' },
];

const CHAR_DELAY = 35;
const LINE_DELAY = 400;
const INITIAL_DELAY = 1000;

export function Terminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), INITIAL_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    if (charIndex < line.text.length) {
      const t = setTimeout(() => {
        setCurrentLineText((prev) => prev + line.text[charIndex]);
        setCharIndex((c) => c + 1);
      }, CHAR_DELAY);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.text]);
        setCurrentLineText('');
        setCharIndex(0);
        setLineIndex((i) => i + 1);
      }, LINE_DELAY);
      return () => clearTimeout(t);
    }
  }, [started, lineIndex, charIndex]);

  return (
    <div
      className="rounded-lg border border-[#1e293b] overflow-hidden text-[12px] font-mono w-full max-w-xs"
      style={{ background: '#0f172a' }}
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1e293b]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[#475569] text-[10px]">~ thumendes</span>
      </div>

      <div className="p-3 space-y-0.5">
        {visibleLines.map((text, i) => {
          const isCommand = text.startsWith('$');
          return (
            <div
              key={i}
              style={{ color: isCommand ? '#22c55e' : '#e2e8f0' }}
            >
              {text}
            </div>
          );
        })}

        {lineIndex < lines.length && (
          <div
            style={{
              color: lines[lineIndex].type === 'command' ? '#22c55e' : '#e2e8f0',
            }}
          >
            {currentLineText}
            <span className="cursor-blink">▋</span>
          </div>
        )}

        {lineIndex >= lines.length && (
          <div style={{ color: '#22c55e' }}>
            $ <span className="cursor-blink">▋</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `components/effects/MermaidDiagram.tsx`**

This component is always imported via `dynamic(..., { ssr: false })`. The `useId` result contains colons which mermaid rejects as element IDs — we sanitize it.

```tsx
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
```

- [ ] **Step 4: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/effects/
git commit -m "feat: add effect components — PulsingDot, Terminal, MermaidDiagram"
```

---

## Task 7: Nav section

**Files:**
- Create: `components/sections/Nav.tsx`

- [ ] **Step 1: Create `components/sections/Nav.tsx`**

```tsx
// components/sections/Nav.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDownload, IconMenu2, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'sobre', href: '#sobre' },
  { label: 'projetos', href: '#projetos' },
  { label: 'experiência', href: '#experiencia' },
  { label: 'contato', href: '#contato' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 768) setDrawerOpen(false); };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#sobre" className="font-mono text-sm font-medium">
            <span className="text-accent">//</span>
            <span className="text-muted"> thumendes</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-body text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/curriculo.pdf"
              download
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-foreground transition-colors"
            >
              <IconDownload size={14} />
              currículo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-muted hover:text-foreground transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <IconMenu2 size={20} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-background border-l border-border flex flex-col p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-sm">
                  <span className="text-accent">//</span>
                  <span className="text-muted"> thumendes</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-muted hover:text-foreground"
                  aria-label="Fechar menu"
                >
                  <IconX size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="text-[15px] text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/curriculo.pdf"
                  download
                  className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-foreground mt-2"
                >
                  <IconDownload size={15} />
                  currículo
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Nav.tsx
git commit -m "feat: add Nav section — sticky blur, mobile drawer"
```

---

## Task 8: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Create `components/sections/Hero.tsx`**

```tsx
// components/sections/Hero.tsx
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
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: add Hero section — 2-col grid, stagger animations, status pills"
```

---

## Task 9: Stack and HowIWork sections

**Files:**
- Create: `components/sections/Stack.tsx`
- Create: `components/sections/HowIWork.tsx`

- [ ] **Step 1: Create `components/sections/Stack.tsx`**

```tsx
// components/sections/Stack.tsx
'use client';

import { motion } from 'framer-motion';
import { stack } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Stack() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Stack Principal</SectionLabel>

      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {stack.map((item, i) => (
          <motion.div
            key={item.abbr}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
            className="flex flex-col gap-2 p-3 rounded-xl border border-border-muted bg-background hover:bg-secondary transition-colors"
          >
            {/* Abbr icon */}
            <span
              data-badge={item.color}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-mono font-medium"
              style={{ background: 'var(--badge-bg)', color: 'var(--badge-fg)' }}
            >
              {item.abbr}
            </span>

            <div>
              <p className="text-[13px] font-medium font-body text-foreground leading-none">
                {item.name}
              </p>
              <p className="text-[11px] font-body text-subtle mt-1 truncate">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/sections/HowIWork.tsx`**

```tsx
// components/sections/HowIWork.tsx
'use client';

import { motion } from 'framer-motion';
import { howIWork } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function HowIWork() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <SectionLabel>Como Trabalho</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {howIWork.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
            className="border-l-2 border-accent pl-4 py-1"
          >
            <h3 className="text-[14px] font-medium font-body text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-[13px] font-light font-body text-muted leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Stack.tsx components/sections/HowIWork.tsx
git commit -m "feat: add Stack and HowIWork sections"
```

---

## Task 10: ProjectCard component

**Files:**
- Create: `components/sections/ProjectCard.tsx`

- [ ] **Step 1: Create `components/sections/ProjectCard.tsx`**

```tsx
// components/sections/ProjectCard.tsx
import { type ProjectData } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectData;
  onClick: () => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {
  if (project.featured) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'text-left w-full p-5 rounded-xl border border-border bg-background hover:bg-secondary transition-colors',
          'lg:col-span-2 grid lg:grid-cols-2 gap-6',
          className,
        )}
      >
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <Badge label={project.badge.label} color={project.badge.color} />
          <h3 className="text-[16px] font-medium font-body text-foreground">
            {project.name}
          </h3>
          <p className="text-[13px] font-light font-body text-muted leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* Right column — highlights */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-1">
            Destaques
          </p>
          {project.highlights.map((h, i) => (
            <div key={i} className="flex gap-2 text-[13px] font-light font-body text-muted">
              <span className="text-accent mt-px flex-shrink-0">–</span>
              <span>{h}</span>
            </div>
          ))}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left w-full p-5 rounded-xl border border-border bg-background hover:bg-secondary transition-colors flex flex-col gap-3',
        className,
      )}
    >
      <Badge label={project.badge.label} color={project.badge.color} />
      <h3 className="text-[16px] font-medium font-body text-foreground">
        {project.name}
      </h3>
      <p className="text-[13px] font-light font-body text-muted leading-relaxed flex-1">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ProjectCard.tsx
git commit -m "feat: add ProjectCard component — featured (2-col) and regular variants"
```

---

## Task 11: ProjectModal — Radix Dialog, nuqs navigation, Mermaid diagram

**Files:**
- Create: `components/sections/ProjectModal.tsx`

- [ ] **Step 1: Create `components/sections/ProjectModal.tsx`**

```tsx
// components/sections/ProjectModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react';
import { type ProjectData } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';

const MermaidDiagram = dynamic(
  () =>
    import('@/components/effects/MermaidDiagram').then((m) => ({
      default: m.MermaidDiagram,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 rounded-lg bg-secondary animate-pulse" />
    ),
  },
);

interface ProjectModalProps {
  project: ProjectData | null;
  projects: ProjectData[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function ProjectModal({
  project,
  projects,
  onClose,
  onNavigate,
}: ProjectModalProps) {
  const open = project !== null;
  const currentIndex = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-4 md:inset-8 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-4xl z-50 flex flex-col bg-background border border-border rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border flex-shrink-0">
                  <div className="space-y-2">
                    <Badge label={project.badge.label} color={project.badge.color} />
                    <Dialog.Title className="font-display text-[28px] leading-tight text-foreground">
                      {project.name}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <IconX size={18} />
                  </Dialog.Close>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid lg:grid-cols-[1fr_300px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
                    {/* Left: description */}
                    <div className="p-6 space-y-6">
                      <div className="space-y-3">
                        {project.fullDescription.map((para, i) => (
                          <p
                            key={i}
                            className="text-[14px] font-light font-body text-muted leading-relaxed"
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          Desafios técnicos
                        </h4>
                        <ul className="space-y-2">
                          {project.challenges.map((c, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-[13px] font-light font-body text-muted"
                            >
                              <span className="text-accent flex-shrink-0 mt-px">–</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          O que aprendi
                        </h4>
                        <ul className="space-y-2">
                          {project.learnings.map((l, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-[13px] font-light font-body text-muted"
                            >
                              <span className="text-accent flex-shrink-0 mt-px">→</span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: diagram + tags + links */}
                    <div className="p-6 space-y-5">
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          Arquitetura
                        </h4>
                        <MermaidDiagram chart={project.diagram} />
                      </div>

                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          Tecnologias
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                      </div>

                      {(project.links.github || project.links.demo) && (
                        <div className="flex gap-3">
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
                            >
                              <IconBrandGithub size={14} /> GitHub
                            </a>
                          )}
                          {project.links.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
                            >
                              <IconExternalLink size={14} /> Demo
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer nav */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
                  <button
                    onClick={() => prevProject && onNavigate(prevProject.id)}
                    disabled={!prevProject}
                    className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <IconChevronLeft size={14} />
                    {prevProject?.name ?? 'Anterior'}
                  </button>
                  <button
                    onClick={() => nextProject && onNavigate(nextProject.id)}
                    disabled={!nextProject}
                    className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {nextProject?.name ?? 'Próximo'}
                    <IconChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ProjectModal.tsx
git commit -m "feat: add ProjectModal — Radix Dialog, Framer Motion, Mermaid, prev/next nav"
```

---

## Task 12: Projects section

**Files:**
- Create: `components/sections/Projects.tsx`

- [ ] **Step 1: Create `components/sections/Projects.tsx`**

This is a client component because it calls `useQueryState` from nuqs.

```tsx
// components/sections/Projects.tsx
'use client';

import { motion } from 'framer-motion';
import { useQueryState } from 'nuqs';
import { projects } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [projectId, setProjectId] = useQueryState('project', {
    history: 'push',
    scroll: false,
  });

  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  return (
    <>
      <section id="projetos" className="max-w-5xl mx-auto px-6 py-16">
        <SectionLabel>Projetos</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={project.featured ? 'lg:col-span-2' : ''}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
            >
              <ProjectCard
                project={project}
                onClick={() => setProjectId(project.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        projects={projects}
        onClose={() => setProjectId(null)}
        onNavigate={(id) => setProjectId(id)}
      />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Projects.tsx
git commit -m "feat: add Projects section — grid with nuqs-driven modal"
```

---

## Task 13: Timeline section

**Files:**
- Create: `components/sections/Timeline.tsx`

- [ ] **Step 1: Create `components/sections/Timeline.tsx`**

```tsx
// components/sections/Timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { IconGraduationCap } from '@tabler/icons-react';
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
          <IconGraduationCap size={8} className="text-muted" />
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
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Timeline.tsx
git commit -m "feat: add Timeline section — work + education with animated dots"
```

---

## Task 14: Contact section and Footer

**Files:**
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Create `components/sections/Contact.tsx`**

This single file contains both the Contact section and the Footer.

```tsx
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
            target={item.href.startsWith('mailto') || item.href.startsWith('https://wa') ? undefined : '_blank'}
            rel="noopener noreferrer"
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
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: add Contact section and Footer"
```

---

## Task 15: Compose `app/page.tsx` and run production build

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
// app/page.tsx
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { Stack } from '@/components/sections/Stack';
import { HowIWork } from '@/components/sections/HowIWork';
import { Projects } from '@/components/sections/Projects';
import { Timeline } from '@/components/sections/Timeline';
import { Contact, Footer } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stack />
        <HowIWork />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Start dev server and do a visual pass**

```bash
bun run dev
```

Open `http://localhost:3000` and verify:
- Nav is sticky, blurs on scroll
- Hero renders with DM Serif Display name, stagger animations play
- Terminal types on load
- Stack grid renders with colored abbr icons
- "Como Trabalho" cards have left accent border
- Projects grid shows featured (full-width) + 5 regular cards
- Clicking a card opens modal with Mermaid diagram
- ESC and X close the modal; prev/next navigate
- Timeline shows work + education with active dots
- Contact cards are clickable
- Footer renders at the bottom
- Dark mode follows system preference

Fix any visual or layout issues before proceeding.

- [ ] **Step 3: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Production build**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors. Note any warnings.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose page.tsx — all sections wired up"
```

- [ ] **Step 6: Final commit with any fixes from visual pass**

```bash
git add -A
git commit -m "fix: visual polish from dev pass — layout, spacing, responsive"
```

---

## Post-build Checklist

Before considering this complete, verify each item in the browser at `http://localhost:3000`:

- [ ] Fonts load correctly (DM Serif Display on hero name, DM Mono on labels/tags)
- [ ] Dark mode works — toggle OS preference and verify all colors update
- [ ] Nav blur triggers after 80px scroll
- [ ] Mobile nav hamburger opens/closes drawer
- [ ] All Framer Motion animations play once on scroll (not on scroll-back)
- [ ] Modal opens with correct project, Mermaid diagram renders
- [ ] Modal prev/next navigation updates URL (`?project=...`)
- [ ] ESC closes modal
- [ ] Console shows easter egg (`// thumendes.com.br` in blue)
- [ ] Terminal animation plays after 1s delay
- [ ] `bun run build` produces zero errors

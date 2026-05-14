# Portfolio thumendes.com.br — Design Spec
**Date:** 2026-05-14  
**Status:** Approved for implementation

---

## Overview

Personal portfolio for Arthur Mendes Pereira, senior full-stack developer. Single-page experience with smooth anchor scrolling. Goal: communicate technical depth, professional experience, and projects to recruiters and other developers. Tone: technical-refined — sophisticated without being cold, personal without being informal.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR, metadata API, image optimization |
| Language | TypeScript strict | Compile-time safety everywhere |
| Styling | Tailwind CSS v4 | Native CSS vars, no PostCSS config |
| Animation | Framer Motion | whileInView, AnimatePresence, stagger |
| Modal primitive | @radix-ui/react-dialog | Accessible focus trap, ESC, aria-modal out-of-the-box |
| URL state | nuqs | Type-safe URL search params for modal projectId |
| Theme | next-themes (defaultTheme="system") | System preference, no toggle button |
| Diagrams | mermaid (dynamic import, ssr: false) | Client-only render, avoids SSR mismatch |
| Runtime / PM | Bun | Fast installs, native TS runner |

---

## Typography

| Role | Font | Weights | Usage |
|---|---|---|---|
| Display | DM Serif Display | 400 | Hero name, modal project name |
| Body | Outfit | 300, 400, 500 | All body copy |
| Mono | DM Mono | 400, 500 | Nav logo, labels, tags, dates, code |

Import via `next/font/google` in `app/layout.tsx`. CSS variables: `--font-display`, `--font-body`, `--font-mono`.

---

## Color System

```css
/* app/globals.css — @theme block */
@theme {
  --color-accent: #2563EB;
  --color-accent-dim: #1d4ed8;
}
```

All other colors use Tailwind's semantic tokens (`text-foreground`, `text-muted-foreground`, `bg-background`, `bg-secondary`, `border`) to support automatic dark mode via `next-themes`.

### Category badge color ramps

| Category | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| Platform / SaaS | `#E6F1FB` | `#185FA5` | `#1e3a5f` | `#7cb9f0` |
| Automation / AI | `#FAEEDA` | `#854F0B` | `#4a2c06` | `#f5c97a` |
| Mobile / Android | `#FAECE7` | `#993C1D` | `#4a1e0e` | `#f59070` |
| Visual Editor | `#E1F5EE` | `#0F6E56` | `#0a3d30` | `#5ecfad` |
| Fintech | `#EAF3DE` | `#3B6D11` | `#1e3a08` | `#90c95a` |
| Multi-tenant | `#EEEDFE` | `#534AB7` | `#2a2660` | `#a9a4f5` |

---

## Data Architecture

All content lives in `lib/data.ts` with strict TypeScript types. Components receive typed props only — no content logic in JSX.

### Key types

```ts
type CategoryColor = 'blue' | 'amber' | 'coral' | 'teal' | 'green' | 'purple';

interface ProjectData {
  id: string;
  name: string;
  badge: { label: string; color: CategoryColor };
  description: string;           // short, for card
  fullDescription: string[];     // paragraphs for modal
  highlights: string[];          // bullet points for featured card
  challenges: string[];          // modal: "Desafios técnicos"
  learnings: string[];           // modal: "O que aprendi"
  tags: string[];
  diagram: string;               // mermaid diagram source
  links: { github?: string; demo?: string };
  featured?: boolean;
}

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  active: boolean;
  description: string;
  tags: string[];
  type: 'work' | 'education';
}

interface StackItem {
  abbr: string;
  name: string;
  description: string;
  color: CategoryColor;
}

interface ContactItem {
  icon: string;           // tabler icon name
  label: string;
  value: string;
  href: string;
}
```

---

## Page Structure

Single route `/` in `app/page.tsx`. Sections mounted in order:

```
<Nav />
<Hero />          #sobre
<Stack />         #stack
<HowIWork />      (between Stack and Projects)
<Projects />      #projetos
<Timeline />      #experiencia
<Contact />       #contato
<Footer />
```

---

## Component Map

```
app/
  layout.tsx          fonts, metadata, ThemeProvider, NuqsAdapter, console easter egg
  page.tsx            composes all sections
  globals.css         @theme tokens, base styles

components/
  ui/
    Badge.tsx         pill with CategoryColor variant
    Tag.tsx           DM Mono 11px chip, bg-secondary
    Button.tsx        variant: 'primary' | 'secondary' | 'ghost'
    SectionLabel.tsx  DM Mono 11px uppercase, letter-spacing 0.1em

  sections/
    Nav.tsx           sticky, blur on scroll, mobile hamburger drawer
    Hero.tsx          2-col grid, stagger animations, status pills
    Stack.tsx         auto-fit grid, 8 cards with whileInView stagger
    HowIWork.tsx      2x2 grid, 4 principle cards
    Projects.tsx      featured + 5 cards, modal trigger via nuqs
    ProjectCard.tsx   clickable card, badge + tags + description
    ProjectModal.tsx  Radix Dialog + Framer Motion + Mermaid + prev/next nav
    Timeline.tsx      vertical timeline, work + education items
    Contact.tsx       4-card grid + footer

  effects/
    Terminal.tsx      char-by-char typing animation, fixed dark bg
    PulsingDot.tsx    green dot with animate-ping ring
    MermaidDiagram.tsx  dynamic import wrapper, client-only
```

---

## Section Specs

### Nav
- `position: sticky; top: 0; z-index: 50`
- On scroll > 80px: `bg-background/85 backdrop-blur-md border-b border-border/50`
- Logo: `// thumendes` — `//` in accent color, rest in muted. Font: DM Mono.
- Links: `sobre`, `projetos`, `experiência`, `contato` — Outfit 13px
- Curriculum button: `<Button variant="ghost">` with download icon
- Mobile: hamburger → custom drawer (fixed div + Framer Motion AnimatePresence slide-in) with same links. No Radix Sheet — only `@radix-ui/react-dialog` is installed.
- Entry animation: `opacity 0→1`, `y: -8→0`, 400ms on page load

### Hero
- Grid: `lg:grid-cols-[1fr_auto]`, single column on mobile
- Eyebrow: DM Mono 12px uppercase, accent color
- Name: DM Serif Display 52px, "Arthur" normal + line break + "Mendes" italic accent
- Bio: Outfit 300 16px, text-muted-foreground, 2–3 lines
- CTAs: "Baixar currículo" (primary), "GitHub" (secondary), "Contato" (secondary)
- Status pills: `rounded-full border border-border/50 bg-background px-4 py-2`
- Terminal component: positioned decoratively, below CTAs or aside
- Stagger entry: eyebrow → name → bio → CTAs → pills (see animation table)

### Stack
- Section label: `<SectionLabel>Stack Principal</SectionLabel>`
- Grid: `grid-cols-[repeat(auto-fit,minmax(160px,1fr))]` gap-2
- Card: abbr icon (28x28, rounded-md, semantic bg) + name (Outfit 500 13px) + description (Outfit 400 11px truncate)
- whileInView stagger 40ms, `opacity 0→1 y: 12→0`, once: true

### HowIWork
- Section label: "Como Trabalho"
- Grid: `grid-cols-1 md:grid-cols-2` gap-4
- Card: `border-l-2 border-accent pl-4`, title Outfit 500, body Outfit 300 14px
- 4 items: Monorepo-first, Type-safe ponta a ponta, Async by default, IA como ferramenta
- whileInView stagger 80ms

### Projects
- Section label: "Projetos"
- Grid: `grid-cols-1 lg:grid-cols-2` gap-4
- Featured card (ABPF): `lg:col-span-2`, internal 2-col grid (description left, highlights right)
- 5 regular cards: standard layout
- Click → `nuqs` sets `?project=<id>` → `<ProjectModal>` opens

### ProjectModal
- `@radix-ui/react-dialog` for accessibility
- Framer Motion `AnimatePresence` on overlay + card
- Overlay: `opacity 0→1` 200ms
- Card: `opacity 0→1, scale 0.96→1, y: 16→0` 300ms ease-out
- Two-column layout on desktop: description/challenges/learnings left, Mermaid diagram + tags + links right
- Footer: "← Projeto anterior" / "Próximo projeto →" — updates `?project=` param
- Close: X button, overlay click, ESC (handled by Radix)

### Timeline
- Vertical line: `absolute left-[7px] top-2 bottom-0 w-px bg-border`
- Active dot: `bg-accent border-accent` with white inner dot
- Inactive dot: `bg-background border-border`
- 5 work items + 2 education items
- Education section has graduation icon on dot
- whileInView stagger 100ms, `opacity 0→1 x: -16→0`, once: true

### Contact
- Grid: `grid-cols-[repeat(auto-fit,minmax(180px,1fr))]` gap-2
- Card: icon (32x32 bg-secondary rounded-md) + DM Mono label + Outfit 500 value
- Icons: Tabler Icons (`@tabler/icons-react`)
- 4 cards: email, GitHub, LinkedIn, WhatsApp

### Footer
- `flex justify-between border-t border-border/50 py-6`
- Left: `// thumendes.com.br · 2026` — DM Mono 12px text-muted-foreground
- Right: `BH · disponível para oportunidades` — DM Mono 12px text-muted-foreground

### Terminal (effects/Terminal.tsx)
- Fixed dark background `#0f172a` (intentional, does not follow theme)
- Lines typed char-by-char with configurable delay
- Commands in `#22c55e`, output in `#e2e8f0`
- Cursor: blinking `|` with CSS `animation: blink 1s step-end infinite`
- Font: DM Mono 12px
- Starts after 1s page load delay

---

## Animation Table

| Element | Trigger | Animation | Duration | Delay |
|---|---|---|---|---|
| Nav | page load | fade + y(-8→0) | 400ms | 0 |
| Hero eyebrow | page load | fade + x(-20→0) | 400ms | 0 |
| Hero name | page load | fade + y(20→0) | 600ms | 100ms |
| Hero bio | page load | fade | 400ms | 300ms |
| Hero CTAs | page load | fade + y(10→0) | 400ms | 450ms |
| Status pills | page load | fade + x(20→0), stagger 80ms | 400ms | 500ms |
| Stack cards | whileInView | fade + y(12→0), stagger 40ms | 400ms | — |
| HowIWork cards | whileInView | fade + y(8→0), stagger 80ms | 350ms | — |
| Project cards | whileInView | fade + scale(0.97→1), stagger 60ms | 350ms | — |
| Timeline items | whileInView | fade + x(-16→0), stagger 100ms | 400ms | — |
| Modal overlay | click | fade 0→1 | 200ms | — |
| Modal card | click | fade + scale(0.96→1) + y(16→0) | 300ms | — |
| Available dot | loop | ping ring | 1.5s infinite | — |
| Terminal | page load +1s | char-by-char | variable | 1000ms |

All `whileInView` use `viewport={{ once: true }}`.

---

## URL State (nuqs)

```ts
// In Projects.tsx (or a shared hook)
const [projectId, setProjectId] = useQueryState('project');

// Opening modal
setProjectId(project.id);

// Closing modal
setProjectId(null);

// Navigating prev/next
setProjectId(adjacentProject.id);
```

`NuqsAdapter` wraps the app in `layout.tsx`.

---

## SEO / Metadata

```ts
export const metadata: Metadata = {
  title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
  description: 'Desenvolvedor full-stack com 4+ anos de experiência. TypeScript, Next.js, Node.js, BullMQ, LLMs. Belo Horizonte, MG.',
  openGraph: {
    title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior',
    description: 'Construo sistemas complexos de ponta a ponta.',
    url: 'https://thumendes.com.br',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Arthur Mendes — Desenvolvedor Full-Stack Sênior' },
};
```

---

## Console Easter Egg

```ts
// app/layout.tsx — client component or useEffect
console.log('%c// thumendes.com.br', 'color:#2563EB;font-family:monospace;font-size:14px;font-weight:bold;');
console.log('%cArthur Mendes — Desenvolvedor Full-Stack Sênior\nthumendess@gmail.com\ngithub.com/Thumendes', 'color:#6B7280;font-family:monospace;font-size:12px;');
```

---

## Responsiveness

| Breakpoint | Change |
|---|---|
| `sm` 640px | Hero: single column, pills below text |
| `md` 768px | Projects: 1 column, featured loses inner grid |
| `lg` 1024px | Full layout as specified |

Nav mobile: hamburger opens a slide-in drawer (Radix Sheet or custom) with same links.  
Modal mobile: full-screen with internal scroll.

---

## Out of Scope (v1)

- `/uses` page
- Manual dark mode toggle button
- shadcn/ui
- CMS or MDX for content

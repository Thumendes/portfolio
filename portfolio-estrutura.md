# Portfólio — thumendes.com.br
## Documento de Estrutura e Especificação

---

## Visão Geral

Site portfólio pessoal de Arthur Mendes Pereira, desenvolvedor full-stack sênior. O objetivo do site é comunicar nível técnico, experiência profissional e projetos de forma clara e memorável para recrutadores e outros desenvolvedores. O tom é técnico-refinado: sofisticado sem ser frio, pessoal sem ser informal.

**Stack recomendada:** Next.js 15+ com App Router, Tailwind CSS v4, Framer Motion, TypeScript strict.

---

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | DM Serif Display | Nome na hero, títulos de seção em destaque |
| Body | Outfit (300, 400, 500) | Todo o corpo do site |
| Mono | DM Mono (400, 500) | Labels técnicos, tags, nav logo, datas, código |

Importar via Google Fonts. Nunca usar Inter, Roboto ou fontes de sistema como escolha principal.

---

## Paleta de Cores

Usar CSS variables para garantir suporte a dark mode automático.

```css
--accent: #2563EB;
--accent-dim: #1d4ed8;
```

Todas as demais cores devem usar as variáveis do sistema (`--color-text-primary`, `--color-background-secondary`, etc.) para compatibilidade com dark mode. Não hardcodar cores de texto ou fundo além do accent.

Badges e ícones de categoria usam ramps semânticas:

| Categoria | Cor |
|---|---|
| Plataforma / SaaS | Azul — `#E6F1FB` / `#185FA5` |
| Automação / IA | Âmbar — `#FAEEDA` / `#854F0B` |
| Mobile / Android | Coral — `#FAECE7` / `#993C1D` |
| Editor Visual | Teal — `#E1F5EE` / `#0F6E56` |
| Fintech | Verde — `#EAF3DE` / `#3B6D11` |
| Multi-tenant | Roxo — `#EEEDFE` / `#534AB7` |

---

## Estrutura de Páginas

```
/               → Página principal (single-page com âncoras)
/uses           → Setup pessoal (editor, terminal, extensões) — opcional
```

Toda a experiência é em página única com scroll suave entre seções. As rotas de âncora são: `#sobre`, `#stack`, `#projetos`, `#experiencia`, `#contato`.

---

## Seções — Especificação Detalhada

---

### 1. Navegação (`<nav>`)

**Layout:** flex, justify-between, sticky no topo com `backdrop-blur` sutil ao scrollar.

**Elementos:**
- Esquerda: logo em DM Mono — `// thumendes` com `//` na cor accent
- Direita: links de âncora em Outfit 13px — `sobre`, `projetos`, `experiência`, `contato`
- Botão "currículo" discreto com ícone de download ao lado dos links

**Comportamento:**
- Ao scrollar mais de 80px, adiciona `background: rgba(background-primary, 0.85)` + `backdrop-filter: blur(12px)` + `border-bottom: 0.5px solid border-tertiary`
- Link ativo (seção visível) recebe `color: text-primary` com transição suave
- Em mobile: menu hamburguer que abre drawer lateral com os mesmos links

**Animação:** fade-in de cima com `opacity: 0 → 1` + `translateY(-8px → 0)` em 400ms ao carregar a página.

---

### 2. Hero (`<section id="sobre">`)

**Layout:** grid de duas colunas — conteúdo principal à esquerda, pills de status à direita. Em mobile: coluna única, pills abaixo do texto.

**Coluna esquerda:**

```
[eyebrow]     — "Desenvolvedor Full-Stack Sênior" em DM Mono 12px uppercase accent
[nome]        — "Arthur" (normal) + quebra de linha + "Mendes" (itálico, cor accent)
              — DM Serif Display 52px, line-height 1.1
[bio]         — Parágrafo de 2-3 linhas, Outfit 300 16px, color text-secondary
[ctas]        — Botões: "Baixar currículo" (primário), "GitHub" (secundário), "Contato" (secundário)
```

**Coluna direita — Status Pills:**

Cards pill com `border-radius: 100px`, `border: 0.5px solid border-tertiary`, background primary.

| Pill | Conteúdo |
|---|---|
| Disponibilidade | Dot verde animado (pulse) + "Disponível" + "para oportunidades" |
| Experiência | "4+" + "anos em produção" |
| Localização | "BH" + "híbrido / presencial" |
| Formação | Ícone escola + "PUC Minas" + "Eng. Software" |

**Dot de disponibilidade:** dois elementos sobrepostos — o ponto interno sólido e um ring externo com `animation: ping 1.5s ease-in-out infinite` (estilo Tailwind `animate-ping`).

**Animações de entrada (Framer Motion):**
- Eyebrow: `opacity 0→1`, `x: -20→0`, delay 0ms
- Nome: `opacity 0→1`, `y: 20→0`, delay 100ms, duration 600ms
- Bio: `opacity 0→1`, delay 300ms
- CTAs: `opacity 0→1`, `y: 10→0`, delay 450ms
- Pills: stagger de 80ms entre cada um, `opacity 0→1`, `x: 20→0`

---

### 3. Stack Principal (`<section id="stack">`)

**Layout:** grid `repeat(auto-fit, minmax(160px, 1fr))`, gap 8px.

**Section label:** DM Mono 11px uppercase, `letter-spacing: 0.1em`, color text-tertiary. Padrão usado em todas as seções sem título grande.

**Card de stack:**
```
[ícone 28x28]  → border-radius 6px, background semântico, sigla em DM Mono 500
[nome]         → Outfit 500 13px
[descrição]    → Outfit 400 11px, color text-tertiary, truncado com ellipsis
```

**Itens do grid:**

| Sigla | Nome | Descrição | Cor |
|---|---|---|---|
| TS | TypeScript | strict mode, toda a stack | Azul |
| Nx | Next.js / React | App Router, React 19 | Teal |
| No | Node.js / Bun | APIs, workers, CLIs | Verde |
| Pr | Prisma / Drizzle | MySQL, MariaDB | Âmbar |
| BQ | BullMQ + Redis | filas assíncronas | Roxo |
| AI | LLMs / Vercel AI SDK | Claude, GPT, agentes | Coral |
| Ex | Expo / React Native | apps mobile | Azul |
| Pw | Playwright / Crawlee | automação e scraping | Verde |

**Animação:** ao entrar na viewport (Intersection Observer), cada card anima com stagger de 40ms — `opacity 0→1`, `y: 12→0`, duration 400ms, easing ease-out.

---

### 4. Projetos (`<section id="projetos">`)

**Layout:** grid de duas colunas. O card featured ocupa as duas colunas.

#### 4.1 Card Featured (ABPF)

Grid interno de duas colunas:
- Coluna esquerda: badge, nome, descrição, tags
- Coluna direita: lista de highlights com `–` como marcador

```
[badge]         → "Plataforma · SaaS" — pill azul
[nome]          → Outfit 500 16px
[descrição]     → Outfit 300 13px, color text-secondary
[tags]          → chips em DM Mono 11px, background secondary
---
[highlights]    → lista com 5 itens, ícone `–`, Outfit 300 13px
```

#### 4.2 Cards regulares

```
[badge]         → pill de categoria
[nome]          → Outfit 500 16px
[descrição]     → Outfit 300 13px, color text-secondary, flex: 1
[tags]          → chips DM Mono
```

**Projetos no grid:**

| Projeto | Badge | Destaque técnico |
|---|---|---|
| ABPF | Plataforma · SaaS (azul) | Featured — algoritmo de alocação de assentos |
| Kaptha Agents | SaaS · Multi-tenant (roxo) | Agente de IA com streaming e debounce |
| Claro Bot Evo | Automação · IA (âmbar) | Filtro de resultados com LLM |
| LocSystem | Android · IA (coral) | YOLO + OCR em tempo real |
| GPTexto | Editor Visual (teal) | 15+ tipos de nós, React Flow |
| Bro Energy | Automação · Fintech (verde) | RPA com captcha + emissão de boletos |

#### 4.3 Modal de Projeto

Ao clicar em qualquer card, abre um modal com overlay escuro (`rgba(0,0,0,0.6)` + blur).

**Estrutura do modal:**
```
[header]
  → badge de categoria
  → nome do projeto em DM Serif Display 28px
  → botão fechar (X) no canto

[corpo — duas colunas em desktop]
  Coluna esquerda:
    → Descrição completa (2-3 parágrafos)
    → Seção "Desafios técnicos" com 2-3 bullets
    → Seção "O que aprendi" com 1-2 bullets

  Coluna direita:
    → Diagrama de arquitetura simplificado (SVG estático)
      ou Cards de métricas (ex: "8 pacotes", "3 apps", "30+ routers")
    → Tags de tecnologia
    → Links (GitHub, demo — se houver)

[footer]
  → "Projeto anterior" / "Próximo projeto" para navegar sem fechar
```

**Animação do modal:**
- Overlay: `opacity 0→1`, duration 200ms
- Card: `opacity 0→1`, `scale: 0.96→1`, `y: 16→0`, duration 300ms, easing ease-out
- Fechar: reverso com duration 200ms
- Navegação entre projetos: slide horizontal suave

**Fechar modal:** clique no overlay, botão X, ou tecla `Escape`.

---

### 5. Experiência (`<section id="experiencia">`)

**Layout:** timeline vertical com linha pontilhada à esquerda.

**Linha da timeline:** `position: absolute`, `left: 7px`, `top: 8px`, `width: 1px`, `background: border-tertiary`.

**Item da timeline:**
```
[dot]           → 15x15px, border-radius 50%
                  → inativo: background primary, border 2px border-secondary
                  → ativo: background accent, border accent, ponto branco interno
[role]          → Outfit 500 15px, color text-primary
[company]       → Outfit 400 13px, color accent
[period]        → DM Mono 12px, color text-tertiary, margin-left auto
[descrição]     → Outfit 300 14px, line-height 1.6, color text-secondary
[tags]          → chips DM Mono 11px
```

**Itens:**

| Role | Empresa | Período | Status dot |
|---|---|---|---|
| Desenvolvedor Full-Stack Sênior | Green Signal | set 2025 → presente | Ativo |
| Desenvolvedor Full-Stack | Kaptha Lead | nov 2025 → mar 2026 | Ativo |
| Desenvolvedor Full-Stack Pleno | Green Signal | jan 2022 → set 2025 | Inativo |
| Desenvolvedor Full-Stack Júnior | Green Signal | jan 2021 → jan 2022 | Inativo |
| Analista de QA | Green Signal | set 2020 → jan 2021 | Inativo |

**Formação (abaixo da timeline):**

Mesma estrutura visual mas com ícone de graduação no dot.

| Curso | Instituição | Período |
|---|---|---|
| Engenharia de Software (em andamento) | PUC Minas | fev 2025 → presente |
| Técnico em Informática | COTEMIG | 2018 → 2020 |

**Animação:** cada item da timeline entra com `opacity 0→1` + `x: -16→0` conforme o scroll chega até ele (Intersection Observer, threshold 0.3). Stagger de 100ms entre items.

---

### 6. Easter Egg — Terminal na Hero

Componente visual (não funcional) que simula um terminal digitando comandos. Posicionado abaixo dos CTAs ou como elemento decorativo no canto da hero.

```
┌─────────────────────────────────┐
│  ~ thumendes                    │
│  $ bun run dev                  │
│  ✓ web ready on :3007           │
│  ✓ worker ready                 │
│  $ git log --oneline -3         │
│  a3f1c2 feat: seat allocation   │
│  b9e0d1 fix: cielo webhook      │
│  c7a4e8 chore: bump prisma 7    │
│  $  _                           │
└─────────────────────────────────┘
```

**Implementação:** array de linhas com delay entre cada uma. Cursor piscando com `animation: blink 1s step-end infinite`. Fonte DM Mono 12px. Background `#0f172a` (fixo — não segue dark mode, é intencional). Texto em verde `#22c55e` para comandos, branco para outputs.

---

### 7. Seção "Como Trabalho" (opcional)

Três ou quatro cards descrevendo princípios de trabalho. Posicionada entre Stack e Projetos.

**Cards sugeridos:**

```
[Monorepo-first]
Turborepo + Bun como base. Pacotes compartilhados para auth,
db e email. Build incremental e cache local e remoto.

[Type-safe ponta a ponta]
oRPC ou tRPC do banco ao cliente. Zod para validação de
fronteiras. Nunca um `any` em produção.

[Async by default]
Workers BullMQ para tudo que pode ser assíncrono. SSE para
updates em tempo real. Redis como cola entre serviços.

[IA como ferramenta]
Vercel AI SDK com agentes, streaming e tool use. LLMs para
filtrar, classificar e gerar — não para substituir lógica.
```

Layout: grid 2x2 em desktop, 1 coluna em mobile. Cards com border-left accent de 2px como detalhe.

---

### 8. Contato (`<section id="contato">`)

**Layout:** grid `repeat(auto-fit, minmax(180px, 1fr))`, gap 8px.

**Card de contato:**
```
[ícone 32x32]   → border-radius md, background secondary, ícone Tabler 16px
[label]         → DM Mono 11px, color text-tertiary
[valor]         → Outfit 500 13px, color text-primary
```

**Links:**

| Ícone | Label | Valor | Href |
|---|---|---|---|
| `ti-mail` | E-mail | thumendess@gmail.com | `mailto:` |
| `ti-brand-github` | GitHub | Thumendes | `https://github.com/Thumendes` |
| `ti-brand-linkedin` | LinkedIn | arthur-mendes-pereira-dev | `https://linkedin.com/in/...` |
| `ti-brand-whatsapp` | WhatsApp | (31) 98473-6688 | `https://wa.me/5531984736688` |

**Easter egg no console:**

Adicionar no `layout.tsx` ou `_app.tsx`:

```typescript
console.log(
  '%c// thumendes.com.br',
  'color: #2563EB; font-family: monospace; font-size: 14px; font-weight: bold;'
);
console.log(
  '%cArthur Mendes — Desenvolvedor Full-Stack Sênior\nthumendess@gmail.com\ngithub.com/Thumendes',
  'color: #6B7280; font-family: monospace; font-size: 12px;'
);
```

---

### 9. Footer

**Layout:** flex, justify-between, border-top 0.5px.

```
Esquerda: // thumendes.com.br · 2026    (DM Mono 12px, color text-tertiary)
Direita:  BH · disponível para oportunidades  (DM Mono 12px, color text-tertiary)
```

---

## Componentes Reutilizáveis

```
components/
  ui/
    Badge.tsx          → pill de categoria com variantes de cor
    Tag.tsx            → chip de tecnologia em DM Mono
    Button.tsx         → variantes primary / secondary
    SectionLabel.tsx   → label de seção em DM Mono uppercase
  sections/
    Nav.tsx
    Hero.tsx
    Stack.tsx
    Projects.tsx
    ProjectCard.tsx
    ProjectModal.tsx   → modal com overlay, navegação e diagrama
    Timeline.tsx
    TimelineItem.tsx
    Contact.tsx
    Footer.tsx
  effects/
    Terminal.tsx       → simulação de terminal digitando
    AnimatedCounter.tsx → contador numérico animado (0 → N)
    CursorDot.tsx      → cursor customizado com leve delay
```

---

## Animações — Resumo

| Elemento | Trigger | Animação | Duração |
|---|---|---|---|
| Nav | page load | fade + translateY(-8px) | 400ms |
| Hero eyebrow | page load | fade + translateX(-20px) | 400ms |
| Hero nome | page load | fade + translateY(20px) | 600ms, delay 100ms |
| Hero bio + CTAs | page load | fade, stagger 150ms | 400ms |
| Status pills | page load | fade + translateX(20px), stagger 80ms | 400ms |
| Stack cards | scroll (viewport) | fade + translateY(12px), stagger 40ms | 400ms |
| Project cards | scroll (viewport) | fade + scale(0.97), stagger 60ms | 350ms |
| Timeline items | scroll (viewport) | fade + translateX(-16px), stagger 100ms | 400ms |
| Modal abertura | click | fade overlay + scale(0.96→1) card | 300ms |
| Modal fechamento | click / ESC | reverso | 200ms |
| Dot disponível | loop | pulse ring externo | 1.5s infinite |
| Terminal | page load delay 1s | digitação caractere a caractere | variável |
| Contador anos | scroll (viewport) | 0 → 4, easing ease-out | 800ms |

Biblioteca recomendada: **Framer Motion**. Para animações de scroll usar `whileInView` com `viewport={{ once: true }}` para não repetir ao scrollar de volta.

---

## Responsividade

| Breakpoint | Mudanças principais |
|---|---|
| `sm` (640px) | Hero: coluna única, pills abaixo do texto |
| `md` (768px) | Projects: grid 1 coluna, featured sem grid interno |
| `lg` (1024px) | Layout completo conforme especificado |

Nav mobile: hamburger com drawer lateral. Modal mobile: full screen com scroll interno.

---

## SEO e Meta

```tsx
// app/layout.tsx ou pages/_app.tsx
export const metadata = {
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
```

---

## Prompt para o Claude Code

Copie e cole este prompt ao iniciar o projeto no Claude Code:

```
Crie um portfólio pessoal em Next.js 15 com App Router, Tailwind CSS v4, Framer Motion e TypeScript strict.

Tipografia: DM Serif Display (display), Outfit 300/400/500 (body), DM Mono 400/500 (mono) — importar via Google Fonts no layout.tsx.

Accent color: #2563EB. Todas as demais cores via CSS variables do Tailwind para dark mode automático.

Estrutura de seções em ordem:
1. Nav sticky com blur ao scroll, logo "// thumendes" em mono, links de âncora, botão currículo
2. Hero — grid 2 colunas: nome em DM Serif Display 52px com "Mendes" em itálico accent, bio em Outfit 300, 3 CTAs (currículo, GitHub, contato); coluna direita com 4 pills de status (disponível com dot pulse, 4+ anos, BH, PUC Minas)
3. Stack — section label em mono, grid auto-fit de cards com sigla colorida + nome + descrição (8 itens: TypeScript, Next.js, Node.js/Bun, Prisma/Drizzle, BullMQ+Redis, LLMs/Vercel AI SDK, Expo/React Native, Playwright/Crawlee)
4. Projetos — grid 2 colunas, card featured (ABPF, 2 colunas internas), 5 cards regulares (Kaptha, Claro Bot, LocSystem, GPTexto, Bro Energy); ao clicar em qualquer card abre modal com overlay, descrição completa, highlights e diagrama/métricas
5. Experiência — timeline vertical com dot accent para posições atuais, 5 itens de trabalho + 2 de formação
6. Contato — grid de 4 cards com ícone Tabler, label e valor
7. Footer simples

Animações com Framer Motion: stagger de entrada na hero (page load), cards com whileInView opacity+y, modal com scale+opacity, dot de disponibilidade com animate-ping. viewport={{ once: true }} em todos os whileInView.

Componentes em components/ui/ (Badge, Tag, Button, SectionLabel) e components/sections/ (uma pasta por seção). Modal em components/sections/ProjectModal.tsx com navegação entre projetos e fechamento por ESC.

Easter egg: console.log estilizado em layout.tsx com nome, cargo e contato.

Consulte o arquivo portfolio-estrutura.md na raiz do projeto para todos os detalhes de conteúdo, cores, animações e especificações de componentes.
```

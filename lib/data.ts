// lib/data.ts

export type CategoryColor =
  | 'red'
  | 'coral'
  | 'amber'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

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
    badge: { label: 'Plataforma · Turismo Ferroviário', color: 'blue' },
    featured: true,
    description:
      'Plataforma full-stack para a Associação Brasileira de Preservação Ferroviária: venda de ingressos com alocação automática de assentos, pagamentos, bilhetes em PDF com QR Code e excursões escolares.',
    fullDescription: [
      'ABPF é a plataforma de gestão de passeios de trem turístico da Associação Brasileira de Preservação Ferroviária. Cobre o ciclo completo: criação e configuração de passeios, venda de ingressos, processamento de pagamentos, emissão de bilhetes em PDF com QR Code, gestão de excursões escolares e check-in via app mobile.',
      'É um monorepo Turborepo com três aplicações — web (Next.js 16, dashboard admin + portal público), native (Expo/React Native para operadores e validadores) e worker (Bun + BullMQ para tarefas assíncronas) — e oito pacotes compartilhados, com uma API oRPC de cerca de 30 routers no centro do sistema.',
      'O núcleo técnico é o serviço de alocação de assentos, que aloca automaticamente passageiros em assentos contíguos respeitando blocos exclusivos (SeatGroup) e restrições de tipo de ingresso por vagão. Pagamentos rodam pela Cielo (cartão, PIX e boleto) com status sincronizado em tempo real via SSE, e bilhetes com QR Code assinado por HMAC são validados offline no check-in do app mobile.',
    ],
    highlights: [
      'Alocação automática de assentos contíguos respeitando SeatGroup e restrições por vagão',
      '~30 routers oRPC cobrindo passeios, pedidos, pagamentos, excursões e frota ferroviária',
      'Pagamentos Cielo (cartão parcelado, PIX e boleto) com status em tempo real via SSE',
      'App mobile Expo para operadores com check-in por QR Code assinado com HMAC',
      'Workers BullMQ geram PDFs de bilhetes e excursões escolares de forma assíncrona',
    ],
    challenges: [
      'Algoritmo de alocação de assentos contíguos com restrições aninhadas (SeatGroup → tipo de ingresso → vagão) sem conflito entre passageiros',
      'Sincronização de status de pagamento em tempo real entre webhook da Cielo, workers e clientes via SSE',
      'Geração de QR Code assinado com HMAC, validado offline no app mobile durante o check-in',
    ],
    learnings: [
      'Modelagem de domínio complexo em Prisma multi-arquivo, com soft-delete e filtragem automática via middleware',
      'Arquitetura de monorepo com oRPC compartilhando tipos de ponta a ponta entre web, mobile e workers',
    ],
    tags: ['Next.js 16', 'Expo', 'oRPC', 'Prisma 7', 'BullMQ', 'Cielo', 'Better-Auth', 'Turborepo'],
    diagram: `graph TD
    Web["Next.js Web\\n(admin + público)"] --> API["oRPC API\\n(~30 routers)"]
    Native["Expo App\\n(operadores)"] --> API
    API --> Seat["Seat Allocation\\nService"]
    API --> DB[("MySQL\\nPrisma")]
    API --> Queue["BullMQ\\nQueues"]
    Queue --> Worker["Bun Worker"]
    Worker --> Ticket["Ticket PDF\\n+ QR HMAC"]
    Worker --> R2[("Cloudflare R2")]
    API --> Cielo["Cielo\\nPagamentos"]
    API --> SSE["SSE\\npubsub"]`,
    links: {},
  },
  {
    id: 'kaptha',
    name: 'Kaptha Agents',
    badge: { label: 'SaaS · Multi-tenant', color: 'indigo' },
    description:
      'Plataforma SaaS multi-tenant para criar e operar assistentes de IA em canais de atendimento, com integração ao Chatwoot, debounce de mensagens e regras de comportamento automáticas.',
    fullDescription: [
      'Kaptha Agents é uma plataforma SaaS multi-tenant para criar, configurar e operar assistentes de IA em canais de atendimento ao cliente, com foco inicial em integração com o Chatwoot. Organizações criam assistentes com instruções personalizadas, publicam em canais Chatwoot e definem regras automáticas de comportamento — debounce, inatividade, encerramento e reativação.',
      'O sistema é monorepo Turborepo (apps/web em Next.js 16 com oRPC + TanStack Query, apps/server em Elysia) e é totalmente orientado a eventos: um webhook do Chatwoot chega, as mensagens são acumuladas com debounce, mídia é processada (Whisper para áudio, visão para imagens), um ToolLoopAgent do AI SDK v6 roda com Claude Sonnet via AI Gateway com as ferramentas do Chatwoot disponíveis, e a resposta é enviada de volta em streaming.',
      'Cada conversa vive como sessão no Redis com TTL, e workers BullMQ cuidam da resposta de IA, mensagens de inatividade, encerramento e resumo de conversas arquivadas. A configuração do assistente é separada de `assistant_version` (snapshot imutável publicado via deployment), permitindo rollback fiel sem afetar conversas ativas.',
    ],
    highlights: [
      'Sistema orientado a eventos: webhook Chatwoot → debounce → processamento de mídia → ToolLoopAgent → resposta em streaming',
      'ToolLoopAgent do AI SDK v6 com Claude Sonnet via AI Gateway e ferramentas Chatwoot sempre disponíveis',
      'Transcrição de áudio com Whisper e leitura de imagens via visão, com mídia persistida no Cloudflare R2',
      'Regras de comportamento configuráveis por assistente: debounce, inatividade, encerramento e reativação',
      'Snapshot imutável de versões com deployments — rollback sem afetar conversas em andamento',
    ],
    challenges: [
      'Debounce e acúmulo de mensagens em sessões Redis sem perder contexto entre mensagens fragmentadas do cliente',
      'Diferenciar mensagens do próprio bot das de atendentes humanos via botUserId, evitando loops e marcando sessões como transferidas corretamente',
      'Orquestrar workers BullMQ para resposta de IA, inatividade e encerramento sem condições de corrida entre jobs da mesma sessão',
    ],
    learnings: [
      'Arquitetura orientada a eventos com BullMQ para debounce, inatividade e encerramento de conversas de forma assíncrona',
      'oRPC + TanStack Query para uma API type-safe de ponta a ponta entre Next.js e Elysia',
    ],
    tags: ['Elysia', 'Next.js 16', 'oRPC', 'Drizzle', 'BullMQ', 'AI SDK v6', 'Chatwoot', 'Better Auth'],
    diagram: `graph TD
    Chatwoot["Chatwoot\\nWebhook"] --> Webhook["POST /webhooks/\\nchatwoot"]
    Webhook --> Session[("Redis\\nSession")]
    Webhook --> Debounce["Debounce\\n(BullMQ)"]
    Debounce --> Worker["ai-response\\nWorker"]
    Worker --> Media["Whisper /\\nVision"]
    Worker --> Agent["ToolLoopAgent\\n(AI SDK v6)"]
    Agent --> Claude["Claude Sonnet\\n(AI Gateway)"]
    Agent --> Tools["Chatwoot\\nTools"]
    Agent --> ChatwootOut["Chatwoot\\nreply"]`,
    links: {},
  },
  {
    id: 'claro-bot',
    name: 'Claro Bot Evo',
    badge: { label: 'Automação · IA', color: 'red' },
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
    badge: { label: 'Android · IA', color: 'pink' },
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
    badge: { label: 'Editor Visual', color: 'cyan' },
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
  { abbr: 'Nx', name: 'Next.js / React', description: 'App Router, React 19', color: 'cyan' },
  { abbr: 'No', name: 'Node.js / Bun', description: 'APIs, workers, CLIs', color: 'green' },
  { abbr: 'Pr', name: 'Prisma / Drizzle', description: 'MySQL, MariaDB', color: 'amber' },
  { abbr: 'BQ', name: 'BullMQ + Redis', description: 'filas assíncronas', color: 'purple' },
  { abbr: 'AI', name: 'LLMs / Vercel AI SDK', description: 'Claude, GPT, agentes', color: 'pink' },
  { abbr: 'Ex', name: 'Expo / React Native', description: 'apps mobile', color: 'indigo' },
  { abbr: 'Pw', name: 'Playwright / Crawlee', description: 'automação e scraping', color: 'coral' },
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
    value: 'thumendes',
    href: 'https://linkedin.com/in/thumendes',
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

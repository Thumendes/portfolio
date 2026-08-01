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
      'Bot de monitoramento automatizado de preços de concorrentes para a Claro — coleta preços de aparelhos e acessórios em grandes varejistas com scraping, filtro por LLM e notificação via WhatsApp.',
    fullDescription: [
      'Claro Bot Evo monitora periodicamente os preços de concorrentes da Claro em grandes varejistas online (Americanas, Magalu, Amazon, FastShop, iPlace) coletando valor à vista, a prazo e via Pix de aparelhos e acessórios, além de sinalizar produto sem estoque, link quebrado ou site em manutenção. Os dados alimentam a "API Matriz" da Claro para análise interna de posicionamento de preço.',
      'O bot opera em dois modos: caça-links busca novos links de produto e filtra os resultados com um LLM (GPT-4.1-mini) para evitar falsos positivos entre variações próximas de modelo; roda-links revisita links já cadastrados para atualizar preços. Construído com Crawlee + Playwright, com evasão anti-bot via stealth plugin, fingerprints aleatórios de browser e otimização de tráfego bloqueando recursos desnecessários.',
      'Cada varejista implementa uma interface comum (VarejoBotConfig) descoberta automaticamente via glob — adicionar um novo player é só criar o arquivo. Um servidor oRPC expõe start/subscribe via SSE para acompanhar execuções em tempo real, métricas são persistidas por rodada e um resumo é enviado por WhatsApp via Evolution API.',
    ],
    highlights: [
      'Dois modos de execução: caça de novos links de produto e atualização de preços de links já cadastrados',
      'Filtro de resultados de busca com LLM (GPT-4.1-mini) para evitar falsos positivos entre variações de modelo',
      'Evasão anti-bot com stealth plugin, fingerprints aleatórios e pool de sessões, sobre Crawlee + Playwright',
      'Servidor oRPC com stream SSE (start/subscribe) para acompanhar execuções em tempo real',
      'Métricas de execução persistidas por rodada e resumo enviado via WhatsApp (Evolution API)',
    ],
    challenges: [
      'Filtrar resultados de busca com LLM sem confundir variações próximas de modelo (ex: 128GB vs 256GB, Pro vs não-Pro)',
      'Evasão de bloqueio anti-bot em cinco varejistas diferentes, cada um com layout e proteções próprias',
      'Otimizar tráfego de rede bloqueando recursos supérfluos sem quebrar o parsing de preço em páginas de produto',
    ],
    learnings: [
      'Arquitetura plugin-based com auto-descoberta via glob para escalar o número de varejistas monitorados sem acoplamento',
      'Uso de LLM como camada de validação/filtro (generateObject), não como lógica de negócio principal',
    ],
    tags: ['Bun', 'Crawlee', 'Playwright', 'GPT-4.1-mini', 'oRPC', 'Zod', 'Arktype'],
    diagram: `graph TD
    Matriz[("API Matriz")] --> Bot["Bot\\n(Crawlee + Playwright)"]
    Bot --> Search["caça-links\\nbusca + filtro LLM"]
    Bot --> Update["roda-links\\nvisita direta"]
    Search --> Product["Scraping de\\nProduto"]
    Update --> Product
    Product --> Store["store()"]
    Store --> Matriz
    Store --> Evolution["Evolution API\\nWhatsApp"]`,
    links: {},
  },
  {
    id: 'locsystem',
    name: 'LocSystem',
    badge: { label: 'Android · IA', color: 'pink' },
    description:
      'App Android para localização de veículos inadimplentes em campo — detecção de placas em tempo real via YOLO + OCR, cruzamento com contratos e alerta imediato para a assessoria jurídica.',
    fullDescription: [
      'LocSystem é usado por agentes de campo de assessorias jurídicas e carteiras de crédito para localizar veículos com contratos em aberto durante rondas. A câmera captura frames, um modelo YOLO detecta placas, o OCR lê o texto e a placa é consultada num banco de contratos via API — se houver contrato ativo, o app toca um alerta, registra a incidência com foto e geolocalização e exibe os dados da assessoria com atalho direto para o WhatsApp.',
      'O pipeline roda a ~3 FPS com confidence threshold dinâmico (0.3–0.6, mais permissivo em cenas tranquilas e mais rígido em cenas movimentadas) e NMS para reduzir falsos positivos. Após o recorte e pré-processamento da placa, o OCR roda via ML Kit em thread separada, com debounce de 2s e validação por regex dos dois padrões de placa brasileira (antigo e Mercosul) antes de qualquer consulta.',
      'A arquitetura segue Clean Architecture com MVVM em Kotlin/Jetpack Compose: UI orientada a `UiState` selado (Idle/Loading/Success/Error) coletado via StateFlow, repositórios sobre Retrofit + DataStore, autenticação por cookie de sessão injetada globalmente via interceptor, e monitoramento de conectividade centralizado num ViewModel único.',
    ],
    highlights: [
      'Detecção de placas em tempo real com YOLO (TFLite) + OCR via ML Kit, throttle de ~3 FPS',
      'Confidence threshold dinâmico (0.3–0.6) e NMS para reduzir falsos positivos em cenas movimentadas',
      'Validação por regex dos dois padrões de placa brasileira (antigo e Mercosul) antes de qualquer consulta',
      'Registro automático de incidência com foto, geolocalização e cruzamento com contrato ativo',
      'Atalho direto para WhatsApp da assessoria jurídica responsável, com mensagem pré-formatada',
    ],
    challenges: [
      'Balancear confidence threshold e NMS dinamicamente para reduzir falsos positivos sem perder sensibilidade em cenas tranquilas',
      'Rodar detecção + OCR + consulta de API em tempo real sobre o stream da câmera sem travar a UI',
      'Monitoramento de conectividade centralizado para lidar com quedas de rede em campo sem quebrar o fluxo de detecção',
    ],
    learnings: [
      'Inferência TFLite on-device com pré-processamento (resize, normalização, NMS) otimizado para tempo real',
      'Clean Architecture + MVVM em Compose com UiState selado para gerenciar estados assíncronos de forma previsível',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'TensorFlow Lite', 'CameraX', 'ML Kit OCR', 'Retrofit'],
    diagram: `graph TD
    Camera["CameraX\\nImageAnalysis"] --> YOLO["YOLO\\n(TFLite)"]
    YOLO --> NMS["Threshold +\\nNMS"]
    NMS --> Crop["Crop +\\nPré-processamento"]
    Crop --> OCR["ML Kit\\nOCR"]
    OCR --> Validate["Regex\\nPlaca BR"]
    Validate --> Search["GET /api/search\\n/{plate}"]
    Search -->|encontrado| Alert["Alerta +\\nFoto + GPS"]
    Alert --> Incidence["POST /api/\\nincidence"]`,
    links: {},
  },
  {
    id: 'gptexto',
    name: 'GPTexto',
    badge: { label: 'Editor Visual', color: 'cyan' },
    description:
      'Plataforma SaaS multi-tenant de geração de conteúdo com IA — editor visual de fluxos com 15+ tipos de nós, processamento em lote via Kafka e publicação automática no WordPress.',
    fullDescription: [
      'GPTexto é uma plataforma SaaS multi-tenant onde empresas montam pipelines visuais de geração de conteúdo — grafos de nós que combinam chamadas a LLMs, geração de imagem, scraping, tradução e mais, produzindo artigos, posts, áudio, PDF ou publicações diretas no WordPress. Cada instância é isolada por hostname, com usuários, prompts, chaves de API e configuração visual próprios.',
      'O coração do sistema é o editor visual sobre React Flow, com mais de 15 tipos de nós — Prompt (LLM), Image Prompt (DALL-E, Leonardo AI, GetImg), Audio Generator (AWS Polly), Translate, HTTP, Scraping, PDF, WordPress, entre outros. O fluxo é serializado como JSON e percorrido em ordem topológica pelo executor, com versionamento (FlowVersion) e variáveis tipadas conectando a saída de um nó à entrada do próximo.',
      'É um monorepo Turborepo com Next.js 14 no frontend e serviços Node.js independentes — server (Express + tRPC), executor (roda os fluxos), queue (consumidor Kafka), scraping (Crawlee + Playwright) e files — comunicando via tRPC e Kafka sobre Prisma/MariaDB. O processamento em lote importa uma planilha de variáveis, publica jobs no Kafka e o executor roda o fluxo item a item, podendo publicar o resultado direto no WordPress configurado.',
    ],
    highlights: [
      'Editor visual de fluxos sobre React Flow com 15+ tipos de nós (LLM, imagem, áudio, scraping, PDF, WordPress...)',
      'Multi-tenant por hostname — cada projeto com usuários, prompts, chaves de API e ACL isolados',
      'Processamento em lote assíncrono via Kafka: planilha de variáveis → jobs → executor → publicação',
      'Versionamento de fluxos (FlowVersion) com ativação e restauração de versões anteriores',
      'Integrações com OpenAI, Leonardo AI, GetImg, AWS Polly, WordPress REST API e Asaas',
    ],
    challenges: [
      'Executar grafos de fluxo em ordem topológica com variáveis tipadas fluindo entre nós heterogêneos',
      'Isolamento multi-tenant completo por hostname em todas as entidades do banco, do JWT ao conteúdo gerado',
      'Orquestrar geração em lote de forma assíncrona (Kafka → executor) sem travar o painel admin em processos grandes',
    ],
    learnings: [
      'Arquitetura de monorepo com serviços independentes (server, executor, queue, scraping) comunicando via tRPC e Kafka',
      'Modelagem de multi-tenancy por hostname isolando dados, autenticação e ACL granular por projeto',
    ],
    tags: ['Next.js 14', 'React Flow', 'tRPC', 'Kafka', 'Prisma', 'Crawlee'],
    diagram: `graph TD
    Client["Next.js\\nClient + Admin"] --> Server["Express + tRPC\\nServer"]
    Server --> Executor["Executor\\n(Flow Engine)"]
    Server --> Files["Files\\n(S3, PDF, imagens)"]
    Server --> Scraping["Scraping\\n(Crawlee)"]
    Server -->|Kafka| Queue["Queue\\nConsumer"]
    Queue --> Executor
    Executor --> DB[("MariaDB\\nPrisma")]
    Executor --> WordPress["WordPress\\nREST API"]`,
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

# Auditoria de Segurança — ABPF

**Data:** 2026-05-14  
**Escopo:** Revisão completa do monorepo (web, native, worker, packages)  
**Metodologia:** Análise estática de código-fonte

---

## Sumário Executivo

Foram identificadas **2 vulnerabilidades críticas**, **5 altas**, **4 médias** e recomendações adicionais de hardening. As vulnerabilidades críticas permitem acesso não autorizado a dados de clientes e expõem credenciais de pagamento em logs de sistema.

---

## Tabela de Vulnerabilidades

| # | Severidade | Categoria | Arquivo | Linha(s) | Descrição |
|:--|:-----------|:----------|:--------|:---------|:----------|
| 1 | CRÍTICO | IDOR | `packages/api/src/routers/order.ts` | 527–661 | `order.getById` sem autenticação nem verificação de propriedade |
| 2 | CRÍTICO | Exposição de Dados | `packages/cielo/src/index.ts` | 73–222 | Credenciais e payloads de pagamento logados via `console.log` |
| 3 | ALTO | Criptografia | `packages/ticket/src/qrcode.ts` | 20, 99 | HMAC truncado a 16 caracteres (64 bits) |
| 4 | ALTO | Secrets | `packages/ticket/src/qrcode.ts` | 15, 95 | Secret HMAC com fallback hardcoded no código |
| 5 | ALTO | Autenticação | `packages/api/src/index.ts` | 9–27 | `protectedProcedure` não verifica campo `approved` do usuário |
| 6 | ALTO | IDOR | `packages/api/src/routers/excursion.ts` | 860+ | Excursões sem verificação de propriedade |
| 7 | ALTO | Rate Limiting | `packages/api/src/routers/auth.ts` | 36, 63 | Sem rate limiting em `register` e `forgetPassword` |
| 8 | MÉDIO | CSRF | Todos os routers | — | Sem proteção CSRF explícita |
| 9 | MÉDIO | Sessão | `packages/auth/src/index.ts` | 66 | Sem timeout de sessão configurado |
| 10 | MÉDIO | Exposição de Dados | `packages/api/src/routers/configuration.ts` | 126–143 | Endpoint de configuração pode vazar dados sensíveis |
| 11 | MÉDIO | Auditoria | Todos os routers | — | Sem audit log para operações críticas de pagamento |

---

## Vulnerabilidades Detalhadas

### CRÍTICO-1 — IDOR em `order.getById`

**Arquivo:** `packages/api/src/routers/order.ts:527`  
**CWE:** CWE-639 (Authorization Bypass Through User-Controlled Key)

O endpoint `order.getById` é declarado como `publicProcedure` e retorna dados sensíveis sem nenhuma verificação de autenticação ou propriedade, incluindo: nomes e documentos dos participantes, dados da transação Cielo (`cieloPaymentId`, `cieloTid`, `cieloAuthCode`, `cieloProofOfSale`), alocações de assento, e-mail e telefone do comprador.

Qualquer pessoa com um ID de pedido — que pode ser descoberto por enumeração ou vazamento de URL — consegue acessar dados completos de qualquer cliente.

**Solução:**

```typescript
// ANTES
getById: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const order = await db.order.findUnique({ where: { id: input.id } });
  return order;
});

// DEPOIS
getById: protectedProcedure.input(z.object({ id: z.string() })).handler(async ({ input, context }) => {
  const order = await db.order.findUnique({ where: { id: input.id } });
  if (!order) throw new ORPCError("NOT_FOUND");

  const isAdmin = context.session.user.role === "admin";
  if (!isAdmin && order.userId !== context.session.user.id) {
    throw new ORPCError("FORBIDDEN");
  }

  return order;
});
```

---

### CRÍTICO-2 — Credenciais e dados de pagamento nos logs

**Arquivo:** `packages/cielo/src/index.ts:73`  
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)

`MerchantKey` (chave secreta de API do Cielo) e payloads completos de pagamento são registrados via `console.log`. Isso viola PCI DSS e expõe credenciais em qualquer sistema de agregação de logs (Datadog, CloudWatch, etc.).

```typescript
// Linha 73-77: Loga credenciais de acesso
console.log("Cielo Client initialized with baseUrl:", {
  baseUrl,
  MerchantId,   // Sensível
  MerchantKey,  // CRÍTICO — chave secreta de API
});

// Linhas 101, 124, 147, 170: Loga payloads de pagamento
console.log(`💰 [CIELO] [CREDIT]: Payload`, sanitizedBody);
```

**Solução:** Remover todos os `console.log` com dados sensíveis. Caso logging seja necessário para debug, usar logging estruturado com allowlist de campos seguros, excluindo explicitamente `MerchantKey`, dados de cartão e documentos.

---

### ALTO-3 — HMAC do QR code truncado a 16 caracteres

**Arquivo:** `packages/ticket/src/qrcode.ts:20,99`  
**CWE:** CWE-327 (Use of a Broken or Risky Cryptographic Algorithm)

O digest SHA256 é truncado para apenas 16 caracteres hexadecimais (64 bits), reduzindo drasticamente a resistência a ataques de força bruta.

```typescript
// Linha 20: digest truncado
return hmac.digest("hex").substring(0, 16);
```

Com 64 bits de espaço de assinatura e hardware moderno (GPUs capazes de bilhões de tentativas HMAC por segundo), forjar QR codes válidos se torna computacionalmente viável.

**Solução:**

```typescript
// Usar o digest completo (256 bits / 64 caracteres hex)
return hmac.digest("hex");

// Ou, no mínimo, 32 caracteres (128 bits)
return hmac.digest("hex").substring(0, 32);
```

---

### ALTO-4 — Secret HMAC com fallback hardcoded

**Arquivo:** `packages/ticket/src/qrcode.ts:15,95`  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

```typescript
const secret = process.env.TICKET_HMAC_SECRET || "default-secret-change-me";
```

Se `TICKET_HMAC_SECRET` não estiver configurado no ambiente, o sistema utiliza um segredo hardcoded que é público no repositório. Qualquer pessoa com acesso ao código pode gerar assinaturas HMAC válidas e forjar QR codes de ingresso.

**Solução:**

```typescript
const secret = process.env.TICKET_HMAC_SECRET;
if (!secret) {
  throw new Error("TICKET_HMAC_SECRET environment variable is required");
}
```

---

### ALTO-5 — `protectedProcedure` não verifica `approved`

**Arquivo:** `packages/api/src/index.ts:9`  
**CWE:** CWE-285 (Improper Authorization)

O middleware `requireAuth` verifica apenas se a sessão existe, mas não valida o campo `approved` do usuário. Usuários cadastrados que ainda aguardam aprovação do administrador conseguem acessar todos os endpoints protegidos.

```typescript
// Middleware atual — sem verificação de approved
const requireAuth = o.middleware(async ({ context, next }) => {
  const session = context.session ?? (await auth.api.getSession({ headers: context.headers }));
  const user = session?.user;
  if (!user) throw new ORPCError("UNAUTHORIZED");
  // ❌ user.approved não é verificado
  return next({ context: { session: { ...session, user }, headers: context.headers } });
});
```

**Solução:**

```typescript
if (!user) throw new ORPCError("UNAUTHORIZED");
if (!user.approved) {
  throw new ORPCError("FORBIDDEN", { message: "Conta aguardando aprovação" });
}
```

---

### ALTO-6 — IDOR em operações de excursão

**Arquivo:** `packages/api/src/routers/excursion.ts:860`  
**CWE:** CWE-639 (Authorization Bypass Through User-Controlled Key)

Endpoints como `getById`, `confirm`, `cancel` e `complete` utilizam `protectedProcedure` mas não verificam se o usuário autenticado tem permissão sobre aquela excursão. Qualquer usuário autenticado pode operar sobre excursões de outros usuários.

**Solução:** Adicionar verificação de propriedade em cada operação sensível:

```typescript
const isAdmin = context.session.user.role === "admin";
if (!isAdmin && excursion.createdById !== context.session.user.id) {
  throw new ORPCError("FORBIDDEN");
}
```

---

### ALTO-7 — Sem rate limiting nos endpoints de autenticação

**Arquivo:** `packages/api/src/routers/auth.ts:36,63`  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

Os endpoints `register` e `forgetPassword` são `publicProcedure` sem qualquer controle de taxa, permitindo: spam de e-mails de reset de senha, enumeração de usuários cadastrados e ataques de força bruta.

**Solução com Upstash Ratelimit** (Redis já disponível no projeto):

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 tentativas por minuto por IP
  prefix: "abpf:auth",
});

// No handler
const ip = context.headers.get("x-forwarded-for") ?? "127.0.0.1";
const { success } = await authRatelimit.limit(ip);
if (!success) throw new ORPCError("TOO_MANY_REQUESTS");
```

---

### MÉDIO-8 — Sem proteção CSRF explícita

**CWE:** CWE-352 (Cross-Site Request Forgery)

A API não valida tokens CSRF. CORS e cookies `SameSite` oferecem proteção parcial, mas não protegem contra ataques via sub-domínios comprometidos ou em cenários onde `SameSite=None` é necessário.

**Solução:** Better-Auth suporta verificação de origem nativamente. Garantir que `trustedOrigins` esteja configurado restritivamente:

```typescript
export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN!],
  // ...
});
```

---

### MÉDIO-9 — Sem timeout de sessão configurado

**Arquivo:** `packages/auth/src/index.ts:66`  
**CWE:** CWE-613 (Insufficient Session Expiration)

O Better-Auth não tem `session.expiresIn` definido explicitamente, o que pode resultar em sessões com vida útil excessivamente longa.

**Solução:**

```typescript
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 dias
    updateAge: 60 * 60 * 24,        // Renovar se mais de 1 dia desde último acesso
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,               // Cache de 5 minutos
    },
  },
  // ...
});
```

---

### MÉDIO-10 — Endpoint de configuração pode vazar dados

**Arquivo:** `packages/api/src/routers/configuration.ts:126`  
**CWE:** CWE-200 (Exposure of Sensitive Information)

O endpoint `getByKey` retorna o valor completo de qualquer configuração marcada como `isPublic: true`. Um erro operacional de marcar uma configuração sensível como pública expõe esses dados sem nenhuma camada de proteção adicional.

**Solução:** Implementar allowlist de chaves que podem ser públicas, e/ou mascarar valores retornados com base no tipo da configuração.

---

### MÉDIO-11 — Sem audit log para operações críticas

**CWE:** CWE-778 (Insufficient Logging)

Operações críticas como processamento de pagamentos, confirmação de pedidos e check-in de passageiros não produzem registros de auditoria. O `appendExcursionHistory` em excursões é uma exceção positiva, mas o padrão não é aplicado consistentemente.

**Solução:** Implementar logging de auditoria centralizado para todas as operações financeiras e de gestão de acesso.

---

## Recomendações de Hardening

### 2FA para Administradores

Better-Auth suporta TOTP nativamente via plugin:

```typescript
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "ABPF",
      totpOptions: { period: 30, digits: 6 },
    }),
    admin({ ac, roles: { admin: adminRole, user: userRole } }),
    // ...
  ],
});
```

No middleware, exigir 2FA para usuários com role `admin`:

```typescript
if (user.role === "admin" && !session.twoFactorVerified) {
  throw new ORPCError("FORBIDDEN", { message: "2FA obrigatório para administradores" });
}
```

---

### Rate Limiting Global (Next.js Middleware)

```typescript
// apps/web/src/middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  prefix: "abpf:global",
});

export async function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(Math.round((reset - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
```

---

### Security Headers (Next.js)

```typescript
// next.config.ts
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",  // ajustar conforme necessário
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## Plano de Ação

### Imediato (próximas 48h)

- [ ] Converter `order.getById` para `protectedProcedure` com verificação de propriedade
- [ ] Remover `console.log` com `MerchantKey` e payloads de pagamento em `cielo/src/index.ts`
- [ ] Remover fallback hardcoded do `TICKET_HMAC_SECRET` — lançar erro se ausente
- [ ] Aumentar HMAC de 16 para 64 caracteres (digest completo)

### Esta semana

- [ ] Adicionar verificação de `user.approved` no middleware `protectedProcedure`
- [ ] Implementar rate limiting nos endpoints `register` e `forgetPassword`
- [ ] Configurar `session.expiresIn` no Better-Auth
- [ ] Adicionar verificação de propriedade nas operações de excursão

### Próximo sprint

- [ ] Implementar 2FA (TOTP) para usuários administradores
- [ ] Adicionar rate limiting global no Next.js middleware
- [ ] Configurar security headers no `next.config.ts`
- [ ] Revisar e restringir quais configurações podem ser marcadas como públicas

### Backlog

- [ ] Implementar audit logging centralizado para operações financeiras e de acesso
- [ ] Adicionar proteção CSRF explícita
- [ ] Substituir `console.log` por logging estruturado (evlog ou equivalente)
- [ ] Revisão periódica OWASP Top 10

---

*Documento gerado em 2026-05-14. Revisar após cada sprint de segurança.*

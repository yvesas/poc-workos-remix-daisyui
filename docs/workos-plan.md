# Plano de Implantação WorkOS (AuthKit Remix)

Objetivo
- Integrar autenticação WorkOS via AuthKit com fluxo hospedado (sign-in), callback, sessão e logout.

Dependências
- `@workos-inc/authkit-remix` (helpers de sessão/fluxo para Remix)
- `@workos-inc/node` (já presente)

Variáveis de ambiente
- `WORKOS_CLIENT_ID=client_...`
- `WORKOS_API_KEY=sk_...`
- `WORKOS_REDIRECT_URI=http://localhost:3000/callback`
- `WORKOS_COOKIE_PASSWORD=<>=32 chars, forte>`

Arquitetura (fase 1)
- Rotas:
  - `GET /callback` → `authLoader({ returnPathname: '/home' })`
  - `GET /auth/login` → redireciona para URL de login (fase 2) ou usar `signInUrl` do loader
- Loader público:
  - Em `_public._index.tsx`, usar `authkitLoader` para obter `{ user, signInUrl }` e renderizar botão “Entrar com WorkOS”.
- Sessão privada (temporária):
  - Manter `requireUser` atual (mock) até fase 2; rotas privadas seguem funcionando.

Arquitetura (fase 2)
- Substituir `requireUser` por leitura da sessão do AuthKit.
- Proteger rotas privadas com sessão do WorkOS.
- Implementar logout (limpar cookie de sessão e redirecionar). 

Segurança
- Cookies `HttpOnly`, `SameSite=Lax`, `Secure` em produção.
- Senha do cookie (`WORKOS_COOKIE_PASSWORD`) ≥ 32 caracteres.

Validação
- `npm install @workos-inc/authkit-remix`
- `npm run dev` e fluxo: `/` → botão “Entrar com WorkOS” → Hosted Sign-in → `/callback` → `/home`.

Incrementos futuros
- Seleção de organização, roles/permissions, profile sync.


# Plano de Implantação WorkOS (AuthKit Remix)

Objetivo
- Integrar autenticação WorkOS via AuthKit com fluxo hospedado (sign-in), callback, sessão e logout.

Dependências
- `@workos-inc/authkit-remix` (helpers de sessão/fluxo para Remix)
- `@workos-inc/node` (já presente)

Variáveis de ambiente
- `WORKOS_CLIENT_ID=client_...`
- `WORKOS_API_KEY=sk_...`
- `WORKOS_REDIRECT_URI=http://localhost:5173/workos/callback`
- `WORKOS_COOKIE_PASSWORD=<>=32 chars, forte>`

Arquitetura (fase 1) — concluída
- Rotas:
  - `GET /workos/callback` → `authLoader({ returnPathname: '/home' })` (rota de callback oficial)
  - `GET /auth/login` → redireciona para `signInUrl` (endpoint de login)
- Loader público:
  - Em `_public._index.tsx`, usar `authkitLoader` para obter `{ signInUrl }`; botão “Entrar com WorkOS” com fallback quando indisponível.
- Rotas duplicadas de callback removidas; apenas `/workos/callback` permanece ativa.

Arquitetura (fase 2) — concluída
- Privado: `_private.tsx` e `_private.perfil.tsx` usam `authkitLoader` para ler sessão; quando `user` ausente, redirecionam para `signInUrl` ou `/`.
- Logout: `api.auth.logout.ts` chama `signOut(request)`; fluxo validado sem `returnTo`.
- Tema: preservado via cookie `html[data-theme]`.

Segurança
- Cookies `HttpOnly`, `SameSite=Lax`, `Secure` em produção.
- Senha do cookie (`WORKOS_COOKIE_PASSWORD`) ≥ 32 caracteres.

Validação
- `npm install`
- `npm run dev`
- Fluxo: `/` → “Entrar com WorkOS” → Hosted Sign-in → `/workos/callback` → `/home`.
- Se `signInUrl` indisponível, verificar env vars e dashboard WorkOS.

Incrementos futuros
- Seleção de organização, roles/permissions, profile sync.

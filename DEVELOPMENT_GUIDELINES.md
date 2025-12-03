# POC-wOS-remix - Development Guidelines

## 📋 Visão Geral do Projeto

Este projeto é uma **Proof of Concept (POC)** desenvolvida para demonstrar a integração entre:
- **React Router v7** (framework mode) - Nova versão do Remix
- **DaisyUI** - Biblioteca de componentes para Tailwind CSS
- **WorkOS** - Plataforma de autenticação empresarial (integração futura)

## 🎯 Objetivos

1. Explorar as capacidades do React Router v7 em modo framework
2. Demonstrar a flexibilidade do DaisyUI com múltiplos temas
3. Preparar a base para integração com WorkOS
4. Criar uma aplicação moderna seguindo as melhores práticas

## 🏗️ Princípios de Desenvolvimento

### SOLID Principles

Seguiremos rigorosamente os princípios SOLID em toda a aplicação:

#### **S - Single Responsibility Principle**
- Cada componente deve ter uma única responsabilidade
- Funções utilitárias devem fazer apenas uma coisa
- Separação clara entre lógica de apresentação e lógica de negócio

**Exemplo:**
```typescript
// ❌ Ruim - componente com múltiplas responsabilidades
function UserProfile() {
  // Busca dados, valida, renderiza, gerencia estado...
}

// ✅ Bom - responsabilidades separadas
function UserProfile() {
  const user = useUserData(); // Hook para dados
  return <UserProfileView user={user} />; // Componente de apresentação
}
```

#### **O - Open/Closed Principle**
- Componentes devem ser abertos para extensão, fechados para modificação
- Uso de composition e props para customização

**Exemplo:**
```typescript
// ✅ Componente extensível via composition
function Card({ children, header, footer }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

#### **L - Liskov Substitution Principle**
- Interfaces consistentes para componentes similares
- Subtipos devem ser substituíveis por seus tipos base

**Exemplo:**
```typescript
// ✅ Interface consistente para diferentes tipos de input
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

function TextInput(props: InputProps) { /* ... */ }
function EmailInput(props: InputProps) { /* ... */ }
```

#### **I - Interface Segregation Principle**
- Hooks e utilitários específicos e focados
- Evitar interfaces "gordas" com muitas responsabilidades

**Exemplo:**
```typescript
// ✅ Hooks específicos em vez de um hook gigante
function useAuth() { /* apenas autenticação */ }
function useTheme() { /* apenas tema */ }
function useUser() { /* apenas dados do usuário */ }
```

#### **D - Dependency Inversion Principle**
- Dependências abstraídas através de hooks e context
- Módulos de alto nível não dependem de módulos de baixo nível

**Exemplo:**
```typescript
// ✅ Abstração de dependências
function UserProfile() {
  const api = useApiClient(); // Abstração injetada
  const user = await api.getUser();
}
```

---

### Remix/React Router v7 Best Practices

#### **1. Loaders e Actions**
Separação clara entre leitura (loaders) e escrita (actions):

```typescript
// ✅ Loader para leitura de dados
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request);
  return json({ user });
}

// ✅ Action para escrita/mutação
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await updateUser(formData);
  return redirect('/profile');
}
```

#### **2. Progressive Enhancement**
Formulários devem funcionar sem JavaScript:

```typescript
// ✅ Form funciona com e sem JS
<Form method="post" action="/profile">
  <input name="name" />
  <button type="submit">Save</button>
</Form>
```

#### **3. Error Boundaries**
Tratamento de erros em cada nível de rota:

```typescript
// ✅ Error boundary por rota
export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorView error={error} />;
}
```

#### **4. Nested Routes**
Aproveitamento de layouts aninhados para reuso:

```
routes/
  _private.tsx          # Layout privado
  _private._index.tsx   # Home (usa layout privado)
  _private.perfil.tsx   # Perfil (usa layout privado)
  _public.tsx           # Layout público
  _public._index.tsx    # Landing (usa layout público)
```

#### **5. Server-Side Logic**
Lógica sensível apenas no servidor (arquivos `.server.ts`):

```typescript
// ✅ session.server.ts - apenas no servidor
export async function createUserSession(userId: string) {
  // Lógica sensível de sessão
}
```

#### **6. Type Safety**
TypeScript em toda a aplicação:

```typescript
// ✅ Tipos para loaders e actions
type LoaderData = {
  user: User;
  creativos: Creative[];
};

export async function loader(): Promise<TypedResponse<LoaderData>> {
  return json({ user, creativos });
}
```

#### **7. Data Loading**
Uso de loaders para carregamento paralelo de dados:

```typescript
// ✅ Dados carregados em paralelo
export async function loader() {
  const [user, creativos, stats] = await Promise.all([
    getUser(),
    getCreativos(),
    getStats(),
  ]);
  return json({ user, creativos, stats });
}
```

#### **8. Optimistic UI**
Feedback imediato em ações do usuário:

```typescript
// ✅ Optimistic UI com useOptimistic
function ProfileForm() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  
  return (
    <fetcher.Form method="post">
      <button disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </fetcher.Form>
  );
}
```

---

## 🎨 Estrutura de Componentes

### Organização de Arquivos

```
app/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (Button, Input, etc)
│   ├── layout/          # Componentes de layout (Header, Sidebar)
│   └── features/        # Componentes específicos de features
├── routes/              # Rotas da aplicação
├── utils/               # Utilitários e helpers
│   ├── *.server.ts      # Apenas servidor
│   └── *.ts             # Cliente e servidor
├── hooks/               # Custom hooks
├── types/               # Definições de tipos TypeScript
└── styles/              # Estilos globais
```

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`User.ts`, `Creative.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

---

## 🎭 Temas DaisyUI

A aplicação suporta os seguintes temas:

- `light` - Tema claro padrão
- `dark` - Tema escuro padrão
- `cupcake` - Tema pastel suave
- `business` - Tema profissional
- `night` - Tema escuro com tons azulados
- `dracula` - Tema escuro inspirado no Dracula
- `winter` - Tema claro com tons frios

### Implementação de Temas

```typescript
// Troca de tema via data attribute
document.documentElement.setAttribute('data-theme', 'dracula');

// Persistência em cookie/localStorage
```

---

## 🔐 Autenticação

### Fase Atual (Mock)
- Sistema de autenticação simulado
- Sessões gerenciadas via cookies
- Proteção de rotas privadas

### Fase Futura (WorkOS)
- Integração completa com WorkOS
- SSO (Single Sign-On)
- Autenticação empresarial

---

## 📊 Modelo de Dados

### Creative
Baseado no modelo do backend existente:

```typescript
interface Creative {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  meta_creatives: MetaCreative[];
}

interface MetaCreative {
  id: string;
  creative_id: string;
  meta_ad_id: string;
  meta_adset_id: string;
  meta_campaign_id: string;
  status: string;
  // ... outros campos
}
```

---

## 🧪 Testes e Validação

### Checklist de Qualidade

- [ ] TypeScript sem erros
- [ ] Componentes seguem SOLID
- [ ] Loaders e actions separados
- [ ] Error boundaries implementados
- [ ] Formulários com progressive enhancement
- [ ] Temas funcionando corretamente
- [ ] Autenticação protegendo rotas
- [ ] Responsividade mobile/desktop

---

## 🚀 Próximos Passos

1. ✅ Configuração inicial do projeto
2. ✅ Implementação de layouts e componentes
3. ✅ Sistema de autenticação mock
4. ✅ Integração com temas DaisyUI
5. 🔄 Integração com WorkOS (futuro)
6. 🔄 Conexão com API real de Creativos (futuro)

---

## 📚 Referências

- [React Router v7 Docs](https://reactrouter.com)
- [DaisyUI Documentation](https://daisyui.com)
- [WorkOS Documentation](https://workos.com/docs)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Remix Best Practices](https://remix.run/docs/en/main/guides/best-practices)

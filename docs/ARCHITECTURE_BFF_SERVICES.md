# Arquitetura BFF e Camada de Serviços

Este documento descreve a estrutura arquitetural adotada no projeto, focando na relação entre o padrão **BFF (Backend for Frontend)** e a **Camada de Serviços**, detalhando como essa separação fortalece o sistema sem perder as vantagens do BFF.

## 🏗️ Visão Geral da Estrutura

A aplicação utiliza uma arquitetura em camadas onde o React Router v7 atua tanto como framework de UI quanto como servidor BFF.

```
app/
├── routes/                 # Camada de Controle / BFF
│   ├── api.creatives.ts    # Endpoint HTTP (BFF)
│   ├── _private.home.tsx   # UI Route (SSR)
│   └── ...
│
├── services/               # Camada de Negócio (Services)
│   ├── creativeService.server.ts
│   └── authService.server.ts
│
└── clients/ (futuro)       # Camada de Infraestrutura
    └── db.server.ts
```

---

## 🔄 O Fluxo de Dados

### 1. Camada BFF (Rotas de API)
**Localização:** `app/routes/api.*.ts`

As rotas de API continuam sendo o "rosto" público do seu backend para o frontend. Elas atuam como Controladores.

- **Responsabilidades:**
  - Receber requisições HTTP (Request).
  - Validar inputs básicos (Query params, Body).
  - Chamar a Camada de Serviço apropriada.
  - Formatar a resposta (JSON) para o cliente.
  - Lidar com códigos de status HTTP (200, 400, 500).

**Exemplo (`api.creatives.ts`):**
```typescript
export async function loader() {
  // BFF delega a lógica para o serviço
  const creatives = await creativeService.list();
  // BFF formata a resposta
  return json({ creatives });
}
```

### 2. Camada de Serviço (Services)
**Localização:** `app/services/*.server.ts`

Contém a lógica de negócio pura, desacoplada do HTTP.

- **Responsabilidades:**
  - Regras de negócio (ex: filtrar creatives ativos, calcular orçamentos).
  - Orquestração de chamadas (ex: chamar DB + Cache).
  - Tratamento de erros de domínio.
  - Retornar dados puros (Objetos/Arrays), não Responses HTTP.

**Exemplo (`creativeService.server.ts`):**
```typescript
export async function list(): Promise<Creative[]> {
  // Lógica pura de busca de dados
  return db.creatives.findMany({ where: { status: 'active' } });
}
```

---

## 💎 Vantagens Mantidas e Ganhas

### ✅ Vantagens do BFF Mantidas
1. **API Específica para UI:** As rotas `api.*` continuam fornecendo exatamente o que a UI precisa, no formato ideal.
2. **Segurança:** Tokens e credenciais de backend permanecem no servidor, nunca expostos ao cliente.
3. **Desacoplamento do Backend Real:** O front não fala direto com o banco ou microserviços, fala com o BFF.

### 🚀 Vantagens Ganhas com a Extração de Serviços

#### 1. Reuso e Performance no SSR
Com a lógica em services, você pode chamá-la diretamente no loader da página (SSR) sem fazer um "auto-fetch" HTTP desnecessário.

**Antes (Sem Service):**
- SSR Rota `/home` -> `fetch('http://localhost/api/creatives')` -> Rota `/api/creatives` -> DB
- *Custo:* Overhead de rede HTTP local + serialização JSON dupla.

**Depois (Com Service):**
- SSR Rota `/home` -> `creativeService.list()` -> DB
- *Ganho:* Chamada de função direta. Zero latência de rede. Tipagem TS preservada (sem precisar de `zod` ou cast manual no retorno).

#### 2. Testabilidade
- É muito mais fácil testar `creativeService.list()` (uma função pura ou async) do que testar um endpoint HTTP que exige mocks de Request/Response.

#### 3. Clareza (Separation of Concerns)
- Suas rotas de API ficam limpas, focadas apenas em ser uma interface HTTP.
- Se a regra de negócio mudar (ex: "mostrar apenas creatives com budget > 0"), você altera só no Service, e tanto a API quanto o SSR refletem a mudança automaticamente.

---

## 📝 Resumo Prático

| Funcionalidade             | Onde Implementar?                                |
| -------------------------- | ------------------------------------------------ |
| Validação de Form/Input    | **Rota (BFF)**                                   |
| Redirecionamento (302)     | **Rota (BFF)**                                   |
| Lógica de Negócio Complexa | **Service**                                      |
| Acesso a Banco de Dados    | **Service** (ou Repository chamado pelo Service) |
| Chamada a APIs Externas    | **Service**                                      |
| Formatação JSON para Front | **Rota (BFF)**                                   |

Esta estrutura garante que seu projeto escale de forma organizada, mantendo a flexibilidade do BFF com a robustez de uma arquitetura em camadas.

---

## 🛡️ Validação com Zod

Embora a camada de Serviço retorne dados tipados (TypeScript) eliminando a necessidade de validação de *saída* entre camadas internas (SSR -> Service), a validação de **entrada** (Input Validation) continua crucial na camada BFF/Rota.

Quando o usuário envia um formulário, os dados são `unknown` ou `FormData`. O **Zod** é a ferramenta perfeita para validar e tipar esses dados antes de passá-los para os Serviços.

### Exemplo Prático: Formulário de Perfil

Abaixo, um exemplo de como utilizamos Zod na rota de perfil (`app/routes/_private.perfil.tsx`) para validar dados recebidos do formulário, incluindo um campo opcional de telefone.

```typescript
import { z } from 'zod';
// ... imports

// 1. Definição do Schema
const profileSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  // Campo opcional: aceita string vazia ou valida formato se preenchido
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  // 2. Coleta de dados
  const data = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  };

  // 3. Validação com Zod
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    // Retorna erro formatado para a UI
    const firstError = result.error.issues[0]?.message || 'Erro de validação';
    return json({ error: firstError, field: 'profile' }, { status: 400 });
  }

  // 4. Dados validados e tipados prontos para o Service
  // await userService.updateProfile(user.id, result.data);
  
  return json({ success: true, field: 'profile' });
}
```

### Onde usar Zod?
- **SIM:** Em `actions` para validar `FormData`.
- **SIM:** Em rotas de API (`api.*.ts`) para validar JSON bodies.
- **NÃO:** Não é estritamente necessário validar o retorno de `userService.list()` dentro de um `loader`, pois confiamos na tipagem do TypeScript do nosso próprio código (camada interna).


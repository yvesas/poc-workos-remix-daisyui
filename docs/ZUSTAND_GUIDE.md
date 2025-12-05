# Zustand Integration - Gerenciamento de Estado

## 📦 O Que é Zustand?

Zustand é uma biblioteca minimalista de gerenciamento de estado para React. É mais simples que Redux e mais poderosa que Context API.

## ✅ Quando Usar Zustand na POC

### 1. **Página de Perfil** ✅ (Implementado)

**Benefícios:**
- **Optimistic UI**: Mudanças aparecem instantaneamente antes da confirmação do servidor
- **Indicador de Mudanças Não Salvas**: Avisa o usuário sobre dados não salvos
- **Persistência**: Dados salvos no localStorage sobrevivem a recarregamentos
- **Sem Prop Drilling**: Estado acessível em qualquer componente

**Exemplo de Uso:**
```tsx
const { user, updateField, isDirty } = useProfileStore();

<input 
  value={user?.firstName || ''} 
  onChange={(e) => updateField('firstName', e.target.value)}
/>

{isDirty && <span>Alterações não salvas</span>}
```

### 2. **Outros Casos de Uso Recomendados**

#### Filtros de Tabela (Home - Creatives)
```typescript
// stores/filterStore.ts
interface FilterState {
  search: string;
  status: string[];
  platform: string[];
  setSearch: (search: string) => void;
  toggleStatus: (status: string) => void;
  reset: () => void;
}
```

**Benefício**: Filtros persistem entre navegações

#### Tema Global
```typescript
// stores/themeStore.ts
interface ThemeState {
  theme: DaisyTheme;
  setTheme: (theme: DaisyTheme) => void;
}
```

**Benefício**: Centraliza gerenciamento de tema (alternativa ao cookie)

#### Carrinho/Seleção Múltipla
```typescript
// stores/selectionStore.ts
interface SelectionState {
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
}
```

**Benefício**: Ações em lote em creatives selecionados

## 🚫 Quando NÃO Usar Zustand

1. **Dados do Servidor**: Use loaders do React Router
2. **Estado Local Simples**: Use `useState`
3. **Formulários Simples**: Use `Form` do React Router
4. **Autenticação**: Use sessões server-side

## 📁 Estrutura de Stores

```
app/
├── stores/
│   ├── profileStore.ts      ✅ Implementado
│   ├── filterStore.ts       (Futuro)
│   ├── themeStore.ts        (Futuro)
│   └── selectionStore.ts    (Futuro)
```

## 🎯 Princípios SOLID com Zustand

### Single Responsibility
Cada store gerencia apenas um domínio:
- `profileStore` → Apenas dados de perfil
- `filterStore` → Apenas filtros de busca

### Interface Segregation
Actions específicas e focadas:
```typescript
// ✅ Bom - actions específicas
updateField(field, value)
setSaving(boolean)
reset()

// ❌ Ruim - action genérica demais
updateState(newState)
```

### Dependency Inversion
Store não depende de componentes específicos:
```typescript
// ✅ Bom - qualquer componente pode usar
const { user } = useProfileStore();

// ❌ Ruim - acoplado a componente específico
const { profilePageData } = useStore();
```

## 📊 Comparação: Zustand vs Alternativas

| Feature | Zustand | Redux | Context API | React Router |
|---------|---------|-------|-------------|--------------|
| Tamanho | 1KB | 8KB | Built-in | Built-in |
| Boilerplate | Mínimo | Alto | Médio | Mínimo |
| DevTools | ✅ | ✅ | ❌ | ✅ |
| Persistência | ✅ | Plugin | Manual | Cookies |
| Server State | ❌ | ❌ | ❌ | ✅ |
| Client State | ✅ | ✅ | ✅ | ❌ |

## 💡 Exemplo Completo: Profile Store

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  user: User | null;
  isDirty: boolean;
  isSaving: boolean;
  setUser: (user: User) => void;
  updateField: (field: keyof User, value: string) => void;
  setSaving: (saving: boolean) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: null,
      isDirty: false,
      isSaving: false,
      
      setUser: (user) => set({ user, isDirty: false }),
      updateField: (field, value) =>
        set((state) => ({
          user: state.user ? { ...state.user, [field]: value } : null,
          isDirty: true,
        })),
      setSaving: (saving) => set({ isSaving: saving }),
      reset: () => set({ user: null, isDirty: false, isSaving: false }),
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

## 🔄 Fluxo de Dados com Zustand

```
1. Servidor → Loader → Componente
   ↓
2. Componente → useEffect → Store (inicializa)
   ↓
3. Usuário digita → onChange → updateField (Zustand)
   ↓
4. Store atualiza → isDirty = true
   ↓
5. Componente re-renderiza (optimistic UI)
   ↓
6. Submit → Action → Servidor
   ↓
7. Sucesso → setUser → isDirty = false
```

## 🎨 UI com Zustand

### Indicador de Mudanças Não Salvas
```tsx
{isDirty && !isSaving && (
  <div className="alert alert-warning">
    <span>Você tem alterações não salvas</span>
  </div>
)}
```

### Loading State
```tsx
<button disabled={isSaving}>
  {isSaving ? 'Salvando...' : 'Salvar'}
</button>
```

### Optimistic Updates
```tsx
<input 
  value={user?.firstName || ''} 
  onChange={(e) => updateField('firstName', e.target.value)}
/>
```

## 📚 Referências

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Zustand + React Router](https://github.com/pmndrs/zustand#react-router)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)

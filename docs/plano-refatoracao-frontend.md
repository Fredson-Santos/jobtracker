# Plano de Refatoração — Frontend JobTracker

> **Objetivo:** Redesenhar completamente o frontend React do JobTracker para seguir os mockups de referência (`telainicial.html` e `novavaga.html`), adotando Tailwind CSS, layout mobile-first, dark mode, Material Icons e tipografia moderna (Inter + Manrope).

---

## Sumário

1. [Estado Atual vs. Estado Alvo](#1-estado-atual-vs-estado-alvo)
2. [Fase 1 — Infraestrutura e Dependências](#fase-1--infraestrutura-e-dependências)
3. [Fase 2 — Layout Global (Header + Navegação)](#fase-2--layout-global-header--navegação)
4. [Fase 3 — Cards de Vagas](#fase-3--cards-de-vagas)
5. [Fase 4 — Formulário Nova/Editar Vaga](#fase-4--formulário-novaeditar-vaga)
6. [Fase 5 — Dark Mode e Polimento Visual](#fase-5--dark-mode-e-polimento-visual)
7. [Fase 6 — Responsividade e Breakpoints](#fase-6--responsividade-e-breakpoints)
8. [Mapa de Arquivos (Antes → Depois)](#mapa-de-arquivos-antes--depois)
9. [Checklist de Validação](#checklist-de-validação)

---

## 1. Estado Atual vs. Estado Alvo

### Estado Atual

| Aspecto | Detalhe |
|---|---|
| **Estilização** | CSS customizado puro (~810 linhas em `index.css`) |
| **Tema** | Catppuccin Mocha (dark only), sem toggle |
| **Layout** | Sidebar fixa à esquerda com `<Outlet />` |
| **Ícones** | `react-icons` (Heroicons Outline) |
| **Tipografia** | Inter via system-ui fallback |
| **Responsividade** | Desktop-first, breakpoint único em 768px |
| **Componentes** | `Layout.jsx` (sidebar), `Dashboard.jsx`, `Vagas.jsx`, `VagaModal.jsx` (overlay), `StatusBadge.jsx` |
| **Dependências** | react 19, react-router-dom 7, axios, react-hot-toast, react-icons, uuid |

### Estado Alvo (Mockups)

| Aspecto | Detalhe (telainicial.html) | Detalhe (novavaga.html) |
|---|---|---|
| **Estilização** | Tailwind CSS (CDN no mockup → via PostCSS no projeto) | Tailwind CSS |
| **Tema** | Light padrão + dark mode via classe `.dark` | Light padrão + dark mode |
| **Layout** | Sem sidebar — header sticky vertical superior | Tela cheia estilo app mobile, `max-w-md` centralizado |
| **Ícones** | Material Icons (Google Fonts) | Material Icons |
| **Tipografia** | Inter (Google Fonts) | Manrope (Google Fonts) |
| **Cards** | Avatar com iniciais, empresa + cargo, badges de status coloridos, blocos de data, botões "Excluir" / "Ver andamento" | — |
| **Formulário** | — | Inputs com ícone à esquerda, `rounded-xl`, select customizado, botões sticky no bottom |
| **Filtros** | Pills horizontais com scroll (`Todos`, `Inscrito`, `Teste`, etc.) | — |
| **Header** | Sticky: logo + busca + ícones (notificação, add, dark toggle, avatar) | Back arrow + título |

### Diferenças Críticas

| Item | Atual | Alvo | Impacto |
|---|---|---|---|
| Sidebar | Sim (`Layout.jsx`) | **Não** — header top | Reescrever `Layout.jsx` inteiro |
| CSS engine | Custom CSS puro | **Tailwind CSS** | Deletar `index.css`, instalar Tailwind |
| Ícones | `react-icons` (HiOutline*) | **Material Icons** (font) | Remover react-icons, usar `<span class="material-icons">` |
| Dark mode | Hardcoded dark | **Toggle** light/dark | Novo contexto React + `localStorage` |
| Formulário | Modal overlay | **Tela dedicada** estilo app | Rota separada `/vagas/nova` e `/vagas/:id/editar` ou manter modal com novo design |
| StatusBadge | Classes CSS manuais | **Tailwind utility classes** | Refatorar badge para classes dinâmicas |

---

## Fase 1 — Infraestrutura e Dependências

**Objetivo:** Substituir o motor de estilização e ícones.

### 1.1 Instalar Tailwind CSS v3+ com PostCSS

```bash
npm install -D tailwindcss @tailwindcss/forms postcss autoprefixer
npx tailwindcss init -p
```

### 1.2 Configurar `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // toggle via classe no <html>
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        surface: {
          light: '#ffffff',
          dark:  '#1e1e2e',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

### 1.3 Substituir `index.css`

Deletar as ~810 linhas de CSS customizado e substituir por:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');
```

### 1.4 Atualizar `index.html`

Adicionar Material Icons:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
```

### 1.5 Remover dependências obsoletas

```bash
npm uninstall react-icons
```

### Arquivos Afetados

| Arquivo | Ação |
|---|---|
| `package.json` | +tailwindcss, +@tailwindcss/forms, +postcss, +autoprefixer, -react-icons |
| `tailwind.config.js` | **Criar** |
| `postcss.config.js` | **Criar** (gerado pelo `npx tailwindcss init -p`) |
| `src/index.css` | **Reescrever** (3 diretivas + import de fontes) |
| `index.html` | Adicionar link Material Icons |

---

## Fase 2 — Layout Global (Header + Navegação)

**Objetivo:** Eliminar a sidebar e criar um header sticky superior conforme `telainicial.html`.

### 2.1 Reescrever `Layout.jsx`

**De:** Sidebar com NavLinks lateral + `<Outlet />` no main.

**Para:** Header sticky no topo com:

```
┌─────────────────────────────────────────────────────┐
│ 🎯 JobTracker   [🔍 Busca]  [🔔] [➕] [🌙] [👤]  │
└─────────────────────────────────────────────────────┘
│                    <Outlet />                        │
```

Estrutura Tailwind esperada:

```jsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
  {/* Header */}
  <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <h1 className="font-heading font-bold text-lg">JobTracker</h1>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3">
        <button><!-- search --></button>
        <button><!-- notifications --></button>
        <button><!-- add --></button>
        <button><!-- dark mode toggle --></button>
        <div><!-- avatar --></div>
      </div>
    </div>
  </header>

  {/* Content */}
  <main className="max-w-5xl mx-auto px-4 py-6">
    <Outlet />
  </main>
</div>
```

### 2.2 Considerar merge Dashboard + Vagas

No mockup `telainicial.html`, tudo aparece em uma única tela. Avaliar:

- **Opção A (recomendada):** Manter duas rotas, mas com navegação via tabs no header.
- **Opção B:** Unificar numa rota só com seções colapsáveis.

### 2.3 Remover imports de `react-icons`

Substituir todos os `HiOutline*` por `<span className="material-icons-round text-xl">icon_name</span>`.

Mapeamento de ícones:

| Atual (react-icons) | Novo (Material Icons) |
|---|---|
| `HiOutlineViewGrid` | `dashboard` |
| `HiOutlineBriefcase` | `work_outline` |
| `HiOutlinePlus` | `add` |
| `HiOutlinePencil` | `edit` |
| `HiOutlineTrash` | `delete` |
| `HiOutlineExternalLink` | `open_in_new` |
| `HiOutlineCalendar` | `event` |
| `HiOutlineOfficeBuilding` | `business` |
| `HiOutlineClock` | `schedule` |
| `HiOutlineCheckCircle` | `check_circle` |
| `HiOutlineExclamation` | `warning` |
| `HiOutlineLightningBolt` | `bolt` |
| `HiX` | `close` |

### Arquivos Afetados

| Arquivo | Ação |
|---|---|
| `src/components/Layout.jsx` | **Reescrever** |
| `src/pages/Dashboard.jsx` | Remover imports react-icons, usar Material Icons |
| `src/pages/Vagas.jsx` | Remover imports react-icons, usar Material Icons |
| `src/components/VagaModal.jsx` | Remover `HiX`, usar Material Icons |
| `src/App.jsx` | Possível adição de rota `/vagas/nova` |

---

## Fase 3 — Cards de Vagas

**Objetivo:** Reconstruir os cards de vaga seguindo o design do mockup `telainicial.html`.

### 3.1 Estrutura do Card Alvo

Conforme o mockup, cada card deve ter:

```
┌──────────────────────────────────────────────┐
│  [AB]  Empresa Name              [Badge]     │
│        Cargo / Plataforma                    │
│──────────────────────────────────────────────│
│  📅 Data Limite          ⏱ Dias Restantes    │
│──────────────────────────────────────────────│
│  [Excluir]              [Ver andamento →]    │
└──────────────────────────────────────────────┘
```

- **Avatar circular** com as iniciais da empresa (2 letras), cor de fundo derivada do nome.
- **Badge de status** com cores: azul (Inscrito), amarelo (Teste Pendente), roxo (Entrevista), verde (Feedback), vermelho (Rejeitado).
- **Bloco de data** com ícone de calendário + dias restantes em destaque.
- **Botões**: "Excluir" (text danger à esquerda) e "Ver andamento" (botão primário à direita).

### 3.2 Novo componente `VagaCard.jsx`

Extrair a lógica atual inline de `Vagas.jsx` para um componente dedicado:

```jsx
// src/components/VagaCard.jsx
export default function VagaCard({ vaga, onEdit, onDelete }) {
  // Avatar: primeiras 2 letras da empresa
  const initials = vaga.empresa.slice(0, 2).toUpperCase()

  // Cor do avatar baseada no hash do nome
  const avatarColor = getColorFromString(vaga.empresa)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColor}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{vaga.empresa}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{vaga.cargo || vaga.plataforma}</p>
        </div>
        <StatusBadge status={vaga.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        ...
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <button onClick={() => onDelete(vaga.id)} className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1">
          <span className="material-icons-round text-base">delete</span> Excluir
        </button>
        <button onClick={() => onEdit(vaga)} className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1">
          Ver andamento <span className="material-icons-round text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
```

### 3.3 Filtros Horizontais

Manter os filter pills mas com estilização Tailwind:

```jsx
<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
  {STATUS_OPTIONS.map(s => (
    <button
      key={s}
      onClick={() => setFilter(s)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
        ${filter === s
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
      {s}
    </button>
  ))}
</div>
```

### 3.4 Refatorar `StatusBadge.jsx`

Trocar classes CSS manuais por utility classes Tailwind:

```jsx
const STATUS_STYLES = {
  inscrito:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'teste pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  entrevista:      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  feedback:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rejeitado:       'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}
```

### Arquivos Afetados

| Arquivo | Ação |
|---|---|
| `src/components/VagaCard.jsx` | **Criar** |
| `src/components/StatusBadge.jsx` | **Reescrever** com Tailwind |
| `src/pages/Vagas.jsx` | Simplificar — usar `<VagaCard />`, remover lógica inline de card |
| `src/pages/Dashboard.jsx` | Usar `<VagaCard />` na seção de recentes |

---

## Fase 4 — Formulário Nova/Editar Vaga

**Objetivo:** Reformular o `VagaModal` conforme `novavaga.html`.

### 4.1 Estrutura do Formulário Alvo

O mockup `novavaga.html` define um formulário mobile-app com:

```
┌──────────────────────────────┐
│  ← Voltar    Nova Vaga       │
│──────────────────────────────│
│  🏢 Empresa                  │
│  ┌─────────────────────────┐ │
│  │ Ex: Google, Nubank...   │ │
│  └─────────────────────────┘ │
│                              │
│  💼 Cargo                    │
│  ┌─────────────────────────┐ │
│  │ Ex: Estágio em Dev...   │ │
│  └─────────────────────────┘ │
│                              │
│  📋 Plataforma (select)      │
│  🔗 Link da Candidatura      │
│  📅 Data Limite               │
│  📌 Status (select)           │
│                              │
│  ┌────────────────────────┐  │
│  │      Salvar Vaga       │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │      Cancelar          │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

### 4.2 Características do Design

- **Container:** `max-w-md mx-auto` centralizado, ocupando tela cheia no mobile.
- **Inputs:** `rounded-xl` com ícone Material Icons à esquerda dentro de um wrapper flex.
- **Labels:** Acima do input com ícone inline, `text-sm font-semibold`.
- **Select:** Estilizado com `appearance-none` e ícone de chevron.
- **Botões:** Full-width, sticky no bottom do viewport, "Salvar" primary + "Cancelar" ghost.
- **Fonte:** Manrope para títulos, Inter para corpo.

### 4.3 Abordagem de Implementação

Duas opções:

| Opção | Prós | Contras |
|---|---|---|
| **A: Rota dedicada** (`/vagas/nova`, `/vagas/:id/editar`) | Fiel ao mockup, URL navegável, melhor UX mobile | Mais trabalho de roteamento |
| **B: Modal fullscreen** (manter modal, redesign visual) | Menos refatoração de rotas | Menos fiel ao mockup mobile |

**Recomendação:** Opção A — criar rotas dedicadas para fidelidade ao design mobile-app.

### 4.4 Exemplo de Input com Ícone

```jsx
<div>
  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
    <span className="material-icons-round text-base text-gray-400">business</span>
    Empresa
  </label>
  <input
    name="empresa"
    value={form.empresa}
    onChange={handleChange}
    placeholder="Ex: Google, Nubank..."
    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    required
  />
</div>
```

### Arquivos Afetados

| Arquivo | Ação |
|---|---|
| `src/components/VagaModal.jsx` | **Reescrever** ou substituir por `src/pages/VagaForm.jsx` |
| `src/App.jsx` | Adicionar rotas `/vagas/nova` e `/vagas/:id/editar` (se Opção A) |

---

## Fase 5 — Dark Mode e Polimento Visual

**Objetivo:** Implementar toggle de tema light/dark com persistência em `localStorage`.

### 5.1 Criar `ThemeContext`

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 5.2 Botão toggle no Header

```jsx
<button onClick={toggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
  <span className="material-icons-round text-xl">
    {dark ? 'light_mode' : 'dark_mode'}
  </span>
</button>
```

### 5.3 Paleta de Cores

| Elemento | Light | Dark |
|---|---|---|
| Background | `bg-gray-50` | `bg-gray-900` |
| Surface/Card | `bg-white` | `bg-gray-800` |
| Border | `border-gray-200` | `border-gray-700` |
| Text Primary | `text-gray-900` | `text-white` |
| Text Secondary | `text-gray-600` | `text-gray-400` |
| Accent | `text-blue-600` | `text-blue-400` |

### 5.4 Toast Styling

Atualizar o `<Toaster>` em `App.jsx` para reagir ao tema:

```jsx
<Toaster
  position="top-right"
  toastOptions={{
    className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !border !border-gray-200 dark:!border-gray-700 !shadow-lg',
    duration: 3000,
  }}
/>
```

### Arquivos Afetados

| Arquivo | Ação |
|---|---|
| `src/context/ThemeContext.jsx` | **Criar** |
| `src/main.jsx` | Wrappear App com `<ThemeProvider>` |
| `src/components/Layout.jsx` | Usar `useTheme()` no botão toggle |
| `src/App.jsx` | Atualizar Toaster |

---

## Fase 6 — Responsividade e Breakpoints

**Objetivo:** Garantir layout fluido e otimizado para todos os tamanhos de tela.

### 6.1 Breakpoints Tailwind (padrão)

| Breakpoint | Tamanho | Layout |
|---|---|---|
| **default** | < 640px | 1 coluna, header compacto, cards empilhados |
| **sm** | ≥ 640px | 1 coluna com mais espaçamento |
| **md** | ≥ 768px | 2 colunas de cards |
| **lg** | ≥ 1024px | 3 colunas de cards, `max-w-5xl` |

### 6.2 Grid Responsivo dos Cards

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {vagas.map(v => <VagaCard key={v.id} vaga={v} ... />)}
</div>
```

### 6.3 Header Responsivo

- **Mobile:** Logo + ícones essenciais (add, dark mode).
- **Tablet+:** Exibe barra de busca expandida e todos os ícones.

```jsx
{/* Search — visível apenas md+ */}
<div className="hidden md:flex items-center ...">
  <input placeholder="Buscar vagas..." ... />
</div>

{/* Search icon — visível apenas mobile */}
<button className="md:hidden ...">
  <span className="material-icons-round">search</span>
</button>
```

### 6.4 Formulário Responsivo

- **Mobile:** Tela cheia, botões fixed no bottom.
- **Tablet+:** `max-w-md mx-auto` centralizado, botões inline.

### 6.5 Stats do Dashboard

```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* 4 stat cards */}
</div>
```

### Arquivos Afetados

Todos os componentes visuais — responsividade é aplicada inline via classes Tailwind em cada arquivo já refatorado nas fases anteriores.

---

## Mapa de Arquivos (Antes → Depois)

| Arquivo Atual | Ação | Arquivo Resultante |
|---|---|---|
| `src/index.css` (810 linhas) | **Reescrever** | `src/index.css` (~10 linhas: Tailwind directives + fonts) |
| `src/components/Layout.jsx` | **Reescrever** | Header sticky + `<Outlet />` |
| `src/components/StatusBadge.jsx` | **Refatorar** | Tailwind utility classes |
| `src/components/VagaModal.jsx` | **Reescrever** | `src/pages/VagaForm.jsx` (rota dedicada) ou modal redesenhado |
| `src/pages/Dashboard.jsx` | **Refatorar** | Tailwind + Material Icons + VagaCard |
| `src/pages/Vagas.jsx` | **Refatorar** | Tailwind + Material Icons + VagaCard |
| `src/App.jsx` | **Ajustar** | Novas rotas, ThemeProvider wrap |
| `src/main.jsx` | **Ajustar** | ThemeProvider wrap |
| `src/api/vagasApi.js` | **Manter** | Sem alterações |
| — | **Criar** | `src/components/VagaCard.jsx` |
| — | **Criar** | `src/context/ThemeContext.jsx` |
| — | **Criar** | `tailwind.config.js` |
| — | **Criar** | `postcss.config.js` |

### Dependências Finais

```json
{
  "dependencies": {
    "axios": "^1.7.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.5.0",
    "react-router-dom": "^7.1.0",
    "uuid": "^13.0.0"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^6.0.0"
  }
}
```

> **Removidas:** `react-icons`
> **Adicionadas:** `tailwindcss`, `@tailwindcss/forms`, `postcss`, `autoprefixer`

---

## Checklist de Validação

Após cada fase, verificar:

- [ ] **Fase 1:** `npm run build` passa sem erros; Tailwind gerando classes; Material Icons carregando
- [ ] **Fase 2:** Header sticky visível; navegação funcional; sidebar eliminada; sem imports de react-icons
- [ ] **Fase 3:** Cards renderizando com avatar, badge, data e botões; filtros funcionais; grid responsivo
- [ ] **Fase 4:** Formulário abrindo corretamente; todos os campos presentes; submit criando/editando vagas via API
- [ ] **Fase 5:** Toggle dark/light funcionando; preferência salva em localStorage; todas as telas coerentes nos dois temas
- [ ] **Fase 6:** Layout correto em 360px (mobile), 768px (tablet) e 1280px+ (desktop); nenhum overflow horizontal; touch-friendly

### Testes Manuais por Breakpoint

| Viewport | Verificar |
|---|---|
| 360px (mobile) | Cards 1 coluna, header compacto, formulário fullscreen, filtros com scroll horizontal |
| 768px (tablet) | Cards 2 colunas, busca visível no header |
| 1280px (desktop) | Cards 3 colunas, max-width contido, espaçamento generoso |

---

## Ordem de Execução Recomendada

```
Fase 1 (Infra) → Fase 2 (Layout) → Fase 3 (Cards) → Fase 4 (Form) → Fase 5 (Dark Mode) → Fase 6 (Responsividade)
```

> Cada fase depende da anterior. A Fase 1 é pré-requisito absoluto (Tailwind deve estar configurado antes de qualquer refatoração visual).

---

*Documento gerado em 19/02/2026 — baseado nos mockups `telainicial.html` e `novavaga.html`.*

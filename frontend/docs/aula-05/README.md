# Aula 05 - Estrutura visual, estilos e rotas

## Objetivo

Montar a base visual do sistema DenkenHub usando React, TypeScript, Ant Design, Material Icons e `styled-components`.

A ideia da aula não é entregar tudo pronto. O projeto já tem várias partes preparadas e comentadas para serem descomentadas aos poucos durante a explicação.

Para acompanhar a prática em sala, use também o guia dos alunos:

- [README-alunos.md](./README-alunos.md)

## O foco da aula

- Entender a estrutura inicial do projeto.
- Criar rotas com `react-router-dom`.
- Reaproveitar um layout entre páginas.
- Separar componentes em pastas com `index.tsx` e `styles.ts`.
- Usar mocks simples para montar a interface.
- Construir a tela de equipamentos seguindo o Figma.

## Estrutura principal

```txt
frontend/src
├── app
│   ├── App.tsx
│   ├── routes.tsx
│   ├── layout
│   │   ├── AppLayout
│   │   └── components
│   │       ├── Header
│   │       └── Sidebar
│   ├── styles
│   │   └── global.css
│   └── theme
│       └── appTheme.ts
└── features
    ├── equipment
    │   ├── components
    │   ├── mocks
    │   ├── pages
    │   └── types
    └── locations
        └── pages
```

## Padrão dos componentes

Cada componente fica em uma pasta própria:

```txt
NomeDoComponente
├── index.tsx
└── styles.ts
```

Esse padrão ajuda a separar a estrutura do componente dos estilos.

## O que está comentado para a aula

| Arquivo | O que fazer em aula |
| --- | --- |
| `frontend/index.html` | Colar/descomentar o link da fonte Inter do Google Fonts. |
| `src/app/routes.tsx` | Importar `Route` e `Navigate`, descomentar as páginas e criar as rotas `/equipment` e `/locations`. |
| `src/app/layout/AppLayout/index.tsx` | Descomentar `Sidebar`, `Header` e seus imports para montar o layout compartilhado. |
| `src/features/equipment/pages/EquipmentPage/index.tsx` | Descomentar imports, estados, handlers, mocks e componentes da tela principal. |
| `src/features/locations/pages/LocationsPage/index.tsx` | Descomentar o conteúdo simples da página e importar `Title` e `Description` dos estilos. |

## Rotas da aula

```txt
/equipment
/locations
```

A rota `/` deve redirecionar para `/equipment`.

## Componentes principais

- `AppLayout`: estrutura geral com menu lateral, header e conteúdo.
- `Sidebar`: navegação principal da aplicação.
- `Header`: mostra o nome da página atual.
- `PageHeader`: título, descrição e botão "Novo equipamento".
- `SummaryCards`: cards de resumo usando dados mockados.
- `EquipmentFilters`: filtros visuais da tela.
- `EquipmentTable`: tabela de equipamentos.
- `StatusBadge`: status visual de cada equipamento.

## Mocks e tipos

- Mocks: `src/features/equipment/mocks/equipment.mock.ts`
- Tipos: `src/features/equipment/types/equipment.ts`

Os mocks simulam dados que futuramente podem vir de uma API.

## Ordem sugerida da aula

1. Mostrar o Figma e identificar as áreas da tela.
2. Explicar `global.css`, `appTheme.ts` e o link da fonte no `index.html`.
3. Descomentar e explicar as rotas em `routes.tsx`.
4. Montar o layout com `AppLayout`, `Sidebar` e `Header`.
5. Abrir `/equipment`.
6. Descomentar a tela `EquipmentPage` por partes.
7. Mostrar os mocks e os tipos.
8. Explicar `PageHeader`, `SummaryCards`, `EquipmentFilters`, `EquipmentTable` e `StatusBadge`.
9. Abrir `/locations` para mostrar o reaproveitamento do layout.

## Fica para a Aula 06

- Filtros funcionando de verdade.
- Formulário de novo equipamento.
- Ações reais na tabela.
- Tela de detalhes.
- Integração com API.
- Backend, autenticação e persistência.

## Comandos úteis

```bash
cd frontend
npm run dev
```

```bash
cd frontend
npm run lint
```

```bash
cd frontend
npm run build
```

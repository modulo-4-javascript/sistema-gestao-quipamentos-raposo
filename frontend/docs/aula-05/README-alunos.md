# Aula 05 - Guia do aluno

Nesta aula vamos montar a primeira estrutura visual do sistema de gestão de equipamentos.

O objetivo é entender como uma tela React pode ser organizada com rotas, layout compartilhado, componentes reutilizáveis, estilos e dados mockados.

## Antes de começar

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências, se ainda não tiver feito:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

## Passo a passo

### 1. Entender o design

Observe no Figma as principais partes da tela:

- menu lateral;
- cabeçalho;
- cards de resumo;
- filtros;
- tabela.

### 2. Carregar a fonte

Abra o arquivo:

```txt
frontend/index.html
```

Cole ou descomente o link da fonte Inter gerado pelo Google Fonts.

### 3. Ver os estilos globais

Abra:

```txt
src/app/styles/global.css
```

Esse arquivo deve ficar simples. Ele cuida apenas da base visual da aplicação, como `box-sizing`, `body` e fonte padrão.

### 4. Ver o tema do Ant Design

Abra:

```txt
src/app/theme/appTheme.ts
```

Esse arquivo guarda configurações visuais usadas pelos componentes do Ant Design.

### 5. Criar as rotas

Abra:

```txt
src/app/routes.tsx
```

Ative as rotas da aplicação:

```txt
/
/equipment
/locations
```

A rota `/` deve mandar o usuário para `/equipment`.

### 6. Montar o layout compartilhado

Abra:

```txt
src/app/layout/AppLayout/index.tsx
```

Ative o menu lateral e o cabeçalho:

- `Sidebar`;
- `Header`.

Esse layout será usado por mais de uma página.

### 7. Abrir a página de equipamentos

Acesse no navegador:

```txt
/equipment
```

Agora vamos montar a tela por partes.

### 8. Ativar a página principal

Abra:

```txt
src/features/equipment/pages/EquipmentPage/index.tsx
```

Ative aos poucos:

- imports dos componentes;
- imports dos mocks;
- estados dos filtros;
- função do botão "Novo equipamento";
- função de limpar filtros;
- lista mockada de equipamentos.

### 9. Montar os componentes visuais

Ainda na `EquipmentPage`, ative os componentes nesta ordem:

1. `PageHeader`
2. `SummaryCards`
3. `EquipmentFilters`
4. `EquipmentTable`

Depois abra cada componente para entender a responsabilidade de cada um.

### 10. Entender os mocks

Abra:

```txt
src/features/equipment/mocks/equipment.mock.ts
```

Esses dados simulam o que futuramente poderia vir de uma API.

### 11. Entender os tipos

Abra:

```txt
src/features/equipment/types/equipment.ts
```

Os tipos ajudam o TypeScript a entender o formato dos dados usados na tela.

### 12. Criar uma segunda página

Abra:

```txt
src/features/locations/pages/LocationsPage/index.tsx
```

Ative o conteúdo simples da página de localizações.

Depois acesse:

```txt
/locations
```

Essa página mostra que o mesmo layout pode ser reutilizado em outras telas.

## O que praticamos nesta aula

- Organização feature-based.
- Rotas com `react-router-dom`.
- Layout compartilhado.
- Componentes com `index.tsx` e `styles.ts`.
- Estilização com `styled-components`.
- Componentes visuais do Ant Design.
- Ícones com Material Icons.
- Dados mockados.

## O que fica para a próxima aula

- Fazer os filtros funcionarem.
- Criar formulário de novo equipamento.
- Criar ações reais na tabela.
- Criar página de detalhes.
- Simular integração com API.

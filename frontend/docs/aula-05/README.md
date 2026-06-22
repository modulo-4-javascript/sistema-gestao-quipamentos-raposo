# Aula 05 - Tela de Equipamentos

## Objetivo da aula

Nesta aula vamos criar a primeira versão visual da tela de **Equipamentos** do sistema DenkenHub, seguindo o design do Figma e usando uma estrutura simples para alunos iniciantes em React + TypeScript.

A ideia principal não é entregar um sistema completo. O objetivo é mostrar, passo a passo, como sair de uma tela desenhada no Figma e transformar isso em uma tela React organizada, com componentes reutilizáveis, dados mockados e rotas bem definidas.

Ao final da aula, os alunos devem entender:

- Como organizar uma feature no projeto.
- Como separar tela, componentes, mocks e tipos.
- Como usar componentes do Ant Design como base.
- Como usar Material Icons dentro dos componentes.
- Como criar uma rota para acessar uma página.
- Como trabalhar com dados mockados antes de integrar com API.
- Como deixar TODOs para evoluir a aplicação em próximas aulas.

## O que foi criado nesta etapa

Foi criada uma base inicial para a feature de equipamentos:

- Layout com menu lateral, barra superior e área de conteúdo.
- Rota `/equipamentos`.
- Página principal `EquipamentosPage`.
- Cards de resumo com números mockados.
- Área de filtros com busca, status, tipo e botão de limpar.
- Tabela com equipamentos mockados.
- Badge visual para status.
- Tipos TypeScript para equipamentos.
- Mocks separados em arquivo próprio.
- Comentários didáticos e TODOs para completar durante a aula.

## O que ainda não foi implementado de propósito

Algumas partes ficaram incompletas porque serão usadas como exercício durante a aula:

- Os filtros ainda não alteram a lista da tabela.
- O botão "Novo equipamento" ainda não abre um formulário real.
- As ações da tabela mostram apenas uma mensagem simples.
- Ainda não existe tela de detalhes do equipamento.
- Ainda não existe integração com API.
- Ainda não existe backend, autenticação ou persistência de dados.

Essas lacunas são intencionais. Elas ajudam a turma a acompanhar o raciocínio sem receber uma solução grande demais logo no começo.

## Estrutura de pastas usada

A organização segue uma ideia feature-based. Tudo que pertence à feature de equipamentos fica dentro da pasta `features/equipamentos`.

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
│   ├── theme
│   │   └── appTheme.ts
│   └── styles
│       ├── base.css
│       ├── global.css
│       └── tokens.css
└── features
    └── equipamentos
        ├── components
        ├── mocks
        ├── pages
        └── types
```

### `frontend/src/app`

Contém configurações gerais da aplicação:

- `App.tsx`: configura o Ant Design, o tema visual e o `BrowserRouter`.
- `routes.tsx`: concentra as rotas principais da aplicação.
- `layout`: concentra o layout geral da aplicação, como `AppLayout`, `Header` e `Sidebar`.
- `theme/appTheme.ts`: guarda o tema do Ant Design em um arquivo separado.
- `styles/global.css`: importa os arquivos globais na ordem correta.
- `styles/tokens.css`: guarda os tokens visuais extraídos do Figma.
- `styles/base.css`: guarda resets e estilos base da aplicação.

### `frontend/src/features/equipamentos`

Contém tudo que pertence à feature de equipamentos:

- `components`: componentes reutilizáveis da feature.
- `mocks`: dados temporários para simular API.
- `pages`: páginas acessadas por rota.
- `types`: tipos TypeScript usados pela feature.

## Padrão de componentes usado na aula

Cada componente foi organizado em uma pasta própria. Dentro de cada pasta temos:

```txt
NomeDoComponente
├── index.tsx
└── styles.ts
```

Esse padrão foi escolhido para deixar a separação bem clara para alunos iniciantes:

- `index.tsx`: fica com a estrutura JSX e a lógica simples do componente.
- `styles.ts`: fica com os estilos do componente usando `styled-components`.

Exemplo:

```txt
frontend/src/features/equipamentos/components/EquipmentFilters
├── index.tsx
└── styles.ts
```

Ponto importante para explicar:

> O componente cuida da estrutura e o `styles.ts` cuida da aparência. Isso evita um arquivo grande demais e facilita encontrar onde cada coisa está.

## Arquivos principais

### `frontend/src/app/App.tsx`

Arquivo responsável por envolver a aplicação com:

- `ConfigProvider` do Ant Design.
- Tema com cores do Figma.
- Localização em português.
- `BrowserRouter` para as rotas.

Esse arquivo é um bom ponto para explicar que algumas configurações ficam no nível da aplicação inteira.

### `frontend/src/app/theme/appTheme.ts`

Arquivo responsável por concentrar o tema do Ant Design.

Ele guarda:

- Cores principais.
- Fonte padrão.
- Raio de borda.
- Ajustes de componentes do Ant Design, como `Button`, `Card` e `Table`.

Ponto importante para explicar:

> Separar o tema deixa o `App.tsx` mais fácil de ler. O `App.tsx` mostra a estrutura da aplicação, enquanto `appTheme.ts` guarda os detalhes visuais do Ant Design.

### `frontend/src/app/routes.tsx`

Arquivo onde as rotas foram definidas.

A rota principal criada foi:

```txt
/equipamentos
```

Pontos para explicar:

- A rota `/` redireciona para `/equipamentos`.
- A rota `/equipamentos` renderiza a página da feature.
- A rota `*` evita que o usuário fique em uma URL inexistente.
- Existe um TODO para uma futura rota de detalhes.

### Arquivos de estilo em `frontend/src/app/styles`

A pasta de estilos globais foi dividida para evitar um arquivo grande demais:

- `global.css`: arquivo agregador. Ele importa os outros estilos globais.
- `tokens.css`: cores, fontes e valores reutilizáveis.
- `base.css`: estilos base da aplicação.

Essa organização ajuda os alunos a entenderem a responsabilidade de cada arquivo.

### `frontend/src/app/styles/tokens.css`

Arquivo com os tokens de cor extraídos do Figma.

Cores principais usadas:

```txt
Brand/Primary:   #002A64
Brand/Secondary: #007C8C
Brand/Accent:    #25B8A7
Text/Primary:    #111827
Text/Muted:      #6B7280
Bg/App:          #F9F9FF
Bg/Subtle:       #F4F7FA
Border/Default:  #DDE6EE
```

Ponto importante para explicar:

> Nem todo estilo precisa ficar dentro de um CSS global. Quando um estilo pertence à identidade visual, usamos tokens reutilizáveis. Quando pertence a um componente, usamos o `styles.ts` daquele componente.

## Componentes de layout da aplicação

### `AppLayout`

Arquivo:

```txt
frontend/src/app/layout/AppLayout/index.tsx
frontend/src/app/layout/AppLayout/styles.ts
```

Responsabilidade:

- Montar a estrutura base da tela.
- Exibir o menu lateral.
- Exibir a barra superior.
- Reservar a área onde o conteúdo da página aparece.

O que explicar:

> Esse componente evita que as páginas precisem repetir menu, header e área de conteúdo. Assim, cada página foca no conteúdo dela.

### `Sidebar`

Arquivo:

```txt
frontend/src/app/layout/components/Sidebar/index.tsx
frontend/src/app/layout/components/Sidebar/styles.ts
```

Responsabilidade:

- Mostrar a marca `DenkenHub`.
- Exibir os links principais.
- Destacar a rota ativa.
- Usar Material Icons no menu.

Ponto didático:

> A opção "Localizações" está desabilitada porque ainda não faz parte da Aula 05. Isso mostra que podemos preparar a navegação sem implementar tudo de uma vez.

### `Header`

Arquivo:

```txt
frontend/src/app/layout/components/Header/index.tsx
frontend/src/app/layout/components/Header/styles.ts
```

Responsabilidade:

- Mostrar o breadcrumb da tela atual.
- Manter a barra superior fixa no topo.
- Receber o nome da página atual por props.

Ponto didático:

> Breadcrumb ajuda o usuário a entender onde está dentro do sistema.

## Componentes da feature

### `PageHeader`

Arquivo:

```txt
frontend/src/features/equipamentos/components/PageHeader/index.tsx
frontend/src/features/equipamentos/components/PageHeader/styles.ts
```

Responsabilidade:

- Exibir o título da tela.
- Exibir a descrição.
- Exibir o botão "Novo equipamento".

Ponto didático:

> O botão já existe visualmente, mas ainda não abre um formulário real. Esse é um bom gancho para a próxima evolução da aula.

### `SummaryCards`

Arquivo:

```txt
frontend/src/features/equipamentos/components/SummaryCards/index.tsx
frontend/src/features/equipamentos/components/SummaryCards/styles.ts
```

Responsabilidade:

- Renderizar os cards de resumo.
- Receber os dados por props.
- Escolher o ícone correto para cada card.

Ponto didático:

> O componente não sabe de onde os dados vêm. Ele apenas recebe uma lista e renderiza. Isso deixa o componente mais fácil de reaproveitar.

### `EquipmentFilters`

Arquivo:

```txt
frontend/src/features/equipamentos/components/EquipmentFilters/index.tsx
frontend/src/features/equipamentos/components/EquipmentFilters/styles.ts
```

Responsabilidade:

- Mostrar campo de busca.
- Mostrar filtro por status.
- Mostrar filtro por tipo.
- Mostrar botão para limpar os filtros.

Ponto didático:

> Os filtros já controlam estados na página, mas ainda não filtram a tabela. Essa parte foi deixada para completar junto com a turma.

### `EquipmentTable`

Arquivo:

```txt
frontend/src/features/equipamentos/components/EquipmentTable/index.tsx
frontend/src/features/equipamentos/components/EquipmentTable/styles.ts
```

Responsabilidade:

- Renderizar a tabela do Ant Design.
- Mostrar dados dos equipamentos.
- Usar um componente próprio para o status.
- Mostrar menu de ações por linha.

Ponto didático:

> A tabela recebe os equipamentos por props. Isso facilita trocar a origem dos dados no futuro, seja mock, API ou estado global.

### `StatusBadge`

Arquivo:

```txt
frontend/src/features/equipamentos/components/StatusBadge/index.tsx
frontend/src/features/equipamentos/components/StatusBadge/styles.ts
```

Responsabilidade:

- Padronizar o visual dos status.
- Evitar repetição de lógica visual dentro da tabela.

Ponto didático:

> Quando um trecho visual se repete ou tem regras próprias, podemos extrair para um componente pequeno.

## Mocks

Arquivo:

```txt
frontend/src/features/equipamentos/mocks/equipamentos.mock.ts
```

Esse arquivo contém:

- `equipamentosMock`: lista de equipamentos exibida na tabela.
- `resumoEquipamentosMock`: dados dos cards de resumo.
- `statusOptions`: opções do filtro de status.
- `tipoOptions`: opções do filtro de tipo.

Comentário importante do código:

```ts
// Este mock simula os dados que futuramente virão da API
```

O que explicar:

> Antes de conectar com API, é comum criar mocks. Isso permite construir a interface, validar o layout e testar componentes sem depender do backend.

## Tipos TypeScript

Arquivo:

```txt
frontend/src/features/equipamentos/types/equipamento.ts
```

Esse arquivo define:

- `EquipmentStatus`
- `EquipmentType`
- `SummaryIconName`
- `Equipment`
- `EquipmentSummary`

O que explicar:

> TypeScript ajuda a deixar claro o formato dos dados. Isso evita muitos erros comuns quando começamos a passar props entre componentes.

## Roteiro sugerido para conduzir a aula

### Passo 1 - Apresentar o objetivo da tela

Mostre rapidamente o Figma e explique que a tela tem quatro áreas principais:

1. Menu lateral.
2. Cabeçalho da página.
3. Cards de resumo.
4. Filtros e tabela.

Fala sugerida:

> Hoje nós não vamos criar o sistema inteiro. Vamos criar uma base bem organizada para a tela de equipamentos, deixando alguns pontos preparados para evoluir nas próximas aulas.

### Passo 2 - Explicar a organização feature-based

Mostre a pasta:

```txt
frontend/src/features/equipamentos
```

Explique que a feature concentra seus próprios componentes, mocks, tipos e páginas.

Fala sugerida:

> Em projetos pequenos tudo pode começar misturado, mas conforme a aplicação cresce fica difícil manter. Separar por feature ajuda a saber onde procurar cada coisa.

### Passo 3 - Mostrar a rota da tela

Abra:

```txt
frontend/src/app/routes.tsx
```

Explique:

- O redirecionamento de `/` para `/equipamentos`.
- A rota principal da feature.
- O comentário indicando futura rota de detalhes.

Atividade rápida:

Peça para os alunos alterarem temporariamente o texto da rota ou acessarem diretamente:

```txt
http://localhost:5173/equipamentos
```

### Passo 4 - Mostrar o tema e as cores

Abra:

```txt
frontend/src/app/App.tsx
frontend/src/app/theme/appTheme.ts
frontend/src/app/styles/global.css
frontend/src/app/styles/tokens.css
frontend/src/app/styles/base.css
```

Explique:

- O `ConfigProvider` do Ant Design.
- O arquivo `appTheme.ts`.
- Os tokens de cor usados no CSS.
- A diferença entre estilos globais e estilos de componentes.
- O uso de `styled-components` nos arquivos `styles.ts`.
- A relação entre Figma e código.

Fala sugerida:

> O Figma nos dá uma referência visual. No código, transformamos isso em variáveis, tema e estilos reutilizáveis.

### Passo 5 - Mostrar a página principal

Abra:

```txt
frontend/src/features/equipamentos/pages/EquipamentosPage/index.tsx
frontend/src/features/equipamentos/pages/EquipamentosPage/styles.ts
```

Mostre que a página:

- Guarda os estados dos filtros.
- Chama os componentes principais.
- Usa os mocks.
- Tem TODOs para completar na aula.

Ponto importante:

```ts
const equipamentosVisiveis = equipamentosMock
```

Explique que, por enquanto, a tabela sempre mostra todos os equipamentos.

### Passo 6 - Mostrar os mocks

Abra:

```txt
frontend/src/features/equipamentos/mocks/equipamentos.mock.ts
```

Explique cada parte:

- Lista de equipamentos.
- Dados dos cards.
- Opções de status.
- Opções de tipo.

Atividade rápida:

Peça para os alunos adicionarem mais um equipamento mockado e verificarem se aparece na tabela.

### Passo 7 - Mostrar os cards de resumo

Abra:

```txt
frontend/src/features/equipamentos/components/SummaryCards/index.tsx
frontend/src/features/equipamentos/components/SummaryCards/styles.ts
```

Explique:

- Uso de `map`.
- Uso de props.
- Renderização condicional dos ícones.
- Uso de props no `styled-components` para a cor de cada card.

Atividade rápida:

Peça para alterar o valor de um card no mock e observar a tela.

### Passo 8 - Mostrar os filtros

Abra:

```txt
frontend/src/features/equipamentos/components/EquipmentFilters/index.tsx
frontend/src/features/equipamentos/components/EquipmentFilters/styles.ts
```

Explique:

- `Input` do Ant Design.
- `Select` do Ant Design.
- Props para estado controlado.
- Eventos `onChange`.

Fala sugerida:

> Esse componente não decide o que fazer com os filtros. Ele só mostra os campos e avisa a página quando algo muda.

### Passo 9 - Completar os filtros durante a aula

Volte para:

```txt
frontend/src/features/equipamentos/pages/EquipamentosPage/index.tsx
```

Substitua este trecho:

```ts
// TODO: vamos completar essa parte durante a aula aplicando filtros nos mocks
const equipamentosVisiveis = equipamentosMock
```

Por uma primeira versão simples:

```ts
const equipamentosVisiveis = equipamentosMock.filter((equipamento) => {
  const busca = searchText.toLowerCase()

  const correspondeBusca =
    equipamento.name.toLowerCase().includes(busca) ||
    equipamento.model.toLowerCase().includes(busca) ||
    equipamento.id.toLowerCase().includes(busca)

  const correspondeStatus = selectedStatus
    ? equipamento.status === selectedStatus
    : true

  const correspondeTipo = selectedType ? equipamento.type === selectedType : true

  return correspondeBusca && correspondeStatus && correspondeTipo
})
```

O que explicar:

- `filter` cria uma nova lista.
- `includes` verifica se um texto contém outro.
- `toLowerCase` evita problema com maiúsculas e minúsculas.
- Quando nenhum filtro está selecionado, usamos `true`.

### Passo 10 - Mostrar a tabela

Abra:

```txt
frontend/src/features/equipamentos/components/EquipmentTable/index.tsx
frontend/src/features/equipamentos/components/EquipmentTable/styles.ts
```

Explique:

- `columns` define as colunas da tabela.
- `dataSource` recebe os dados.
- `rowKey` identifica cada linha.
- `render` permite customizar uma célula.
- `Dropdown` cria o menu de ações.

Ponto didático:

> A tabela do Ant Design já resolve muita coisa pronta. Nosso trabalho é organizar os dados e customizar as partes específicas do projeto.

### Passo 11 - Mostrar o badge de status

Abra:

```txt
frontend/src/features/equipamentos/components/StatusBadge/index.tsx
frontend/src/features/equipamentos/components/StatusBadge/styles.ts
```

Explique:

- Como uma função simples pode escolher cor de acordo com o status.
- Como esse componente deixa a tabela mais limpa.

Atividade rápida:

Peça para os alunos criarem uma nova cor para algum status ou alterarem o texto visual.

### Passo 12 - Explicar os TODOs

Mostre os TODOs existentes:

```txt
// TODO: vamos completar essa parte durante a aula
// TODO: vamos completar essa parte durante a aula aplicando filtros nos mocks
// TODO: vamos criar a rota de detalhes durante uma próxima aula
```

Explique que TODOs são uma forma simples de marcar pontos de evolução do código.

Fala sugerida:

> Em uma aula, o TODO também funciona como trilha. Ele mostra para a turma onde vamos voltar depois.

## Ordem recomendada para codar ao vivo

Uma ordem tranquila para a aula:

1. Mostrar o Figma e identificar as áreas da tela.
2. Mostrar a pasta `features/equipamentos`.
3. Explicar os tipos em `types/equipamento.ts`.
4. Mostrar os mocks em `mocks/equipamentos.mock.ts`.
5. Mostrar a rota em `app/routes.tsx`.
6. Mostrar o layout base com `AppLayout`, `Sidebar` e `Header`.
7. Mostrar a página `EquipamentosPage`.
8. Mostrar `PageHeader`.
9. Mostrar `SummaryCards`.
10. Mostrar `EquipmentFilters`.
11. Completar a lógica dos filtros.
12. Mostrar `EquipmentTable`.
13. Mostrar `StatusBadge`.
14. Revisar o que ficou para a próxima aula.

## Checklist para os alunos

Ao final da aula, cada aluno deve conseguir responder:

- Onde fica a rota `/equipamentos`?
- Qual arquivo representa a página principal da feature?
- Onde estão os dados mockados?
- Qual componente renderiza os filtros?
- Qual componente renderiza a tabela?
- Como os status ganham cores diferentes?
- Por que usamos tipos TypeScript?
- O que ainda falta implementar?

## Sugestões de exercícios

Exercícios simples para fazer durante ou depois da aula:

- Adicionar um novo equipamento ao mock.
- Criar um novo tipo de equipamento.
- Alterar o texto do botão principal.
- Criar mais uma opção no menu lateral, ainda desabilitada.
- Mudar a cor de um card de resumo.
- Implementar a filtragem por busca.
- Implementar a filtragem por status.
- Implementar a filtragem por tipo.
- Exibir uma mensagem quando a tabela não tiver resultados.

## Próximos passos para a Aula 06

Possíveis evoluções:

- Criar formulário de novo equipamento.
- Criar modal de edição.
- Criar tela de detalhes.
- Separar melhor as ações da tabela.
- Simular uma chamada assíncrona.
- Começar a discutir serviços e integração com API.

## Comandos úteis

Para rodar o projeto:

```bash
cd frontend
npm run dev
```

Para verificar lint:

```bash
cd frontend
npm run lint
```

Para gerar build:

```bash
cd frontend
npm run build
```

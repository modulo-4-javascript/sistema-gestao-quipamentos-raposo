# Aula 07 - Integração Frontend + Backend

Nesta aula vamos conectar as telas de Equipamentos do frontend com a API do backend.

A ideia principal é trocar dados mockados por dados reais vindos das rotas HTTP, sem mudar a arquitetura visual que já foi construída nas aulas anteriores.

## Objetivo da aula

Ao final da aula, você deve entender o fluxo:

```txt
tela -> service -> API -> service -> estado React -> componentes
```

Também deve conseguir repetir esse padrão no Projeto Final, implementando o módulo de Localizações.

## O que será integrado

- Listagem geral de equipamentos;
- cards de resumo dos equipamentos;
- tela de detalhes de um equipamento;
- modal de criação;
- modal de edição;
- alteração de status;
- estados de loading, erro e lista vazia.

A exclusão não será o foco desta aula. Ela fica como evolução futura para não misturar muitos fluxos ao mesmo tempo.

## Pré-requisitos

- Node.js LTS instalado;
- npm instalado;
- Docker Desktop instalado;
- dependencias do frontend instaladas com `npm install`;
- noção básica de componentes, props, estado e rotas do React.

## Como rodar a aula

Nesta aula, o caminho principal e rodar tudo a partir do frontend.

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias, se necessario:

```bash
npm install
```

Rode:

```bash
npm run dev
```

Esse comando faz mais do que abrir o Vite:

- verifica/cria a configuracao local do backend;
- configura `backend/.env` com `DATABASE_URL`;
- sobe o PostgreSQL com Docker Compose;
- espera o banco ficar pronto;
- inicia a API;
- cria/atualiza `frontend/.env`;
- inicia o frontend.

Os logs aparecem no mesmo terminal com tags coloridas:

```txt
[backend] verde: logs da API
[frontend] azul: logs do Vite
[dev] ciano: mensagens do script que prepara o ambiente
```

Se o Docker Desktop estiver fechado, o script tenta abrir. Se ele nao conseguir iniciar a tempo, abra o Docker Desktop manualmente e rode o comando de novo.

Abra:

```txt
http://localhost:5173/equipment
```

Enderecos esperados:

```txt
Frontend: http://localhost:5173/equipment
API:      http://localhost:3000/api/v1
Swagger:  http://localhost:3000/docs
Health:   http://localhost:3000/health
```

Se a porta `3000` estiver ocupada, o script escolhe outra porta para a API e atualiza o proxy do frontend.

## Como rodar o backend manualmente

Se precisar demonstrar o backend separado, entre na pasta do backend:

```bash
cd backend
```

Use o script simplificado:

```bash
./start.sh
```

No Windows, use:

```bat
start.bat
```

Ou rode manualmente:

```bash
npm install
cp .env.example .env
npm run db:up
npm run dev
```

## Como rodar apenas o frontend

Normalmente voce nao precisa deste comando na aula. Use apenas se a API ja estiver rodando.

```bash
cd frontend
npm run dev:vite
```

## Variáveis de ambiente do frontend

Arquivo:

```txt
frontend/.env
```

Conteudo esperado:

```env
VITE_API_URL=/api/v1
VITE_API_PROXY_TARGET=http://localhost:3000
```

O `VITE_API_URL` é a URL usada pelo frontend para chamar a API.

Nesta aula usamos `/api/v1`, porque o Vite encaminha essa chamada para o backend por meio do proxy configurado em:

```txt
frontend/vite.config.ts
```

Na maioria dos casos, os alunos nao precisam editar esse arquivo manualmente. O `npm run dev` atualiza `VITE_API_PROXY_TARGET` quando a API precisa subir em outra porta.

Se estiver rodando tudo manualmente e o backend estiver em outra porta, ajuste:

```env
VITE_API_PROXY_TARGET=http://localhost:3001
```

## O que é integração com API?

Até agora, a tela usava mocks: dados escritos dentro do próprio frontend.

Na integração com API, o frontend deixa de inventar os dados e passa a pedir informações ao backend.

Exemplo:

```txt
GET /api/v1/equipment
```

Esse `GET` pede a lista de equipamentos. A API responde com JSON. O TanStack Query guarda essa resposta e a tela renderiza a tabela.

## Camadas usadas na integração

### Service

Arquivo:

```txt
frontend/src/features/equipment/services/equipmentService.ts
```

O service centraliza as chamadas para a API.

Assim, a tela não precisa saber todos os detalhes de URL, método HTTP e tratamento básico de erro.

### API base

Arquivo:

```txt
frontend/src/services/api.ts
```

Aqui fica a instância `axiosApi`, criada com `axios.create`.

Ela guarda a URL base para as chamadas do service ficarem curtas e legíveis.

### Hooks

Arquivo:

```txt
frontend/src/features/equipment/hooks/useEquipmentQueries.ts
```

Aqui ficam os `useQuery` e `useMutation`.

Eles controlam loading, erro, cache e atualização da tela depois de criar, editar ou alterar status.

### Types

Arquivo:

```txt
frontend/src/features/equipment/types/equipment.ts
```

Os tipos descrevem o formato dos dados.

Exemplo:

```txt
Equipment
CreateEquipmentPayload
UpdateEquipmentPayload
EquipmentStatus
EquipmentType
```

Eles ajudam o editor e o TypeScript a avisarem quando tentamos enviar ou ler um campo errado.

### Componentes

Os componentes continuam responsáveis pela interface:

```txt
EquipmentTable
EquipmentFormModal
EquipmentStatusModal
DetailsHeader
EquipmentInfoCard
EquipmentHistoryCard
```

A página busca os dados e passa tudo para os componentes por props.

## Fluxo da aula passo a passo

1. Rodar backend e frontend;
2. conferir Swagger e rotas da API;
3. configurar `.env` do frontend;
4. abrir `api.ts`;
5. abrir `equipmentService.ts`;
6. integrar listagem;
7. integrar tela de detalhes;
8. integrar criação;
9. integrar edição;
10. integrar alteração de status;
11. discutir como repetir o padrão em Localizações.

## Integração da listagem

Arquivos principais:

```txt
frontend/src/features/equipment/pages/EquipmentPage/index.tsx
frontend/src/features/equipment/components/EquipmentTable/index.tsx
frontend/src/features/equipment/services/equipmentService.ts
```

Passos:

1. A página chama `equipmentService.getEquipmentList()`;
2. o service faz `GET /equipment`;
3. a API retorna `{ data, meta }`;
4. a página guarda `data` no estado `equipments`;
5. a tabela recebe `equipments` por props;
6. enquanto carrega, a tabela mostra loading;
7. se der erro, aparece uma mensagem simples;
8. se a lista vier vazia, aparece o estado vazio.

TODO para evoluir depois:

- adicionar debounce na busca;
- buscar apenas quando o aluno clicar em pesquisar;
- usar paginação real com `meta.page` e `meta.totalPages`.

## Integração do detalhe

Arquivo:

```txt
frontend/src/features/equipment/pages/EquipmentDetailsPage/index.tsx
```

Passos:

1. A rota recebe `equipmentId`;
2. a página lê o ID com `useParams`;
3. a página chama `equipmentService.getEquipmentById(equipmentId)`;
4. o service faz `GET /equipment/:equipmentId`;
5. a tela mostra loading enquanto espera;
6. se encontrar, renderiza cabeçalho, resumo, informações, observações e histórico;
7. se não encontrar, mostra erro simples.

## Integração do modal de criação

Arquivos:

```txt
frontend/src/features/equipment/components/EquipmentFormModal/index.tsx
frontend/src/features/equipment/pages/EquipmentPage/index.tsx
```

Passos:

1. O usuário preenche o formulário;
2. o Ant Design valida os campos obrigatórios;
3. o modal devolve os valores para a página;
4. a página monta o `CreateEquipmentPayload`;
5. o service faz `POST /equipment`;
6. após sucesso, a modal fecha;
7. a página recarrega a listagem;
8. a tela mostra feedback de sucesso.

Fluxo:

```txt
formulário -> payload -> service -> API -> atualização da tela
```

## Integração do modal de edição

Passos:

1. O usuário escolhe `Editar`;
2. a página guarda o equipamento selecionado;
3. o modal abre preenchido com os dados atuais;
4. o usuário altera os campos;
5. a página monta o `UpdateEquipmentPayload`;
6. o service faz `PUT /equipment/:equipmentId`;
7. a listagem ou detalhe é recarregado após sucesso.

## Integração da alteração de status

Passos:

1. O usuário escolhe `Alterar status`;
2. o modal abre com o status atual;
3. o usuário escolhe um novo status;
4. a página monta `{ status, note }`;
5. o service faz `PATCH /equipment/:equipmentId/status`;
6. a tela bloqueia clique duplicado usando loading no botão;
7. a listagem ou detalhe é recarregado após sucesso.

## Preparação para o Projeto Final: Localizações

No projeto final, você deverá repetir o padrão de Equipamentos no módulo de Localizações.

Você não deve copiar e colar sem entender. Use Equipamentos como referência de arquitetura:

```txt
types -> service -> page -> components -> loading/erro/vazio
```

Leia também:

```txt
docs/aula-07/projeto-final-localizacoes.md
```

## Atividade prática para entrega

Implemente o módulo de Localizações seguindo o mesmo padrão usado em Equipamentos.

Requisitos mínimos:

- criar tipos de Localizações compatíveis com a API;
- criar service de Localizações;
- integrar listagem de localizações;
- integrar detalhe de uma localização;
- criar modal de criação;
- criar modal de edição;
- integrar alteração de status, se existir no backend;
- exibir loading;
- exibir erro simples;
- exibir estado vazio;
- preservar layout e organização do projeto.

Entrega sugerida:

- código no repositório;
- prints da listagem, detalhe, criação, edição e alteração de status;
- breve explicação do fluxo usado.

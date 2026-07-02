# Prompt para o Codex - API DenkenHub em Node.js

Você é o Codex atuando como engenheiro senior e professor assistente. Sua tarefa é implementar uma API completa em Node.js para o sistema **DenkenHub - Gestão de Recursos**, seguindo boas práticas reais de backend, mas mantendo o projeto didático para alunos de JavaScript/TypeScript.

## Objetivo

Criar uma API REST para gerenciar:

- Equipamentos;
- Localizações;
- Status dos equipamentos;
- Status das localizações;
- Histórico de alterações dos equipamentos;
- Histórico de equipamentos relacionados a uma localização.

Os nomes técnicos da API devem seguir padrão em inglês:

- Rotas em inglês;
- Campos JSON em inglês;
- Schemas, types, services e repositories em inglês;
- Enums em inglês e caixa alta.

As explicações para alunos, comentários didáticos e documentos devem estar em português.

## Stack obrigatória

Use:

- Node.js;
- TypeScript;
- Express;
- Zod para validação;
- Vitest para testes;
- Supertest para testes de rotas;
- ESLint e Prettier, se o projeto ainda não tiver;
- Armazenamento em memória para a primeira versão.

Não use banco de dados nessa primeira entrega. O objetivo é que os alunos entendam primeiro API, rotas, camadas, validação e organização. Mesmo assim, organize os repositories de uma forma que facilite trocar o armazenamento em memória por banco depois.

## Arquitetura esperada

Organize o projeto em formato **feature-based**, separando o código por domínio do sistema.

Estrutura sugerida:

```txt
src/
  app.ts
  server.ts

  shared/
    errors/
      AppError.ts
      errorHandler.ts
    http/
      pagination.ts
      response.ts
    middlewares/
      validateRequest.ts
    types/
      pagination.ts

  features/
    equipment/
      equipment.routes.ts
      equipment.controller.ts
      equipment.service.ts
      equipment.repository.ts
      equipment.schemas.ts
      equipment.types.ts
      equipment.seed.ts

    locations/
      locations.routes.ts
      locations.controller.ts
      locations.service.ts
      locations.repository.ts
      locations.schemas.ts
      locations.types.ts
      locations.seed.ts

    history/
      history.service.ts
      history.repository.ts
      history.types.ts
      history.seed.ts

  tests/
    equipment.routes.test.ts
    locations.routes.test.ts
```

## Regras de SOLID e modularização

Siga estas regras:

- Controllers devem apenas receber request, chamar services e retornar response.
- Services devem conter regras de negócio.
- Repositories devem conter acesso aos dados, mesmo que os dados estejam em memória.
- Schemas Zod devem validar params, query e body.
- Types devem representar as entidades e contratos internos.
- Nenhuma regra de negócio deve ficar dentro das rotas.
- Nenhuma rota deve manipular diretamente arrays de dados.
- Use funções pequenas, com responsabilidade clara.
- Evite duplicação de código.
- Crie helpers compartilhados para paginação, respostas e erros.
- Use erros padronizados com `code`, `message` e, quando necessário, `fields`.

## Entidades principais

### Equipment

Representa um equipamento cadastrado no sistema.

Campos:

```ts
type Equipment = {
  id: string;
  code: string;
  name: string;
  type: EquipmentType;
  model?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  locationId?: string | null;
  responsibleUserId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};
```

Enums:

```ts
enum EquipmentStatus {
  AVAILABLE = "AVAILABLE",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  INACTIVE = "INACTIVE",
}

enum EquipmentType {
  NOTEBOOK = "NOTEBOOK",
  MONITOR = "MONITOR",
  PRINTER = "PRINTER",
  NETWORK = "NETWORK",
  PERIPHERAL = "PERIPHERAL",
  OTHER = "OTHER",
}
```

### Location

Representa um local onde equipamentos podem estar vinculados.

Campos:

```ts
type Location = {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  building?: string;
  floor?: string;
  room?: string;
  description?: string | null;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
};
```

Enums:

```ts
enum LocationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum LocationType {
  LABORATORY = "LABORATORY",
  OFFICE = "OFFICE",
  STORAGE = "STORAGE",
  MAINTENANCE = "MAINTENANCE",
  NETWORK = "NETWORK",
  OTHER = "OTHER",
}
```

### HistoryItem

Representa um evento registrado no sistema.

Campos:

```ts
type HistoryItem = {
  id: string;
  type: EquipmentHistoryType;
  equipmentId: string;
  fromLocationId?: string | null;
  toLocationId?: string | null;
  title: string;
  description: string;
  userId?: string | null;
  createdAt: string;
};
```

Enum:

```ts
enum EquipmentHistoryType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  LOCATION_CHANGED = "LOCATION_CHANGED",
  LINKED_TO_LOCATION = "LINKED_TO_LOCATION",
  REMOVED_FROM_LOCATION = "REMOVED_FROM_LOCATION",
  DELETED = "DELETED",
}
```

## Rotas da API

Implemente todas as rotas abaixo.

### Equipment

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/v1/equipment/summary` | Retorna os números dos cards de resumo de equipamentos |
| GET | `/api/v1/equipment` | Lista equipamentos com busca, filtros e paginação |
| POST | `/api/v1/equipment` | Cadastra um novo equipamento |
| GET | `/api/v1/equipment/:equipmentId` | Retorna os detalhes de um equipamento |
| PUT | `/api/v1/equipment/:equipmentId` | Atualiza os dados principais de um equipamento |
| DELETE | `/api/v1/equipment/:equipmentId` | Exclui um equipamento |
| PATCH | `/api/v1/equipment/:equipmentId/status` | Altera somente o status do equipamento |
| GET | `/api/v1/equipment/:equipmentId/history` | Lista o histórico de um equipamento |

### Locations

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/v1/locations/summary` | Retorna os números dos cards de resumo de localizações |
| GET | `/api/v1/locations` | Lista localizações com busca, filtros e paginação |
| POST | `/api/v1/locations` | Cadastra uma nova localização |
| GET | `/api/v1/locations/:locationId` | Retorna os detalhes de uma localização |
| PUT | `/api/v1/locations/:locationId` | Atualiza os dados principais de uma localização |
| DELETE | `/api/v1/locations/:locationId` | Exclui uma localização |
| PATCH | `/api/v1/locations/:locationId/status` | Altera somente o status da localização |
| GET | `/api/v1/locations/:locationId/equipment` | Lista equipamentos atualmente vinculados a uma localização |
| GET | `/api/v1/locations/:locationId/equipment-history` | Lista eventos de equipamentos relacionados a uma localização |

## Filtros e paginação

As listagens devem aceitar:

```txt
search
status
type
locationId
page
pageSize
```

Exemplo:

```txt
GET /api/v1/equipment?search=dell&status=AVAILABLE&type=NOTEBOOK&page=1&pageSize=10
```

Resposta paginada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 124,
    "totalPages": 13
  }
}
```

## Regras de negócio

### Equipamentos

- Ao criar um equipamento, gerar `id`, `code`, `createdAt` e `updatedAt`.
- O campo `name` é obrigatório.
- Caso o status não seja enviado, usar `AVAILABLE`.
- Caso o tipo não seja enviado, usar `OTHER`.
- Ao atualizar um equipamento, atualizar `updatedAt`.
- Ao alterar o status, criar um item no histórico com tipo `STATUS_CHANGED`.
- Ao alterar a localização do equipamento, criar histórico:
  - `LINKED_TO_LOCATION`, se antes não tinha local;
  - `REMOVED_FROM_LOCATION`, se ficou sem local;
  - `LOCATION_CHANGED`, se mudou de um local para outro.
- Ao excluir equipamento, criar histórico `DELETED` antes de remover.

### Localizações

- Ao criar uma localização, gerar `id`, `createdAt` e `updatedAt`.
- `name`, `type` e `code` são obrigatórios.
- `code` deve ser único.
- Ao atualizar uma localização, atualizar `updatedAt`.
- Ao alterar status da localização, atualizar `updatedAt`.
- Não permitir excluir uma localização que possui equipamentos vinculados.
- Nesse caso, retornar erro `409 Conflict`.

Exemplo de erro:

```json
{
  "code": "LOCATION_HAS_LINKED_EQUIPMENT",
  "message": "This location has linked equipment and cannot be deleted."
}
```

## Respostas de erro

Use formato padronizado.

Erro simples:

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "Resource not found."
}
```

Erro de validação:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data.",
  "fields": [
    {
      "field": "name",
      "message": "Name is required."
    }
  ]
}
```

## Dados iniciais

Crie seeds simples para facilitar a aula.

Localizações:

- Lab 01;
- Lab 02;
- Coordination;
- Storage;
- Maintenance Room;
- Network Room.

Equipamentos:

- Dell Notebook;
- LG Monitor;
- HP Printer;
- Network Router;
- Keyboard Kit;
- Projector.

Use exemplos parecidos com o design, mas com dados técnicos em inglês.

## Documentação obrigatória para alunos

Além da API, crie uma pasta `docs/` com arquivos didáticos em português.

Crie pelo menos estes arquivos:

```txt
docs/
  01-what-is-api.md
  02-how-http-routes-work.md
  03-openapi-and-swagger.md
  04-equipment-routes.md
  05-location-routes.md
  06-history-and-status.md
  07-frontend-integration.md
  08-project-architecture.md
  openapi.yaml
```

Mesmo com nomes de arquivos em inglês, o conteúdo deve ser em português.

### docs/01-what-is-api.md

Explique:

- O que é uma API;
- Por que o frontend precisa de uma API;
- O que significa request e response;
- O que é JSON;
- O que é endpoint;
- Diferença entre frontend e backend.

Use linguagem simples e exemplos do sistema DenkenHub.

### docs/02-how-http-routes-work.md

Explique:

- GET;
- POST;
- PUT;
- PATCH;
- DELETE;
- Params;
- Query params;
- Body;
- Status codes.

Mostre exemplos reais usando as rotas da API.

### docs/03-openapi-and-swagger.md

Explique:

- O que é OpenAPI;
- O que é Swagger;
- Como ler o arquivo `openapi.yaml`;
- Como testar uma rota pelo Swagger;
- Como o contrato ajuda frontend e backend a trabalharem juntos.

### docs/04-equipment-routes.md

Explique cada rota de equipamentos:

- Para que serve;
- Quando o frontend chama;
- Exemplo de request;
- Exemplo de response;
- Possíveis erros.

### docs/05-location-routes.md

Explique cada rota de localizações:

- Para que serve;
- Quando o frontend chama;
- Exemplo de request;
- Exemplo de response;
- Possíveis erros.

Inclua a regra de que uma localização com equipamentos vinculados não pode ser excluída.

### docs/06-history-and-status.md

Explique:

- O que é histórico;
- Por que registrar alterações;
- Diferença entre histórico de um equipamento e histórico de equipamentos de um local;
- Como o status muda;
- Por que `PATCH /status` é separado do `PUT`.

### docs/07-frontend-integration.md

Explique como integrar com React.

Inclua exemplos com `fetch` ou `axios`:

```ts
async function listEquipment() {
  const response = await fetch("http://localhost:3000/api/v1/equipment");
  const data = await response.json();
  return data;
}
```

Explique:

- Como preencher tabela;
- Como preencher cards de resumo;
- Como abrir tela de detalhes;
- Como enviar formulário;
- Como exibir erros de validação;
- Como usar loading e empty state.

### docs/08-project-architecture.md

Explique a arquitetura do projeto:

- O que é feature-based;
- O que é controller;
- O que é service;
- O que é repository;
- O que é schema de validação;
- Como isso se relaciona com SOLID;
- Por que essa organização ajuda em projetos maiores.

## OpenAPI

Crie o arquivo:

```txt
docs/openapi.yaml
```

Esse arquivo deve documentar todas as rotas implementadas.

Regras:

- Paths, schemas, properties e enums em inglês;
- Summaries e descriptions em português;
- Exemplos JSON com campos em inglês;
- Status codes corretos;
- Schemas reaproveitáveis em `components/schemas`;
- Parameters reaproveitáveis em `components/parameters`;
- Responses reaproveitáveis em `components/responses`.

## Testes obrigatórios

Crie testes cobrindo pelo menos:

- Listagem de equipamentos;
- Criação de equipamento;
- Validação de equipamento sem nome;
- Busca de equipamento por ID;
- Alteração de status de equipamento;
- Histórico criado ao alterar status;
- Listagem de localizações;
- Criação de localização;
- Validação de código duplicado;
- Bloqueio ao excluir localização com equipamentos vinculados;
- Listagem de equipamentos de uma localização;
- Listagem de histórico de equipamentos de uma localização.

## Critérios de aceite

A entrega estará correta quando:

- A API iniciar com `npm run dev`;
- Os testes rodarem com `npm test`;
- Todas as rotas principais funcionarem;
- Os dados retornarem em JSON;
- Os nomes técnicos estiverem em inglês;
- As explicações dos docs estiverem em português;
- O projeto estiver organizado por feature;
- Controllers, services e repositories estiverem separados;
- A API tiver tratamento de erro padronizado;
- O Swagger estiver documentado em `docs/openapi.yaml`;
- Os alunos conseguirem entender a API lendo a pasta `docs/`.

## Observação didática

Mantenha o código limpo e profissional, mas não esconda tudo em abstrações difíceis. A ideia é que os alunos vejam claramente o caminho:

```txt
Request HTTP
  -> Route
  -> Controller
  -> Service
  -> Repository
  -> Data
  -> Response JSON
```

Inclua comentários curtos em português apenas onde eles ajudam o aluno a entender uma decisão importante. Não comente linhas óbvias.

# Projeto Final - Localizações

No Projeto Final, você deverá implementar o módulo de Localizações seguindo o mesmo padrão usado em Equipamentos na Aula 07.

Não é para inventar uma arquitetura nova. Use Equipamentos como referência.

## Padrão esperado

```txt
types -> service -> page -> components -> feedback visual
```

## Rotas de referência no backend

Consulte o Swagger:

```txt
http://localhost:3000/docs
```

Rotas principais:

```txt
GET /api/v1/locations
GET /api/v1/locations/summary
GET /api/v1/locations/:locationId
POST /api/v1/locations
PUT /api/v1/locations/:locationId
PATCH /api/v1/locations/:locationId/status
GET /api/v1/locations/:locationId/equipment
```

## O que você deve criar

### Types

Crie tipos compatíveis com o backend, por exemplo:

```txt
Location
LocationDetails
LocationStatus
LocationType
CreateLocationPayload
UpdateLocationPayload
UpdateLocationStatusPayload
```

### Service

Crie um service próprio de Localizações.

Exemplo de arquivo:

```txt
frontend/src/features/locations/services/locationService.ts
```

Funções esperadas:

- listar localizações;
- buscar resumo;
- buscar localização por ID;
- criar localização;
- editar localização;
- alterar status.

### Listagem

Integre a página:

```txt
frontend/src/features/locations/pages/LocationsPage/index.tsx
```

Ela deve ter:

- busca na API;
- loading;
- erro;
- estado vazio;
- tabela, cards ou estrutura visual compatível com o projeto.

### Detalhe

Crie ou integre uma tela de detalhe para localização.

Ela deve:

- ler o ID pela rota;
- buscar a localização na API;
- mostrar informações principais;
- mostrar equipamentos vinculados, se usar a rota disponível;
- ter ação de voltar.

### Modais

Crie modais para:

- criar localização;
- editar localização;
- alterar status.

Siga a mesma lógica de Equipamentos:

```txt
formulário -> payload -> service -> API -> atualizar tela
```

## Critérios de avaliação

- Código organizado por feature;
- nomes de tipos e funções claros;
- chamadas de API centralizadas no service;
- nenhum dado mockado na tela final;
- tratamento de loading, erro e vazio;
- formulário validando campos obrigatórios;
- feedback simples de sucesso ou erro;
- visual consistente com o restante do sistema.

## Dica importante

O objetivo não é copiar Equipamentos linha por linha.

O objetivo é reconhecer o padrão e adaptar para Localizações.

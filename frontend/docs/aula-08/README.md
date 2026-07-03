# Aula 08 - Módulo de Localizações

Nesta aula, Equipamentos já está integrado com a API.

O objetivo é implementar Localizações seguindo o mesmo padrão usado em Equipamentos: types, service, hooks, página, componentes, estados de loading, erro, lista vazia e atualização após salvar.

## Estado inicial da branch

Já está pronto:

- `frontend/src/services/api.ts` com `axiosApi`;
- Equipamentos integrado com a API;
- utilitários compartilhados em `frontend/src/shared`;
- `locationService` completo com as rotas da API;
- `useLocationList` e `useLocationSummary`;
- página `/locations` com resumo e tabela inicial.

Falta os alunos implementarem:

- filtros de localizações;
- detalhe de localização;
- formulário de criação;
- formulário de edição;
- alteração de status;
- exclusão;
- equipamentos vinculados à localização;
- histórico de movimentações da localização.

## Rotas da API

```txt
GET    /api/v1/locations
GET    /api/v1/locations/summary
GET    /api/v1/locations/:locationId
POST   /api/v1/locations
PUT    /api/v1/locations/:locationId
PATCH  /api/v1/locations/:locationId/status
DELETE /api/v1/locations/:locationId
GET    /api/v1/locations/:locationId/equipment
GET    /api/v1/locations/:locationId/equipment-history
```

## Fluxo visual

```mermaid
flowchart LR
  Equipment["Equipamentos pronto"] --> Pattern["Padrão da integração"]
  Pattern --> Types["types/location.ts"]
  Pattern --> Service["locationService"]
  Pattern --> Hooks["hooks de locations"]
  Pattern --> Page["LocationsPage"]
  Pattern --> Components["componentes visuais"]
  Service --> API["/api/v1/locations"]
```

## Ordem sugerida

1. Revisar Equipamentos funcionando com API.
2. Abrir `types/location.ts`.
3. Conferir `locationService.ts`.
4. Criar hooks que faltam.
5. Criar filtros.
6. Criar tabela com ações.
7. Criar modal de formulário.
8. Criar modal de status.
9. Criar tela de detalhes.
10. Integrar exclusão.

## Reaproveitamento visual

Recomendação para a aula: copiar primeiro, depois extrair para `shared` quando a repetição ficar clara.

Pode copiar de Equipamentos:

- `EquipmentFilters` para criar `LocationFilters`;
- `EquipmentTable` para criar `LocationTable`;
- `EquipmentFormModal` para criar `LocationFormModal`;
- `EquipmentStatusModal` para criar `LocationStatusModal`;
- `EquipmentRemoveModal` para criar `LocationRemoveModal`;
- `DetailsHeader` para criar um cabeçalho de detalhe;
- `DetailSummaryCards` para os cards do detalhe.

Bons candidatos para `shared`:

- `PageHeader`, se receber `title`, `description`, `buttonLabel` e `onCreate`;
- `SummaryCards`, se o tipo de card ficar genérico;
- estilos de tabela, como `TableCard`, célula com ícone e botão de ações;
- modal de confirmação de exclusão;
- `getRequestErrorMessage`;
- `RequestState`.

Nesta branch, `getRequestErrorMessage` e `RequestState` já foram movidos para `shared`.

## Critérios de aceite

- Equipamentos continua funcionando com API.
- Localizações lista dados reais.
- Localizações cria e edita registros.
- Localizações altera status.
- Localizações remove registros sem equipamentos vinculados.
- Localizações mostra erro quando a API bloquear exclusão.
- Detalhe mostra resumo, equipamentos vinculados e histórico.
- Loading e erro aparecem de forma simples.

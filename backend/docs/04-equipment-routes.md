# Rotas de equipamentos

`GET /api/v1/equipment/summary` retorna números para cards de resumo.

`GET /api/v1/equipment` lista equipamentos com busca, filtros e paginação. O frontend
usa essa rota para preencher tabelas.

`POST /api/v1/equipment` cadastra um equipamento:

```json
{
  "name": "Lenovo Notebook",
  "type": "NOTEBOOK",
  "locationId": "22222222-2222-4222-8222-222222222222"
}
```

`GET /api/v1/equipment/:equipmentId` abre os detalhes de um equipamento.

`PUT /api/v1/equipment/:equipmentId` edita dados principais, como nome, tipo, modelo
e localização.

`PATCH /api/v1/equipment/:equipmentId/status` muda apenas o status e cria histórico.

`GET /api/v1/equipment/:equipmentId/history` mostra os eventos do equipamento.

`DELETE /api/v1/equipment/:equipmentId` remove o equipamento e registra histórico
antes da remoção.

Erros comuns: `404` quando o equipamento não existe e `422` quando o JSON enviado não
passa na validação.

# Rotas de localizações

`GET /api/v1/locations/summary` retorna os números dos cards de localizações.

`GET /api/v1/locations` lista locais com busca, filtros e paginação.

`POST /api/v1/locations` cria uma localização:

```json
{
  "code": "LAB-03",
  "name": "Lab 03",
  "type": "LABORATORY",
  "room": "103"
}
```

`GET /api/v1/locations/:locationId` abre os detalhes de uma localização.

`PUT /api/v1/locations/:locationId` edita dados como nome, código, prédio, sala e
descrição.

`PATCH /api/v1/locations/:locationId/status` ativa ou inativa a localização.

`GET /api/v1/locations/:locationId/equipment` lista os equipamentos atualmente
vinculados ao local.

`GET /api/v1/locations/:locationId/equipment-history` mostra eventos de equipamentos
relacionados ao local.

Uma localização com equipamentos vinculados não pode ser excluída. Nesse caso a API
retorna `409 Conflict` com o código `LOCATION_HAS_LINKED_EQUIPMENT`.

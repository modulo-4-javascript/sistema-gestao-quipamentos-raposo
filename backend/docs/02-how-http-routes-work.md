# Como funcionam rotas HTTP

Cada rota combina um método HTTP com um caminho.

- `GET` busca dados, como `GET /api/v1/equipment`.
- `POST` cria dados, como `POST /api/v1/equipment`.
- `PUT` atualiza os dados principais, como `PUT /api/v1/equipment/:equipmentId`.
- `PATCH` altera uma parte específica, como `PATCH /api/v1/equipment/:equipmentId/status`.
- `DELETE` remove um recurso, como `DELETE /api/v1/locations/:locationId`.

Params ficam no caminho da URL. Em `/equipment/:equipmentId`, o valor real pode ser
`/equipment/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa`.

Query params ficam depois de `?`, como:

```txt
GET /api/v1/equipment?search=dell&status=AVAILABLE&page=1&pageSize=10
```

Body é o JSON enviado em rotas como `POST` e `PUT`:

```json
{
  "name": "Dell Notebook",
  "type": "NOTEBOOK"
}
```

Status codes indicam o resultado. `200` significa sucesso, `201` criação, `204`
sucesso sem conteúdo, `404` recurso não encontrado, `409` conflito de regra de
negócio e `422` dados inválidos.

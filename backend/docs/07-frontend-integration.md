# Integração com React

O frontend pode chamar a API com `fetch`:

```ts
async function listEquipment() {
  const response = await fetch("http://localhost:3000/api/v1/equipment");
  const data = await response.json();
  return data;
}
```

Para preencher uma tabela, use `data.data`. Para cards de resumo, chame
`/equipment/summary` ou `/locations/summary`. Para abrir detalhes, guarde o `id` do
item clicado e chame `/equipment/:equipmentId` ou `/locations/:locationId`.

Para enviar formulário, use `POST` ou `PUT` com `Content-Type: application/json`:

```ts
await fetch("http://localhost:3000/api/v1/equipment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Dell Notebook", type: "NOTEBOOK" })
});
```

Se a API retornar `VALIDATION_ERROR`, mostre as mensagens de `fields` perto dos campos
do formulário. Enquanto a request estiver em andamento, mostre loading. Se a lista
voltar vazia, mostre um empty state com uma ação clara para cadastrar um item.

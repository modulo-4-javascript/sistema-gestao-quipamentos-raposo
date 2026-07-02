# O que é uma API

Uma API é uma forma combinada de dois sistemas conversarem. No DenkenHub, o frontend
mostra telas para o usuário, mas quem guarda e organiza os equipamentos é o backend.
A API é a porta de entrada do backend.

Quando o frontend precisa listar equipamentos, ele faz uma request para um endpoint,
por exemplo `GET /api/v1/equipment`. A API processa o pedido e devolve uma response
em JSON.

JSON é um formato de dados simples, parecido com objetos JavaScript:

```json
{
  "id": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "name": "Dell Notebook",
  "status": "AVAILABLE"
}
```

Endpoint é o endereço de uma ação da API. O frontend cuida da interface, botões e
formulários. O backend cuida das regras, validações, dados e respostas.

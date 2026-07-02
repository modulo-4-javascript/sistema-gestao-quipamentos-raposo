# OpenAPI e Swagger

OpenAPI é o contrato da API. Ele descreve quais rotas existem, quais parâmetros cada
rota aceita, quais campos aparecem no JSON e quais status codes podem voltar.

Swagger é uma ferramenta que lê esse contrato e monta uma tela interativa para testar
a API. O arquivo `docs/openapi.yaml` pode ser aberto em ferramentas como Swagger
Editor ou Swagger UI.

Neste projeto, a documentação fica disponível quando a API está rodando:

```txt
http://localhost:3000/docs
```

O contrato YAML também pode ser acessado pelo navegador:

```txt
http://localhost:3000/docs/openapi.yaml
```

Para ler o `openapi.yaml`, comece por `paths`. Cada path mostra método, descrição,
parâmetros e responses. Depois olhe `components/schemas`, onde ficam os formatos
reutilizáveis de `Equipment`, `Location`, `HistoryItem` e erros.

Esse contrato ajuda frontend e backend porque os dois times conseguem combinar antes
quais campos serão enviados e recebidos.

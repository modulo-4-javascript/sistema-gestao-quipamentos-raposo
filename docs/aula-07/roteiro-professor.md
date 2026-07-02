# Aula 07 - Roteiro do professor

## Ordem sugerida da aula remota

Tempo total sugerido: 2h20 a 2h40.

| Etapa | Tempo | Objetivo |
| --- | ---: | --- |
| Abertura e contexto | 10 min | Relembrar Aula 06 e explicar a troca de mock por API |
| Backend local | 15 min | Rodar API, banco e Swagger |
| Configuração do frontend | 10 min | Explicar `.env`, proxy do Vite e URL base |
| Service e types | 20 min | Mostrar `api.ts`, `equipmentService.ts` e `equipment.ts` |
| Listagem | 25 min | Buscar equipamentos, loading, erro e vazio |
| Detalhe | 20 min | Ler ID da rota e buscar um equipamento |
| Criação | 20 min | Validar formulário e chamar `POST` |
| Edição | 20 min | Preencher formulário e chamar `PUT` |
| Status | 15 min | Chamar `PATCH` e atualizar a tela |
| Projeto final | 15 min | Explicar Localizações e critérios de entrega |
| Fechamento | 10 min | Checklist, dúvidas e próximos passos |

## Arquivos para abrir em cada momento

Backend:

```txt
backend/src/app.ts
backend/src/features/equipment/equipment.routes.ts
backend/src/features/equipment/equipment.schemas.ts
backend/src/features/equipment/equipment.types.ts
backend/openapi.yaml
backend/README.md
```

Frontend:

```txt
frontend/.env.example
frontend/vite.config.ts
frontend/src/services/api.ts
frontend/src/features/equipment/types/equipment.ts
frontend/src/features/equipment/services/equipmentService.ts
frontend/src/features/equipment/pages/EquipmentPage/index.tsx
frontend/src/features/equipment/pages/EquipmentDetailsPage/index.tsx
frontend/src/features/equipment/components/EquipmentFormModal/index.tsx
frontend/src/features/equipment/components/EquipmentStatusModal/index.tsx
```

## Pausas recomendadas

1. Depois de rodar o backend: todos devem abrir `http://localhost:3000/docs`.
2. Depois de configurar o frontend: todos devem abrir `http://localhost:5173/equipment`.
3. Depois de explicar `api.ts`: pedir que os alunos localizem `VITE_API_URL`.
4. Depois da listagem: pedir que filtrem por status e observem a chamada.
5. Depois do detalhe: pedir que abram uma URL com ID inválido.
6. Depois da criação: pedir que criem um equipamento simples.
7. Depois da edição: pedir que alterem nome ou status e confiram a tabela.
8. Depois do status: pedir que vejam o histórico no detalhe.

## Trechos para completar ou explicar com calma

### `frontend/src/services/api.ts`

Explique:

- onde a URL base é montada;
- por que usamos `fetch`;
- por que respostas `204` não têm corpo;
- como o erro da API vira `ApiError`.

### `frontend/src/features/equipment/services/equipmentService.ts`

Explique:

- `GET /equipment`;
- `GET /equipment/summary`;
- `GET /equipment/:equipmentId`;
- `POST /equipment`;
- `PUT /equipment/:equipmentId`;
- `PATCH /equipment/:equipmentId/status`;
- TODO de Localizações no `listLocationOptions`.

### `frontend/src/features/equipment/pages/EquipmentPage/index.tsx`

Explique:

- `useState` para dados, loading e erro;
- `useEffect` para carregar a lista;
- `Promise.all` para buscar lista, resumo e localizações;
- TODO de debounce/paginação;
- diferença entre estado da página e props dos componentes.

### `EquipmentFormModal`

Explique:

- `validateFields`;
- preenchimento no modo edição;
- diferença entre valores do formulário e payload da API.

### `EquipmentStatusModal`

Explique:

- por que status usa `PATCH`;
- por que o botão mostra loading;
- como a observação vira `note`.

## Pontos de atenção

- O backend usa enums em inglês: `AVAILABLE`, `IN_MAINTENANCE`, `NOTEBOOK`.
- A interface mostra rótulos em português usando funções de label.
- A rota de detalhes usa UUID, não mais `EQP-001`.
- O frontend usa `/api/v1` e o Vite proxy envia para `http://localhost:3000`.
- Se o backend subir em outra porta, atualizar `VITE_API_PROXY_TARGET`.
- Não transformar Localizações em implementação pronta durante a aula.

## Erros comuns

- Docker Desktop fechado;
- porta `3000` ocupada;
- esquecer de criar `.env` no frontend;
- usar `VITE_API_URL=http://localhost:3000/api/v1` e bater em CORS;
- tentar abrir `/equipment/EQP-001` depois da integração, quando a API espera UUID;
- mandar status em português para a API;
- esquecer de recarregar a listagem após criar, editar ou alterar status.

## Sugestões de fala curta

API:

> A API é o contrato: o frontend pede, o backend valida, processa e devolve JSON.

Service:

> O service é uma camada fina para a tela não precisar conhecer todos os detalhes do HTTP.

Estado:

> Estado é a memória temporária da tela. Quando o estado muda, o React redesenha a interface.

Loading:

> Loading é honestidade visual: avisamos ao usuário que a tela está esperando a API.

Erro:

> Tratar erro é assumir que rede, servidor e dados podem falhar.

Formulário:

> O formulário coleta valores da interface; o payload é o formato que a API espera receber.

Status:

> Alterar status é uma atualização parcial, por isso usamos PATCH.

Projeto final:

> Localizações não é um módulo novo em conceito; é a repetição consciente do mesmo padrão.

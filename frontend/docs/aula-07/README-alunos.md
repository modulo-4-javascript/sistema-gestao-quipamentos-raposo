# Aula 07 - Guia do aluno: integração com backend

Nesta aula vamos ligar as telas de Equipamentos na API usando duas ferramentas:

- `axios`, para fazer as chamadas HTTP;
- `@tanstack/react-query`, para controlar busca, loading, erro e atualizacao dos dados.

A ideia e descomentar/conferir as partes em ordem:

```txt
api.ts -> equipmentService -> hooks -> pagina -> componentes
```

Se algum trecho ja estiver ativo no seu projeto, use o passo como conferencia.

## Antes de comecar

Entre na pasta do frontend:

```bash
cd frontend
```

Rode:

```bash
npm run dev
```

O terminal deve mostrar logs com tags:

```txt
[dev] prepara ambiente, banco e API
[backend] logs da API
[frontend] logs do Vite
```

Abra:

```txt
http://localhost:5173/equipment
```

Swagger:

```txt
http://localhost:3000/docs
```

## Passo 1 - Descomentar o axios base

Arquivo:

```txt
frontend/src/services/api.ts
```

Esse arquivo deve ficar bem pequeno:

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
})
```

O que entender:

- `axios.create` cria uma instancia pronta para chamar a API;
- `baseURL` evita repetir `/api/v1` em todas as chamadas;
- `VITE_API_URL` vem do `.env`;
- se nao existir `.env`, usamos `/api/v1`.

Checkpoint:

```txt
api.get('/equipment')
```

chama:

```txt
/api/v1/equipment
```

## Passo 2 - Descomentar o provider do TanStack Query

Arquivo:

```txt
frontend/src/app/App.tsx
```

Confira os imports:

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

Confira o client:

```ts
const queryClient = new QueryClient()
```

E confira o provider envolvendo a aplicacao:

```tsx
<QueryClientProvider client={queryClient}>
  <AntDesignApp>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AntDesignApp>
</QueryClientProvider>
```

O que entender:

- o QueryClient guarda cache e estado das requisicoes;
- sem provider, `useQuery` e `useMutation` nao funcionam;
- o provider fica no topo da aplicacao.

## Passo 3 - Descomentar o service de Equipamentos

Arquivo:

```txt
frontend/src/features/equipment/services/equipmentService.ts
```

O service usa `api`, nao usa `fetch` direto.

Listagem:

```ts
list(params: ListEquipmentParams = {}) {
  return api
    .get<PaginatedResult<Equipment>>('/equipment', {
      params: {
        page: 1,
        pageSize: 100,
        ...params,
      },
    })
    .then((response) => response.data)
}
```

Resumo:

```ts
summary() {
  return api
    .get<EquipmentSummaryResponse>('/equipment/summary')
    .then((response) => response.data)
}
```

Detalhe:

```ts
getById(equipmentId: string) {
  return api
    .get<EquipmentDetail>(`/equipment/${equipmentId}`)
    .then((response) => response.data)
}
```

Criacao:

```ts
create(payload: CreateEquipmentPayload) {
  return api.post<EquipmentDetail>('/equipment', payload).then((response) => response.data)
}
```

Edicao:

```ts
update(equipmentId: string, payload: UpdateEquipmentPayload) {
  return api
    .put<EquipmentDetail>(`/equipment/${equipmentId}`, payload)
    .then((response) => response.data)
}
```

Status:

```ts
updateStatus(equipmentId: string, payload: UpdateEquipmentStatusPayload) {
  return api
    .patch<EquipmentDetail>(`/equipment/${equipmentId}/status`, payload)
    .then((response) => response.data)
}
```

O que entender:

- `GET` busca dados;
- `POST` cria;
- `PUT` edita;
- `PATCH` altera apenas uma parte;
- `.then((response) => response.data)` entrega para a tela so o corpo da resposta.

## Passo 4 - Descomentar os hooks

Arquivo:

```txt
frontend/src/features/equipment/hooks/useEquipmentQueries.ts
```

Tratamento simples de erro:

```ts
export function getRequestErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      'Não foi possível completar a comunicação com a API.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível completar a comunicação com a API.'
}
```

Hook da listagem:

```ts
export function useEquipmentList(params: ListEquipmentParams) {
  const query = useQuery({
    queryKey: ['equipment', 'list', params],
    queryFn: () => equipmentService.list(params),
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}
```

Hook de criacao:

```ts
export function useCreateEquipmentMutation() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (payload: CreateEquipmentPayload) => equipmentService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}
```

O que entender:

- `useQuery` busca e guarda dados;
- `useMutation` cria/edita/altera dados;
- `invalidateQueries` manda buscar novamente depois de salvar;
- cada hook devolve `errorMessage` simples.

## Passo 5 - Descomentar a listagem na pagina

Arquivo:

```txt
frontend/src/features/equipment/pages/EquipmentPage/index.tsx
```

Confira os hooks:

```ts
const equipmentListQuery = useEquipmentList(listParams)
const equipmentSummaryQuery = useEquipmentSummary()
const locationOptionsQuery = useEquipmentLocationOptions()
```

Confira os dados:

```ts
const equipments = equipmentListQuery.data?.data ?? []
const summary = equipmentSummaryQuery.data ?? emptySummary
const locationOptions = locationOptionsQuery.data ?? []
```

Confira loading e erro:

```ts
const isLoading =
  equipmentListQuery.isLoading ||
  equipmentSummaryQuery.isLoading ||
  locationOptionsQuery.isLoading

const loadError =
  equipmentListQuery.errorMessage ||
  equipmentSummaryQuery.errorMessage ||
  locationOptionsQuery.errorMessage
```

Checkpoint:

- a tabela carrega equipamentos reais;
- os cards mostram totais reais;
- filtros disparam nova busca;
- se a API falhar, aparece mensagem simples.

## Passo 6 - Descomentar detalhe

Arquivo:

```txt
frontend/src/features/equipment/pages/EquipmentDetailsPage/index.tsx
```

Confira o ID da rota:

```ts
const { equipmentId } = useParams()
```

Confira os hooks:

```ts
const equipmentQuery = useEquipmentDetail(equipmentId)
const locationOptionsQuery = useEquipmentLocationOptions()
```

O que entender:

- `equipmentId` vem da URL;
- `useEquipmentDetail` busca um equipamento;
- `isLoading` mostra carregamento;
- `errorMessage` mostra erro simples.

Checkpoint:

- clique em `Visualizar`;
- troque o ID da URL para um valor invalido;
- confira a tela de erro.

## Passo 7 - Descomentar criacao e edicao

Na pagina de listagem, confira:

```ts
const createEquipment = useCreateEquipmentMutation()
const updateEquipment = useUpdateEquipmentMutation()
```

Criacao:

```ts
await createEquipment.mutateAsync(payload)
```

Edicao:

```ts
await updateEquipment.mutateAsync({
  equipmentId: equipmentInForm.id,
  payload,
})
```

O que entender:

- `mutateAsync` executa a alteracao;
- `onSuccess` no hook invalida as queries;
- a lista atualiza sem chamar `useEffect` manual.

Checkpoint:

- crie um equipamento;
- edite o nome ou responsavel;
- confira a tabela atualizada.

## Passo 8 - Descomentar alteracao de status

Confira o hook:

```ts
const updateEquipmentStatus = useUpdateEquipmentStatusMutation()
```

Confira o envio:

```ts
await updateEquipmentStatus.mutateAsync({
  equipmentId: equipmentInStatus.id,
  payload: {
    status: values.status,
    note: values.note?.trim() || null,
  },
})
```

O que entender:

- status usa `PATCH`;
- a observacao vira `note`;
- ao salvar, o hook invalida os dados de equipamentos;
- a tela busca novamente.

Checkpoint:

- altere o status;
- abra o detalhe;
- confira o historico recente.

## Projeto final: Localizacoes

No projeto final, repita o mesmo padrao:

```txt
api.ts -> locationService -> hooks -> pagina -> componentes
```

Entrega esperada:

- service de localizacoes usando `api.get`, `api.post`, `api.put`, `api.patch`;
- hooks usando `useQuery` e `useMutation`;
- tratamento simples com `errorMessage`;
- loading;
- erro;
- estado vazio;
- criacao, edicao, detalhe e status.

## Resumo

Voce precisa sair sabendo explicar:

- por que usamos `axios.create`;
- por que o service nao deve ficar dentro da pagina;
- o que `useQuery` faz;
- o que `useMutation` faz;
- por que invalidamos queries depois de salvar;
- como o erro vira uma mensagem simples.

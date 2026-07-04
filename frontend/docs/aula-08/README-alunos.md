# Trabalho final de casa - Módulo de Localizações

Você vai completar o módulo de Localizações usando Equipamentos como referência.

Equipamentos já está pronto e integrado com a API. Localizações começa com uma
base pronta: types, service, dois hooks e uma página que renderiza só o
cabeçalho. Cards, filtros, tabela, ações e modais estão como blocos comentados
para você ativar aos poucos.

O backend já tem as rotas de Localizações. Seu trabalho é completar o frontend:
criar hooks, componentes, estados de tela e chamadas ao `locationService`.

Este trabalho foi pensado para ser fora da aula. Leia o roteiro
com calma, implemente uma parte por vez e teste no navegador antes de avançar.

## O que você vai construir

```mermaid
flowchart TB
  Start["Começo: /locations só tem header"] --> Visual["Ativar cards, filtros e tabela"]
  Visual --> Hooks["Criar hooks que faltam"]
  Hooks --> Form["Criar modal de criação/edição"]
  Form --> Status["Criar modal de situação"]
  Status --> Remove["Criar modal de exclusão"]
  Remove --> Actions["Ligar ações da tabela"]
  Actions --> Details["Criar página de detalhe"]
  Details --> Done["Módulo completo"]
```

## Antes de começar

Rode o projeto e confira se Equipamentos funciona:

```txt
npm run dev
```

Esse comando deve subir o frontend e a API. No navegador, confira:

```txt
/equipment
/locations
```

Em `/equipment`, teste pelo menos uma ação de cada tipo: listar, criar, editar,
mudar status, excluir e abrir detalhe. Em `/locations`, o estado inicial esperado
é aparecer só o cabeçalho com o botão "Novo local".

Depois abra:

```txt
frontend/src/features/equipment/pages/EquipmentPage/index.tsx
frontend/src/features/equipment/pages/EquipmentDetailsPage/index.tsx
frontend/src/features/equipment/services/equipmentService.ts
frontend/src/features/equipment/hooks/useEquipmentList.ts
frontend/src/features/equipment/hooks/useEquipmentDetails.ts
frontend/src/features/equipment/components/EquipmentFormModal
frontend/src/features/equipment/components/EquipmentStatusModal
frontend/src/features/equipment/components/EquipmentRemoveModal
frontend/src/features/equipment/hooks/useDeleteEquipment.ts
```

O padrão que você vai repetir é:

```txt
service -> hook -> página -> componente visual
```

## Estratégia

Não comece pelos modais. A ordem mais segura é:

1. ativar a listagem visual;
2. garantir que busca, filtros e paginação funcionam;
3. criar os hooks de escrita;
4. criar o modal de formulário;
5. ligar criar e editar;
6. criar alteração de situação;
7. criar exclusão;
8. criar a página de detalhe.

Ao terminar cada etapa, rode a tela no navegador. No fim, rode `npm run build`.

## Mapa dos arquivos de Localizações

```mermaid
flowchart LR
  Types["types/location.ts"] --> Service["services/locationService.ts"]
  Service --> Hooks["hooks"]
  Hooks --> Page["pages/LocationsPage"]
  Shared["shared/components"] --> Page
  Components["components a criar"] --> Page
```

Arquivos que já existem:

```txt
frontend/src/features/locations/types/location.ts
frontend/src/features/locations/services/locationService.ts
frontend/src/features/locations/hooks/useLocationList.ts
frontend/src/features/locations/hooks/useLocationSummary.ts
frontend/src/features/locations/pages/LocationsPage/index.tsx
```

## Como ler a página pronta

Abra:

```txt
frontend/src/features/locations/pages/LocationsPage/index.tsx
```

A página começa mostrando somente:

- `PageHeader`: título, descrição e botão "Novo local".

O botão ainda não abre modal. Ele mostra uma mensagem avisando que o cadastro
deve ser implementado neste trabalho.

Depois do header, existem blocos comentados para ativar:

- `SummaryCards`: cards vindos de `GET /locations/summary`;
- `ResourceFilters`: busca, situação, tipo e limpar filtros;
- `Alert`: erro de carregamento;
- `DataTable`: tabela, paginação e scroll responsivo;
- menu de ações: visualizar, editar, mudar situação e excluir.

Os blocos estão separados assim:

1. imports;
2. constantes e helpers visuais;
3. colunas da tabela;
4. estados, hooks e handlers;
5. JSX de cards, filtros, erro e tabela;
6. modais semiprontos de criar, editar e excluir.

O último bloco deixa semiprontas as partes mais difíceis:

- abrir modal de criação;
- abrir modal de edição;
- montar payload antes de salvar;
- salvar criação/edição;
- excluir;
- renderizar modais no final da página.

Use os blocos como mapa. Não descomente tudo de uma vez.

## Passo 0 - Ativar a listagem visual

Antes dos modais, faça a página voltar a listar locais reais.

No arquivo:

```txt
frontend/src/features/locations/pages/LocationsPage/index.tsx
```

Ative os blocos:

1. imports para cards, filtros e tabela;
2. constantes e helpers;
3. colunas da tabela;
4. estados, hooks e handlers;
5. JSX de `SummaryCards`, `ResourceFilters`, `Alert` e `DataTable`.

Depois disso, `/locations` deve mostrar:

- cards de resumo;
- busca;
- filtro de situação;
- filtro de tipo;
- tabela;
- paginação.

## Rotas disponíveis na API

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

## Passo 1 - Entender types e service

Leia primeiro:

```txt
frontend/src/features/locations/types/location.ts
frontend/src/features/locations/services/locationService.ts
```

O service já tem as funções prontas. Exemplo:

```ts
async createLocation(payload: CreateLocationPayload): Promise<LocationDetails> {
  const response = await axiosApi.post<LocationDetails>('/locations', payload)

  return response.data
}
```

Isso significa: o hook não precisa saber URL. O hook chama o service.

Mapa do service de Localizações:

| Função do service | Rota usada | Onde você provavelmente usa |
| --- | --- | --- |
| `getLocationList` | `GET /locations` | tabela principal |
| `getLocationSummary` | `GET /locations/summary` | cards do topo |
| `getLocationById` | `GET /locations/:id` | página de detalhe |
| `createLocation` | `POST /locations` | formulário de criação |
| `updateLocation` | `PUT /locations/:id` | formulário de edição |
| `updateLocationStatus` | `PATCH /locations/:id/status` | modal de situação |
| `deleteLocation` | `DELETE /locations/:id` | modal de exclusão |
| `getLocationEquipment` | `GET /locations/:id/equipment` | detalhe: equipamentos vinculados |
| `getLocationHistory` | `GET /locations/:id/equipment-history` | detalhe: histórico |

Regra importante: a página chama o hook, o hook chama o service, o service chama
a API.

## Passo 2 - Criar os hooks que faltam

Já existem:

```txt
useLocationList
useLocationSummary
```

Crie:

```txt
useLocationDetails
useCreateLocation
useUpdateLocation
useUpdateLocationStatus
useDeleteLocation
useLocationEquipment
useLocationHistory
```

Use os hooks de Equipamentos como modelo:

```txt
frontend/src/features/equipment/hooks/useCreateEquipment.ts
frontend/src/features/equipment/hooks/useUpdateEquipment.ts
frontend/src/features/equipment/hooks/useUpdateEquipmentStatus.ts
frontend/src/features/equipment/hooks/useDeleteEquipment.ts
frontend/src/features/equipment/hooks/useEquipmentDetails.ts
```

Referência rápida:

| Hook novo | Modelo mais parecido | Função do service |
| --- | --- | --- |
| `useLocationDetails` | `useEquipmentDetails` | `getLocationById` |
| `useCreateLocation` | `useCreateEquipment` | `createLocation` |
| `useUpdateLocation` | `useUpdateEquipment` | `updateLocation` |
| `useUpdateLocationStatus` | `useUpdateEquipmentStatus` | `updateLocationStatus` |
| `useDeleteLocation` | `useDeleteEquipment` | `deleteLocation` |
| `useLocationEquipment` | `useEquipmentList` | `getLocationEquipment` |
| `useLocationHistory` | `useEquipmentList` | `getLocationHistory` |

Diagrama do hook:

```mermaid
sequenceDiagram
  participant Page as Página
  participant Hook as Hook
  participant Service as Service
  participant API as API

  Page->>Hook: chama create/update/delete
  Hook->>Hook: setIsLoading(true)
  Hook->>Service: chama função do service
  Service->>API: request com axios
  API-->>Service: resposta
  Service-->>Hook: data
  Hook->>Hook: setIsLoading(false)
  Hook-->>Page: resolve ou lança erro
```

Checklist de cada hook de escrita:

- `isLoading` começa `false`;
- `errorMessage` começa `''`;
- antes da request: `setIsLoading(true)` e `setErrorMessage('')`;
- em caso de erro: salvar `getRequestErrorMessage(error)` e lançar o erro de novo;
- no `finally`: `setIsLoading(false)`;
- quem chama o hook decide quando recarregar lista, resumo ou detalhe.

Checklist de cada hook de leitura:

- guardar `data`, `isLoading` e `errorMessage`;
- usar `useCallback` para criar a função de carregamento;
- chamar essa função em `useEffect`;
- retornar também `reload`, para a página conseguir atualizar os dados depois de salvar.

## Passo 3 - Criar o formulário

Copie a estrutura de:

```txt
frontend/src/features/equipment/components/EquipmentFormModal
```

Crie:

```txt
frontend/src/features/locations/components/LocationFormModal
```

Campos esperados:

- `code`: obrigatório;
- `name`: obrigatório;
- `type`: obrigatório;
- `building`: opcional;
- `floor`: opcional;
- `room`: opcional;
- `description`: opcional;
- `status`: opcional ou obrigatório, conforme sua decisão de UX.

Mesmo que `type` e `status` estejam opcionais no tipo TypeScript do formulário,
você pode exigir esses campos nas regras do `Form.Item`.

Regras da API que ajudam a evitar erro de validação:

- `code` precisa ter entre 2 e 20 caracteres;
- `code` aceita letras maiúsculas, números e hífen. Exemplo: `LAB-03`;
- `name` precisa ter pelo menos 2 caracteres;
- `type` deve ser um dos valores de `locationTypeOptions`;
- `status` deve ser `ACTIVE` ou `INACTIVE`;
- campos de texto vazios podem ser enviados como `undefined` ou `null`, seguindo o
  exemplo de Equipamentos.

Tipo sugerido:

```ts
export type LocationFormMode = 'create' | 'edit'

export interface LocationFormValues {
  code: string
  name: string
  type?: LocationType
  building?: string
  floor?: string
  room?: string
  description?: string
  status?: LocationStatus
}
```

## Passo 4 - Integrar criação e edição

Na `LocationsPage`, troque o botão "Novo local" para abrir o modal. O bloco 6
do arquivo já mostra os estados, handlers e JSX dos modais.

Fluxo:

```mermaid
flowchart TB
  Click["Clique em Novo local ou Editar"] --> State["Define modo e local atual"]
  State --> Modal["Abre LocationFormModal"]
  Modal --> Validate["Valida campos"]
  Validate --> Payload["Monta payload"]
  Payload --> Save{"Modo"}
  Save -->|create| Post["POST /locations"]
  Save -->|edit| Put["PUT /locations/:id"]
  Post --> Reload["Recarrega lista e resumo"]
  Put --> Reload
  Reload --> Close["Fecha modal"]
```

O bloco comentado em `LocationsPage` já mostra:

- estados do modal;
- função `buildLocationPayload`;
- `handleCreateLocation`;
- `handleEditLocation`;
- `handleSubmitLocationForm`.

## Passo 5 - Alterar situação

Copie a ideia de:

```txt
frontend/src/features/equipment/components/EquipmentStatusModal
```

Crie:

```txt
frontend/src/features/locations/components/LocationStatusModal
```

Payload esperado:

```ts
{
  status: values.status,
  note: values.note?.trim() || null,
}
```

Mesmo que o backend aceite `note`, a tela precisa pelo menos enviar `status`.
Depois de salvar, recarregue lista e resumo.

Fluxo:

```mermaid
sequenceDiagram
  participant User as Usuario
  participant Page as LocationsPage
  participant Hook as useUpdateLocationStatus
  participant API as API

  User->>Page: clica em Mudar situação
  Page->>Page: guarda locationInStatus
  Page-->>User: abre modal
  User->>Page: salva novo status
  Page->>Hook: updateStatus
  Hook->>API: PATCH /locations/:id/status
  API-->>Hook: local atualizado
  Hook-->>Page: sucesso
  Page->>Page: reload lista/resumo
```

## Passo 6 - Excluir localização

Copie a ideia de:

```txt
frontend/src/features/equipment/components/EquipmentRemoveModal
```

Crie:

```txt
frontend/src/features/locations/components/LocationRemoveModal
frontend/src/features/locations/hooks/useDeleteLocation.ts
```

A API bloqueia exclusão quando existe equipamento vinculado. Por isso, use:

```ts
messageApi.error(getRequestErrorMessage(error))
```

Detalhes importantes:

- exclusão bem-sucedida retorna `204` e não tem `response.data` útil;
- use `confirmLoading` no modal para evitar duplo clique durante a request;
- depois de excluir, recarregue lista e resumo;
- se a API bloquear, mantenha a tela aberta ou feche só se fizer sentido para sua UX,
  mas mostre a mensagem de erro.

Fluxo:

```mermaid
flowchart LR
  Action["Excluir no menu"] --> Modal["Confirmação"]
  Modal --> Delete["DELETE /locations/:id"]
  Delete --> Success["Sucesso: reload"]
  Delete --> Error["Erro: mostrar mensagem da API"]
```

## Passo 7 - Ligar o menu de ações

Hoje o menu visual da tabela chama uma mensagem temporária.

Troque para:

- `Ver detalhes` -> navegar para `/locations/:locationId`;
- `Editar` -> abrir `LocationFormModal` em modo edição;
- `Mudar situação` -> abrir `LocationStatusModal`;
- `Excluir` -> abrir `LocationRemoveModal`.

No código, procure:

```ts
handlePendingLocationFeature
```

Esse é o ponto temporário que deve sair quando as ações reais entrarem.

## Passo 8 - Criar página de detalhe

Crie:

```txt
frontend/src/features/locations/pages/LocationDetailsPage/index.tsx
frontend/src/features/locations/pages/LocationDetailsPage/styles.ts
```

Adicione rota em:

```txt
frontend/src/app/routes.tsx
```

Rota sugerida:

```tsx
<Route path="/locations/:locationId" element={<LocationDetailsPage />} />
```

Na página de detalhe, use:

- `useParams` para pegar `locationId`;
- `useLocationDetails`;
- `useLocationEquipment`;
- `useLocationHistory`.

Conteúdo esperado:

- cabeçalho com nome, código e situação;
- informações gerais;
- cards com resumo de equipamentos;
- tabela/lista de equipamentos vinculados;
- histórico de movimentações.

Na navegação da tabela, use `useNavigate`:

```ts
navigate(`/locations/${location.id}`)
```

Na página de detalhe, trate três estados:

- carregando;
- erro ou ID ausente;
- dados carregados.

## Passo 9 - Reaproveitar componentes compartilhados

Já estão em `shared`:

```txt
frontend/src/shared/components/PageHeader
frontend/src/shared/components/SummaryCards
frontend/src/shared/components/ResourceFilters
frontend/src/shared/components/DataTable
frontend/src/shared/http/getRequestErrorMessage.ts
frontend/src/shared/hooks/requestState.ts
```

Use esses componentes antes de criar algo novo.

Pode copiar de Equipamentos quando ainda for específico:

- modal de formulário;
- modal de status;
- modal de exclusão;
- cabeçalho de detalhe;
- cards do detalhe.

Regra prática: copie primeiro para entender; só mova para `shared` quando dois módulos realmente usarem a mesma coisa.

## Como testar durante o trabalho

Depois de cada etapa, teste no navegador:

1. Recarregue a página e veja se não ficou tela branca.
2. Abra o console do navegador e confira se não há erro de JavaScript.
3. Use a aba Network para confirmar se a rota chamada é a rota esperada.
4. Teste sucesso e erro quando existir erro esperado, como excluir localização com equipamento.
5. Rode `npm run build` antes de considerar a entrega final.

Se algo quebrar, volte para o último passo que funcionava. Não tente ativar
todos os blocos e todos os modais ao mesmo tempo.

## Dicas para destravar

- Erro de import normalmente significa bloco descomentado pela metade.
- Erro `422` normalmente significa payload diferente do contrato da API.
- Erro `404` no detalhe normalmente significa rota ou `locationId` errado.
- Se a tabela não atualiza depois de salvar, confira se chamou `reload`.
- Se o modal abre vazio na edição, confira o `useEffect` e `form.setFieldsValue`.
- Se o botão fica carregando para sempre, confira se existe `finally`.

## Checklist de entrega

- `/locations` lista dados reais.
- Busca com debounce funciona.
- Filtro de situação funciona.
- Filtro de tipo funciona.
- Paginação funciona.
- Botão "Novo local" abre formulário.
- Formulário cria local.
- Ação "Editar" abre formulário preenchido.
- Edição salva local.
- Ação "Mudar situação" abre modal.
- Situação salva via PATCH.
- Ação "Excluir" abre confirmação.
- Exclusão remove local ou mostra erro da API.
- Ação "Ver detalhes" navega para detalhe.
- Detalhe carrega pelo ID da URL.
- Detalhe mostra equipamentos vinculados.
- Detalhe mostra histórico.
- Loading aparece em requests.
- Erros aparecem com mensagem simples.
- Equipamentos continua funcionando.

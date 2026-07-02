# Aula 06 - Guia do aluno

Hoje vamos construir a tela de detalhes de um equipamento.

A ideia principal da aula é entender este fluxo:

```txt
URL -> ID do equipamento -> busca no mock -> componentes -> tela
```

A integração com API ainda não será feita hoje. Primeiro vamos usar dados mockados para entender bem:

- rota dinâmica;
- parâmetro na URL;
- busca de item por ID;
- composição de uma página com componentes;
- passagem de dados por props;
- navegação entre a tabela e a tela de detalhes.

No final da aula, o professor vai mostrar a API e explicar qual rota vai alimentar cada parte do sistema. A integração real fica para a próxima aula.

## O que vamos entregar hoje

Ao final da prática, a aplicação deve permitir:

- abrir a listagem em `/equipment`;
- clicar em `Visualizar` em uma linha da tabela;
- navegar para `/equipment/EQP-001`, `/equipment/EQP-042` ou `/equipment/EQP-087`;
- renderizar uma tela de detalhes com cabeçalho, resumo, informações, observações e histórico;
- entender qual endpoint da API substituirá o mock depois.

Neste projeto, a rota da feature está no singular:

```txt
/equipment
```

Então a tela de detalhes também seguirá esse padrão:

```txt
/equipment/:equipmentId
```

## O que não vamos fazer hoje

Hoje não vamos implementar:

- `fetch`;
- `axios`;
- `useQuery`;
- `useMutation`;
- cadastro real;
- edição real;
- exclusão real;
- loading real de API;
- tratamento real de erro vindo do backend.

Esses assuntos aparecem na próxima aula. Hoje o foco é montar a tela e entender quais dados ela precisa.

## Antes de começar

Entre na pasta do frontend:

```bash
cd frontend
```

Rode o projeto:

```bash
npm run dev
```

Abra no navegador:

```txt
http://localhost:5173/equipment
```

Se outra porta aparecer no terminal, use a porta informada pelo Vite.

## Como pensar na tela de detalhes

A tabela mostra uma lista resumida de equipamentos.

Exemplo:

```txt
EQP-001 - Notebook Dell
```

Quando clicamos em `Visualizar`, queremos abrir uma tela específica daquele equipamento.

Por isso a URL precisa carregar o ID:

```txt
/equipment/EQP-001
```

No React Router, criamos uma rota dinâmica usando `:equipmentId`:

```txt
/equipment/:equipmentId
```

O trecho `:equipmentId` significa:

```txt
essa parte da URL muda conforme o equipamento escolhido
```

Se a URL for:

```txt
/equipment/EQP-001
```

então `equipmentId` será:

```txt
EQP-001
```

Se a URL for:

```txt
/equipment/EQP-087
```

então `equipmentId` será:

```txt
EQP-087
```

## Arquivos importantes desta aula

### Rotas da aplicação

```txt
src/app/routes.tsx
```

Aqui a aplicação define quais páginas existem e qual URL abre cada página.

### Página principal de equipamentos

```txt
src/features/equipment/pages/EquipmentPage/index.tsx
```

Aqui está a listagem de equipamentos. Vamos conectar a ação `Visualizar` dessa tabela com a tela de detalhes.

### Página de detalhes

```txt
src/features/equipment/pages/EquipmentDetailsPage/index.tsx
```

Aqui vamos montar a tela de detalhes.

### Mock de detalhes

```txt
src/features/equipment/mocks/equipment-details.mock.ts
```

Aqui estão os dados falsos que simulam a resposta futura da API.

### Componentes visuais prontos

```txt
src/features/equipment/components/DetailsHeader
src/features/equipment/components/DetailSummaryCards
src/features/equipment/components/EquipmentInfoCard
src/features/equipment/components/EquipmentNotesCard
src/features/equipment/components/EquipmentHistoryCard
```

Esses componentes já estão preparados. Nosso trabalho será buscar os dados e enviar as props corretas para eles.

## Passo 1 - Conferir a rota de detalhes

Abra:

```txt
src/app/routes.tsx
```

Procure o trecho marcado com `AULA 06`.

O import da página de detalhes deve ficar assim:

```tsx
import { EquipmentDetailsPage } from '../features/equipment/pages/EquipmentDetailsPage'
```

A rota de detalhes deve ficar assim:

```tsx
<Route path="/equipment/:equipmentId" element={<EquipmentDetailsPage />} />
```

Se esses trechos estiverem comentados, descomente.

Se eles já estiverem ativos, apenas confira se estão iguais.

### Por que isso é necessário?

Sem essa rota, o React Router não sabe qual componente deve abrir quando o usuário acessa:

```txt
/equipment/EQP-001
```

Com a rota dinâmica, a mesma página consegue servir para vários equipamentos diferentes.

### Checkpoint

Teste no navegador:

```txt
http://localhost:5173/equipment/EQP-001
```

Neste momento, pode aparecer uma tela incompleta ou uma mensagem inicial. O importante é a aplicação não voltar para `/equipment` automaticamente.

## Passo 2 - Entender o mock de detalhes

Abra:

```txt
src/features/equipment/mocks/equipment-details.mock.ts
```

Esse arquivo representa, de forma simples, o que a API vai devolver no futuro.

Ele tem uma lista:

```ts
equipmentDetailsMock
```

Cada item dessa lista representa um equipamento com informações mais completas do que a tabela.

Campos principais:

- `id`: código do equipamento;
- `name`: nome exibido no cabeçalho;
- `type`: tipo do equipamento;
- `model`: modelo;
- `status`: situação atual;
- `location`: localização;
- `serialNumber`: número de série;
- `responsibleUserName`: nome da pessoa ou equipe responsável;
- `createdAt`: data de cadastro;
- `lastUpdate`: última atualização;
- `notes`: observações;
- `history`: histórico de eventos.

Também existe uma função pronta:

```ts
findEquipmentDetailById(equipmentId)
```

Ela recebe um ID e devolve o equipamento correspondente.

Exemplo:

```ts
findEquipmentDetailById('EQP-001')
```

Na prática, essa função faz o papel que a API fará depois.

Hoje:

```txt
findEquipmentDetailById(equipmentId)
```

Próxima aula:

```txt
GET /equipments/{equipmentId}
```

Também existe esta função:

```ts
getEquipmentDetailSummary(equipment)
```

Ela recebe o equipamento encontrado e monta os cards de resumo:

- status;
- localização;
- responsável;
- última atualização.

## Passo 3 - Preparar a página de detalhes

Abra:

```txt
src/features/equipment/pages/EquipmentDetailsPage/index.tsx
```

Vamos usar essa página para:

1. ler o ID da URL;
2. buscar o equipamento no mock;
3. tratar o caso de equipamento não encontrado;
4. montar os cards de resumo;
5. renderizar os componentes visuais.

Adicione os imports do React Router:

```tsx
import { useNavigate, useParams } from 'react-router-dom'
```

O `useParams` lê parâmetros da URL.

O `useNavigate` permite navegar para outra rota pelo código.

Depois importe as funções do mock:

```tsx
import {
  findEquipmentDetailById,
  getEquipmentDetailSummary,
} from '../../mocks/equipment-details.mock'
```

Agora importe os componentes visuais:

```tsx
import { DetailSummaryCards } from '../../components/DetailSummaryCards'
import { DetailsHeader } from '../../components/DetailsHeader'
import { EquipmentHistoryCard } from '../../components/EquipmentHistoryCard'
import { EquipmentInfoCard } from '../../components/EquipmentInfoCard'
import { EquipmentNotesCard } from '../../components/EquipmentNotesCard'
```

E confira se o import dos estilos possui todos estes itens:

```tsx
import { Container, ContentGrid, MainColumn, SideColumn, StarterBox } from './styles'
```

## Passo 4 - Ler o ID da URL

Dentro do componente `EquipmentDetailsPage`, adicione:

```tsx
const navigate = useNavigate()
const { equipmentId } = useParams()
```

Essas duas linhas precisam ficar no começo do componente, antes de qualquer `return`.

### Por que essa ordem importa?

`useNavigate` e `useParams` são hooks.

Hooks devem ser chamados sempre na mesma ordem. Por isso, eles não devem ficar dentro de `if`, `for`, `map` ou depois de um retorno condicional.

Agora, se a URL for:

```txt
/equipment/EQP-001
```

o valor de `equipmentId` será:

```txt
EQP-001
```

## Passo 5 - Buscar o equipamento no mock

Logo depois dos hooks, busque o equipamento:

```tsx
const equipment = findEquipmentDetailById(equipmentId)
```

Essa linha tenta encontrar, dentro do mock, o equipamento cujo `id` é igual ao ID que veio da URL.

Exemplo mental:

```txt
URL: /equipment/EQP-042
equipmentId: EQP-042
resultado: dados do Monitor LG
```

## Passo 6 - Tratar equipamento não encontrado

Nem todo ID existe no mock.

Se alguém abrir:

```txt
/equipment/ABC-999
```

o mock não encontrará nenhum item.

Para evitar erro de tela, adicione este tratamento antes do `return` principal:

```tsx
if (!equipment) {
  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <StarterBox>Equipamento não encontrado.</StarterBox>
      </Container>
    </AppLayout>
  )
}
```

### O que esse bloco faz?

Ele verifica:

```txt
se não existe equipamento, mostre uma mensagem simples
```

Sem esse tratamento, o código tentaria acessar propriedades de um valor inexistente, como:

```tsx
equipment.name
```

E isso causaria erro.

## Passo 7 - Montar os cards de resumo

Depois do `if (!equipment)`, já temos certeza de que `equipment` existe.

Agora podemos montar os cards:

```tsx
const summaries = getEquipmentDetailSummary(equipment)
```

Esses cards serão enviados para o componente:

```tsx
<DetailSummaryCards summaries={summaries} />
```

## Passo 8 - Renderizar a tela de detalhes

Agora substitua o retorno principal da página por:

```tsx
return (
  <AppLayout currentPage="Detalhes">
    <Container>
      <DetailsHeader
        equipment={equipment}
        onBack={() => navigate('/equipment')}
        onEdit={() => undefined}
        onChangeStatus={() => undefined}
        onRemove={() => undefined}
      />

      <DetailSummaryCards summaries={summaries} />

      <ContentGrid>
        <MainColumn>
          <EquipmentInfoCard equipment={equipment} />
          <EquipmentNotesCard notes={equipment.notes} />
        </MainColumn>

        <SideColumn>
          <EquipmentHistoryCard history={equipment.history} />
        </SideColumn>
      </ContentGrid>
    </Container>
  </AppLayout>
)
```

### O que cada parte renderiza?

`DetailsHeader` renderiza:

- botão de voltar;
- nome do equipamento;
- código;
- status;
- botões visuais de ação.

`DetailSummaryCards` renderiza:

- status;
- localização;
- responsável;
- última atualização.

`EquipmentInfoCard` renderiza:

- tipo;
- modelo;
- número de série;
- localização;
- responsável;
- datas.

`EquipmentNotesCard` renderiza:

- observações do equipamento.

`EquipmentHistoryCard` renderiza:

- histórico recente usando `map`.

Neste momento, as ações `Editar`, `Alterar status` e `Excluir` ainda são apenas visuais.

## Código esperado da página de detalhes

Ao final, o arquivo:

```txt
src/features/equipment/pages/EquipmentDetailsPage/index.tsx
```

deve ficar parecido com este:

```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { DetailSummaryCards } from '../../components/DetailSummaryCards'
import { DetailsHeader } from '../../components/DetailsHeader'
import { EquipmentHistoryCard } from '../../components/EquipmentHistoryCard'
import { EquipmentInfoCard } from '../../components/EquipmentInfoCard'
import { EquipmentNotesCard } from '../../components/EquipmentNotesCard'
import {
  findEquipmentDetailById,
  getEquipmentDetailSummary,
} from '../../mocks/equipment-details.mock'
import { Container, ContentGrid, MainColumn, SideColumn, StarterBox } from './styles'

export function EquipmentDetailsPage() {
  const navigate = useNavigate()
  const { equipmentId } = useParams()

  const equipment = findEquipmentDetailById(equipmentId)

  if (!equipment) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>Equipamento não encontrado.</StarterBox>
        </Container>
      </AppLayout>
    )
  }

  const summaries = getEquipmentDetailSummary(equipment)

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <DetailsHeader
          equipment={equipment}
          onBack={() => navigate('/equipment')}
          onEdit={() => undefined}
          onChangeStatus={() => undefined}
          onRemove={() => undefined}
        />

        <DetailSummaryCards summaries={summaries} />

        <ContentGrid>
          <MainColumn>
            <EquipmentInfoCard equipment={equipment} />
            <EquipmentNotesCard notes={equipment.notes} />
          </MainColumn>

          <SideColumn>
            <EquipmentHistoryCard history={equipment.history} />
          </SideColumn>
        </ContentGrid>
      </Container>
    </AppLayout>
  )
}
```

## Passo 9 - Conectar a tabela à tela de detalhes

Agora vamos voltar para a listagem.

Abra:

```txt
src/features/equipment/pages/EquipmentPage/index.tsx
```

Importe o `useNavigate`:

```tsx
import { useNavigate } from 'react-router-dom'
```

Dentro do componente `EquipmentPage`, adicione:

```tsx
const navigate = useNavigate()
```

Depois crie uma função para abrir a tela de detalhes:

```tsx
function handleViewEquipment(equipment: Equipment) {
  navigate(`/equipment/${equipment.id}`)
}
```

Essa função recebe o equipamento da linha clicada e monta a URL usando o `id`.

Exemplo:

```txt
equipment.id = EQP-001
URL gerada = /equipment/EQP-001
```

Agora passe essa função para a tabela:

```tsx
<EquipmentTable
  equipments={visibleEquipment}
  onChangeStatusEquipment={setEquipmentInStatus}
  onEditEquipment={handleEditEquipment}
  onRemoveEquipment={setEquipmentToRemove}
  onViewEquipment={handleViewEquipment}
/>
```

Quando a prop `onViewEquipment` existe, a tabela mostra a opção `Visualizar` no menu de ações.

### Por que a navegação fica na página e não na tabela?

A tabela é um componente reutilizável.

Ela não precisa saber para qual rota o sistema navega. Ela só avisa:

```txt
o usuário quer visualizar este equipamento
```

A página `EquipmentPage` decide o que fazer com essa informação.

Esse padrão deixa os componentes mais simples e mais fáceis de reaproveitar.

## Passo 10 - Testar o fluxo completo

Abra:

```txt
http://localhost:5173/equipment
```

Na tabela:

1. clique no menu de ações de um equipamento;
2. clique em `Visualizar`;
3. confira se a URL mudou;
4. confira se os dados da tela batem com o equipamento escolhido;
5. clique em `Voltar para equipamentos`.

Também teste digitando as rotas diretamente no navegador:

```txt
http://localhost:5173/equipment/EQP-001
http://localhost:5173/equipment/EQP-042
http://localhost:5173/equipment/EQP-087
```

Depois teste um ID que não existe:

```txt
http://localhost:5173/equipment/ABC-999
```

Nesse caso, a tela deve mostrar:

```txt
Equipamento não encontrado.
```

## Passo 11 - Entender o fluxo final

O fluxo completo ficou assim:

```txt
Usuário está em /equipment
  -> clica no menu de ações
  -> clica em Visualizar
  -> EquipmentPage chama navigate(`/equipment/${equipment.id}`)
  -> React Router abre /equipment/:equipmentId
  -> EquipmentDetailsPage lê equipmentId com useParams
  -> findEquipmentDetailById busca o equipamento no mock
  -> a página envia os dados para os componentes
  -> a tela de detalhes aparece
```

Esse fluxo é o mesmo que usaremos com API.

A diferença é que, na próxima aula, vamos trocar:

```ts
findEquipmentDetailById(equipmentId)
```

por uma chamada real:

```txt
GET /equipments/{equipmentId}
```

## Passo 12 - Leitura da API

Depois que a tela estiver pronta, abra:

```txt
frontend/docs/aula-06/README-api.md
```

Esse arquivo mostra qual endpoint alimenta cada parte do sistema.

Hoje vamos apenas entender:

- qual endpoint lista equipamentos;
- qual endpoint busca detalhes;
- qual endpoint cria;
- qual endpoint edita;
- qual endpoint altera status;
- qual endpoint exclui;
- quais endpoints alimentam selects.

A integração fica para a próxima aula.

## Problemas comuns

### A rota volta para `/equipment`

Confira se a rota dinâmica existe em:

```txt
src/app/routes.tsx
```

Ela precisa aparecer antes da rota coringa `*`.

### A tela ficou em branco

Confira se:

- os imports estão corretos;
- a rota foi criada;
- o componente `EquipmentDetailsPage` está sendo exportado;
- não existe erro no console do navegador.

### O TypeScript reclamou de import não usado

Confira se você importou um componente mas ainda não colocou ele no JSX.

Exemplo comum:

```tsx
import { EquipmentHistoryCard } from '../../components/EquipmentHistoryCard'
```

Se esse componente ainda não foi usado no `return`, o TypeScript ou o ESLint podem reclamar.

### O React reclamou de hooks

Confira se `useNavigate` e `useParams` estão no começo do componente:

```tsx
const navigate = useNavigate()
const { equipmentId } = useParams()
```

Eles não devem ficar dentro de `if`.

### A tela mostra "Equipamento não encontrado"

Confira se a URL usa um ID que existe no mock:

```txt
EQP-001
EQP-042
EQP-087
```

### O botão Visualizar não aparece

Confira se você passou a prop:

```tsx
onViewEquipment={handleViewEquipment}
```

para o componente `EquipmentTable`.

### Cliquei em Visualizar e nada aconteceu

Confira se a função está chamando `navigate`:

```tsx
function handleViewEquipment(equipment: Equipment) {
  navigate(`/equipment/${equipment.id}`)
}
```

Também confira se `const navigate = useNavigate()` existe dentro do componente `EquipmentPage`.

### Os dados aparecem, mas parecem sempre do mesmo equipamento

Confira se os cards de resumo estão usando:

```tsx
const summaries = getEquipmentDetailSummary(equipment)
```

e não uma lista fixa.

## Checklist de entrega

Antes de considerar a aula concluída, confira:

- a rota `/equipment/:equipmentId` existe;
- `/equipment/EQP-001` abre a tela de detalhes;
- `/equipment/EQP-042` abre outro equipamento;
- `/equipment/EQP-087` abre outro equipamento;
- `/equipment/ABC-999` mostra `Equipamento não encontrado.`;
- a tabela mostra a ação `Visualizar`;
- clicar em `Visualizar` navega para a tela certa;
- o botão `Voltar para equipamentos` retorna para `/equipment`;
- o histórico aparece na lateral;
- a tela usa mock, não API.

## Desafio opcional

Se terminar antes, tente responder:

1. Qual componente renderiza o cabeçalho da tela?
2. Qual função busca o equipamento no mock?
3. Qual hook lê o ID da URL?
4. Qual hook faz a navegação?
5. Qual endpoint substituirá o mock na próxima aula?

As respostas esperadas são:

1. `DetailsHeader`;
2. `findEquipmentDetailById`;
3. `useParams`;
4. `useNavigate`;
5. `GET /equipments/{equipmentId}`.

## Fechamento

O mais importante da Aula 06 não é decorar o código.

O mais importante é entender este raciocínio:

```txt
Tenho um ID na URL.
Uso esse ID para buscar dados.
Envio os dados para componentes.
Os componentes montam a tela.
```

Na próxima aula, a busca deixa de vir do mock e passa a vir da API.

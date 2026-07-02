# Aula 06 - Tela de detalhes e leitura da API

## Objetivo da aula

Nesta aula, o foco deixa de ser CRUD completo e passa a ser entendimento de fluxo.

A turma vai construir a tela de detalhes de um equipamento usando dados mockados simples. Depois, no fim da aula, o professor apresenta a API e mostra qual rota vai alimentar cada parte do sistema.

A integração com API fica para a próxima aula.

## Por que dividir a aula

O roteiro original da Aula 6 juntava muitos assuntos em pouco tempo:

- formulário;
- validação;
- criação;
- edição;
- exclusão;
- filtros;
- loading;
- erro;
- React Query;
- invalidação de consultas;
- selects vindos da API;
- feedbacks de interface.

Isso é conteúdo demais para uma turma que ainda está consolidando React, rotas, componentes e props.

A divisão sugerida é:

| Bloco | Tempo | Formato | Resultado esperado |
| --- | ---: | --- | --- |
| Parte 1 | 60 a 70 min | prática guiada | tela de detalhes com mock |
| Parte 2 | 20 a 30 min | demonstração | mapa mental da API |
| Próxima aula | 90 min | prática guiada | trocar mock por API |

## Resultado da primeira metade

Ao final da parte prática, o aluno deve conseguir abrir uma rota como:

```txt
/equipment/EQP-001
```

E visualizar:

- cabeçalho com nome, código e status;
- ações visuais de editar, alterar status e excluir;
- cards de resumo;
- informações gerais;
- observações;
- histórico recente.

Tudo ainda usando mock.

## Arquivos preparados

### Mock

```txt
src/features/equipment/mocks/equipment-details.mock.ts
```

Este arquivo simula o retorno futuro de:

```txt
GET /equipments/{equipmentId}
```

Ele contém:

- `equipmentDetailsMock`;
- `equipmentDetailSummaryMock`;
- `getEquipmentDetailSummary`;
- `findEquipmentDetailById`.

### Tipos

```txt
src/features/equipment/types/equipment.ts
```

Foram adicionados tipos para a tela de detalhes:

- `EquipmentResponsible`;
- `EquipmentHistoryItem`;
- `EquipmentDetail`;
- `EquipmentDetailSummary`.

### Página starter

```txt
src/features/equipment/pages/EquipmentDetailsPage/index.tsx
src/features/equipment/pages/EquipmentDetailsPage/styles.ts
```

A página ainda não está conectada. Ela existe para os alunos completarem em aula.

### Componentes visuais já preparados

```txt
src/features/equipment/components/DetailsHeader
src/features/equipment/components/DetailSummaryCards
src/features/equipment/components/EquipmentInfoCard
src/features/equipment/components/EquipmentNotesCard
src/features/equipment/components/EquipmentHistoryCard
```

Esses componentes já possuem estrutura e estilos. A aula fica centrada em:

- rota dinâmica;
- busca no mock;
- props;
- composição de página;
- ligação da tabela com a tela de detalhes.

## Pontos semi-prontos

| Arquivo | O que o aluno vai fazer |
| --- | --- |
| `src/app/routes.tsx` | Descomentar o import e a rota `/equipment/:equipmentId`. |
| `EquipmentPage/index.tsx` | Usar `useNavigate` e passar `onViewEquipment` para a tabela. |
| `EquipmentDetailsPage/index.tsx` | Ler `equipmentId`, buscar no mock e renderizar os blocos. |
| `EquipmentHistoryCard/index.tsx` | Observar o uso de `map` no histórico. |
| `README-api.md` | Entender qual endpoint alimenta cada parte do sistema. |

## Roteiro do professor

### 1. Abertura

Explique que a aula de hoje não é integração.

Frase sugerida:

> Hoje vamos construir a tela que depois vai receber os dados da API. Antes de trocar mock por API, precisamos entender qual dado a tela precisa.

### 2. Mostrar a listagem

Abra:

```txt
/equipment
```

Relembre:

- a tabela usa `equipmentMock`;
- cada linha tem um `id`;
- esse `id` vai virar parte da URL;
- a tela de detalhes vai depender desse `id`.

### 3. Explicar rota dinâmica

Mostre a diferença:

```txt
/equipment
/equipment/EQP-001
```

Conceito principal:

```txt
:equipmentId
```

O `:` indica que aquele pedaço da URL é variável.

### 4. Conectar a ação "Visualizar"

Na tabela, a ação `Visualizar` já está preparada para aparecer quando a página passar a prop `onViewEquipment`.

Esse é um bom momento para reforçar:

- componente filho não decide navegação;
- a página é dona do fluxo;
- a tabela só avisa que uma linha foi escolhida.

### 5. Completar a página de detalhes

Faça em partes:

1. importar `useParams`;
2. ler `equipmentId`;
3. buscar no mock;
4. lidar com equipamento não encontrado;
5. renderizar `DetailsHeader`;
6. renderizar `DetailSummaryCards`;
7. renderizar informações, observações e histórico.

### 6. Fechar a prática

Peça para abrirem:

```txt
/equipment/EQP-001
/equipment/EQP-042
/equipment/EQP-087
```

E observar que:

- a mesma página serve para vários equipamentos;
- o que muda é o `equipmentId`;
- depois a API vai substituir a função que busca no mock.

### 7. Segunda metade: leitura da API

Use:

```txt
README-api.md
```

Mostre:

- rotas de listagem;
- rotas de detalhe;
- rotas de catálogo;
- rotas de ação.

Não implemente `fetch`, `axios`, `React Query` ou `useMutation` nesta aula.

## O que não fazer hoje

Evite abrir estes tópicos como prática:

- `useQuery`;
- `useMutation`;
- invalidação de query;
- loading real de API;
- erro real de API;
- formulário conectado ao backend;
- CRUD persistente.

Eles continuam importantes, mas ficam para a próxima aula.

## Entrega mínima da aula

- Rota `/equipment/:equipmentId` funcionando.
- Ação `Visualizar` abrindo a tela de detalhes.
- Tela de detalhes renderizando dados mockados.
- Aluno entendendo qual endpoint vai substituir o mock.

## Próxima aula

Na próxima aula, a proposta é trocar:

```txt
findEquipmentDetailById(equipmentId)
```

por uma chamada real:

```txt
GET /equipments/{equipmentId}
```

E, depois, conectar:

- listagem;
- filtros;
- detalhes;
- criação;
- edição;
- alteração de status;
- exclusão.

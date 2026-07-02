# Aula 06 - Leitura da API

Este material é para a segunda metade da aula.

Hoje a API será apresentada, mas ainda não será integrada no frontend.

O objetivo é entender qual endpoint alimenta cada parte do sistema.

## Regra da aula

Hoje:

```txt
mock -> tela
```

Próxima aula:

```txt
API -> tela
```

## Mapa geral

| Parte da interface | Endpoint futuro |
| --- | --- |
| Tabela de equipamentos | `GET /equipments` |
| Tela de detalhes | `GET /equipments/{equipmentId}` |
| Modal de novo equipamento | `POST /equipments` |
| Modal de editar equipamento | `PUT /equipments/{equipmentId}` |
| Modal de alterar status | `PATCH /equipments/{equipmentId}/status` |
| Modal de excluir | `DELETE /equipments/{equipmentId}` |
| Select de tipo | `GET /equipment-types` |
| Select de status | `GET /equipment-statuses` |
| Select de localização | `GET /locations` |

## Endpoints de consulta

### GET /equipments

Alimenta a listagem principal.

No frontend, esta rota vai substituir:

```txt
equipmentMock
```

Ela deve retornar uma lista resumida de equipamentos.

Exemplo de resposta:

```json
[
  {
    "id": "EQP-001",
    "name": "Notebook Dell",
    "type": "Informática",
    "model": "Latitude 5420",
    "status": "Disponível",
    "location": "Lab 01",
    "lastUpdate": "24 Out 2023",
    "serialNumber": "DL-5420-2026"
  }
]
```

Campos usados na tabela:

- `id`;
- `name`;
- `type`;
- `model`;
- `status`;
- `location`;
- `lastUpdate`.

### GET /equipments/{equipmentId}

Alimenta a tela de detalhes.

No frontend, esta rota vai substituir:

```txt
findEquipmentDetailById(equipmentId)
```

Exemplo:

```txt
GET /equipments/EQP-001
```

Exemplo de resposta:

```json
{
  "id": "EQP-001",
  "name": "Notebook Dell",
  "type": "Informática",
  "model": "Latitude 5420",
  "status": "Disponível",
  "location": "Laboratório 01",
  "lastUpdate": "Hoje às 14:35",
  "serialNumber": "DL-5420-2026",
  "responsible": {
    "initials": "JS",
    "name": "João Silva"
  },
  "createdAt": "15/01/2023",
  "notes": "Equipamento disponível para uso em aulas práticas.",
  "history": [
    {
      "id": "history-001",
      "date": "24 Out 2023, 14:30",
      "title": "Status atualizado",
      "description": "Alterado de \"Em manutenção\" para \"Disponível\"."
    }
  ]
}
```

Campos usados na tela de detalhes:

- cabeçalho: `name`, `id`, `status`;
- cards: `status`, `location`, `responsible`, `lastUpdate`;
- informações gerais: `type`, `model`, `serialNumber`, `location`, `responsible`, `createdAt`, `lastUpdate`;
- observações: `notes`;
- histórico: `history`.

## Endpoints de catálogo

Catálogo é uma lista pequena usada para preencher selects.

### GET /equipment-types

Alimenta o select de tipo.

Exemplo de resposta:

```json
[
  "Informática",
  "Imagem",
  "Laboratório",
  "Rede",
  "Impressão"
]
```

No frontend, esta rota vai substituir:

```txt
typeOptions
```

### GET /equipment-statuses

Alimenta o select de status.

Exemplo de resposta:

```json
[
  "Disponível",
  "Em manutenção",
  "Inativo"
]
```

No frontend, esta rota vai substituir:

```txt
statusOptions
```

### GET /locations

Alimenta o select de localização.

Exemplo de resposta:

```json
[
  {
    "id": "LOC-001",
    "name": "Laboratório 01"
  },
  {
    "id": "LOC-002",
    "name": "Laboratório 02"
  }
]
```

No frontend, esta rota vai alimentar:

- filtros da listagem;
- modal de novo equipamento;
- modal de editar equipamento.

## Endpoints de ação

Estes endpoints mudam dados.

Na próxima aula, eles serão chamados com `mutation`.

### POST /equipments

Cria um equipamento.

Será usado no botão `Salvar` do modal `Novo equipamento`.

Exemplo de payload:

```json
{
  "name": "Notebook Dell",
  "type": "Informática",
  "model": "Latitude 5420",
  "serialNumber": "DL-5420-2026",
  "status": "Disponível",
  "locationId": "LOC-001",
  "notes": "Equipamento disponível para aulas práticas."
}
```

Depois de criar, a listagem precisa ser atualizada.

### PUT /equipments/{equipmentId}

Edita um equipamento.

Exemplo:

```txt
PUT /equipments/EQP-001
```

Será usado no botão `Salvar` do modal `Editar equipamento`.

Exemplo de payload:

```json
{
  "name": "Notebook Dell",
  "type": "Informática",
  "model": "Latitude 5420",
  "serialNumber": "DL-5420-2026",
  "status": "Disponível",
  "locationId": "LOC-001",
  "notes": "Equipamento revisado recentemente."
}
```

Depois de editar, duas telas podem precisar atualizar:

- listagem;
- detalhes.

### PATCH /equipments/{equipmentId}/status

Altera apenas o status.

Exemplo:

```txt
PATCH /equipments/EQP-001/status
```

Exemplo de payload:

```json
{
  "status": "Em manutenção"
}
```

Será usado no modal `Alterar status`.

### DELETE /equipments/{equipmentId}

Exclui um equipamento.

Exemplo:

```txt
DELETE /equipments/EQP-001
```

Será usado no modal `Excluir equipamento`.

Depois de excluir:

- a listagem precisa atualizar;
- se o usuário estiver na tela de detalhes, ele deve voltar para `/equipment`.

## Como pensar na integração da próxima aula

Hoje usamos:

```txt
src/features/equipment/mocks
```

Na próxima aula, vamos criar uma camada parecida com:

```txt
src/features/equipment/services
```

Ela pode concentrar funções como:

```ts
listEquipments()
getEquipmentById(equipmentId)
createEquipment(payload)
updateEquipment(equipmentId, payload)
deleteEquipment(equipmentId)
updateEquipmentStatus(equipmentId, payload)
```

Depois, a tela chama essas funções usando hooks.

## Perguntas para conferir entendimento

1. Qual endpoint alimenta a tabela?
2. Qual endpoint alimenta a tela de detalhes?
3. Qual endpoint alimenta o select de tipo?
4. Qual endpoint é usado quando o usuário clica em excluir?
5. Depois de criar ou excluir um equipamento, por que a listagem precisa ser atualizada?

## Fechamento

O ponto principal da Aula 06 é entender este caminho:

```txt
URL -> equipmentId -> busca de dados -> componentes -> tela
```

Na próxima aula, a busca de dados deixa de vir do mock e passa a vir da API.

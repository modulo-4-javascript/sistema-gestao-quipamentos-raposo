# Histórico e status

Histórico é a lista de eventos importantes que aconteceram com um equipamento. Ele
ajuda a responder perguntas como: quando o equipamento mudou de status, quando entrou
em um laboratório e quando saiu de uma localização.

O histórico de um equipamento mostra eventos de um único item. O histórico de uma
localização mostra eventos de vários equipamentos relacionados a esse local.

Status indica a situação atual. Equipamentos podem ficar `AVAILABLE`,
`IN_MAINTENANCE` ou `INACTIVE`. Localizações podem ficar `ACTIVE` ou `INACTIVE`.

O endpoint `PATCH /status` é separado do `PUT` porque mudar status é uma ação
específica. Isso deixa a intenção clara e facilita criar um item de histórico sempre
que o status muda.

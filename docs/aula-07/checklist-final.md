# Aula 07 - Checklist final

## O que precisa funcionar no fim da aula

- [ ] Backend rodando localmente.
- [ ] Swagger acessível em `http://localhost:3000/docs`.
- [ ] Frontend rodando em `http://localhost:5173/equipment`.
- [ ] Frontend configurado com `VITE_API_URL=/api/v1`.
- [ ] Proxy do Vite apontando para a porta correta do backend.
- [ ] Listagem de equipamentos carregando da API.
- [ ] Cards de resumo carregando da API.
- [ ] Loading aparecendo durante carregamento.
- [ ] Mensagem de erro aparecendo quando a API falha.
- [ ] Estado vazio aparecendo quando não há resultados.
- [ ] Filtros de busca, status e tipo enviando query para a API.
- [ ] Ação `Visualizar` abrindo `/equipment/:equipmentId`.
- [ ] Tela de detalhes buscando o equipamento pelo ID da rota.
- [ ] Modal de criação chamando `POST /equipment`.
- [ ] Modal de edição chamando `PUT /equipment/:equipmentId`.
- [ ] Modal de status chamando `PATCH /equipment/:equipmentId/status`.
- [ ] Listagem ou detalhe atualizando depois de criar, editar ou alterar status.

## O que os alunos precisam entender

- [ ] Diferença entre mock e API real.
- [ ] O que é URL base da API.
- [ ] O que é `GET`, `POST`, `PUT` e `PATCH`.
- [ ] Por que existe uma camada de service.
- [ ] Por que usamos types/interfaces.
- [ ] Como `useEffect` dispara uma busca inicial.
- [ ] Como loading, erro e estado vazio melhoram a experiência.
- [ ] Como valores de formulário viram payload.
- [ ] Por que a API usa enums técnicos e a tela usa labels amigáveis.
- [ ] Como repetir o padrão em outro módulo.

## O que será cobrado no Projeto Final

- [ ] Criar types de Localizações compatíveis com a API.
- [ ] Criar service de Localizações.
- [ ] Integrar listagem de localizações.
- [ ] Integrar detalhe de localização.
- [ ] Criar modal de criação.
- [ ] Criar modal de edição.
- [ ] Integrar alteração de status, quando aplicável.
- [ ] Tratar loading.
- [ ] Tratar erro.
- [ ] Tratar estado vazio.
- [ ] Manter organização por feature.
- [ ] Preservar estilo visual do projeto.
- [ ] Não duplicar lógica sem necessidade.
- [ ] Explicar brevemente o fluxo implementado.

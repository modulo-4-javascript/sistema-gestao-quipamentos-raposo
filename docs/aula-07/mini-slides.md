# Mini-slides - Aula 07

## Slide 1 - Aula 07: Integração com Backend

Objetivo: apresentar o foco da aula.

Tópicos:

- sair dos mocks;
- conectar com API;
- preparar o Projeto Final.

Sugestão visual: diagrama simples de tela conectada ao backend.

Fala curta: "Hoje a aplicação começa a conversar com o backend de verdade."

## Slide 2 - O que já temos até agora

Objetivo: relembrar a base da Aula 06.

Tópicos:

- layout;
- listagem visual;
- rota de detalhes;
- mocks.

Sugestão visual: print da tela de equipamentos.

Fala curta: "A interface já existe; agora vamos trocar a fonte dos dados."

## Slide 3 - O que muda quando conectamos com API

Objetivo: explicar a mudança de responsabilidade.

Tópicos:

- mock vive no frontend;
- API vive no backend;
- rede pode carregar ou falhar.

Sugestão visual: antes/depois com mock e API.

Fala curta: "Com API, a tela precisa lidar com espera, erro e resposta real."

## Slide 4 - Fluxo frontend -> service -> backend -> tela

Objetivo: fixar o fluxo mental.

Tópicos:

- componente dispara ação;
- service chama endpoint;
- backend devolve JSON;
- estado atualiza tela.

Sugestão visual: seta em quatro etapas.

Fala curta: "O service é a ponte entre clique, HTTP e estado."

## Slide 5 - Listagem de equipamentos

Objetivo: mostrar o primeiro GET.

Tópicos:

- `GET /equipment`;
- `data`;
- loading;
- vazio;
- filtros.

Sugestão visual: tabela com spinner.

Fala curta: "A tabela deixa de ler array local e passa a ler resposta da API."

## Slide 6 - Detalhe do equipamento

Objetivo: conectar rota dinâmica com API.

Tópicos:

- `useParams`;
- UUID;
- `GET /equipment/:equipmentId`;
- histórico recente.

Sugestão visual: URL destacando o ID.

Fala curta: "O ID da rota vira o parâmetro da busca no backend."

## Slide 7 - Modal de criação

Objetivo: explicar POST.

Tópicos:

- formulário;
- validação;
- payload;
- `POST /equipment`;
- recarregar listagem.

Sugestão visual: formulário apontando para JSON.

Fala curta: "O formulário não salva sozinho; ele entrega valores para o service."

## Slide 8 - Modal de edição

Objetivo: explicar PUT.

Tópicos:

- dados atuais;
- campos preenchidos;
- payload de atualização;
- `PUT /equipment/:equipmentId`.

Sugestão visual: modal antes/depois.

Fala curta: "Editar é abrir com dados existentes e enviar a nova versão."

## Slide 9 - Alteração de status

Objetivo: explicar PATCH.

Tópicos:

- atualização parcial;
- status técnico;
- label em português;
- observação opcional.

Sugestão visual: badge mudando de status.

Fala curta: "PATCH muda uma parte do recurso, não o recurso inteiro."

## Slide 10 - Erros, loading e estado vazio

Objetivo: mostrar feedbacks obrigatórios.

Tópicos:

- API fora do ar;
- demora de rede;
- lista sem resultados;
- mensagem simples.

Sugestão visual: três estados lado a lado.

Fala curta: "Integração boa também pensa no que acontece quando nada vem ou algo falha."

## Slide 11 - Como isso prepara o projeto final

Objetivo: conectar aula e avaliação.

Tópicos:

- Equipamentos como referência;
- Localizações como desafio;
- mesmo padrão, outro domínio.

Sugestão visual: duas colunas, Equipamentos e Localizações.

Fala curta: "O projeto final é aplicar o mesmo raciocínio com mais autonomia."

## Slide 12 - Desafio: módulo de Localizações

Objetivo: apresentar a atividade.

Tópicos:

- criar types;
- criar service;
- integrar telas;
- tratar loading, erro e vazio;
- preservar padrão visual.

Sugestão visual: checklist de entrega.

Fala curta: "Quem entender o fluxo de Equipamentos consegue construir Localizações."

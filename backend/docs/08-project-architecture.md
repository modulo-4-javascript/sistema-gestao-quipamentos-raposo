# Arquitetura do projeto

O projeto usa organização feature-based. Isso significa que arquivos de um mesmo
domínio ficam próximos: equipamentos em `features/equipment`, localizações em
`features/locations` e histórico em `features/history`.

Routes definem os caminhos HTTP. Controllers recebem a request, chamam services e
retornam a response. Services concentram regras de negócio, como impedir exclusão de
localização com equipamento vinculado. Repositories cuidam do acesso aos dados, mesmo
quando os dados estão em memória durante testes ou no PostgreSQL durante a execução
local com Docker.

Schemas Zod validam params, query e body antes de o controller chamar o service.

Essa separação segue a ideia de responsabilidade única do SOLID: cada arquivo tem um
motivo claro para mudar. Em projetos maiores, isso facilita testes, manutenção e a
troca do armazenamento em memória por banco de dados.

Para facilitar a aula, os scripts `start.sh` e `start.bat` sobem o banco PostgreSQL
com Docker, executam a API e mostram no terminal as URLs e credenciais necessárias.

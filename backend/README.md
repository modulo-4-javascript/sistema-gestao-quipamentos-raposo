# DenkenHub Resource API

API didática em Node.js, TypeScript, Express, Zod e PostgreSQL para gestão de
equipamentos, localizações e histórico.

## Como rodar do jeito mais simples

No macOS/Linux:

```sh
./start.sh
```

No Windows:

```bat
start.bat
```

O script tenta instalar as dependências quando necessário, sobe um PostgreSQL local
com Docker, espera o banco ficar pronto e inicia a API.

Ao executar, o script lê o `.env` se ele já existir. Se a porta da API ou do
PostgreSQL estiver ocupada, ele procura automaticamente uma porta livre próxima e
atualiza o `.env` com `PORT`, `POSTGRES_PORT` e `DATABASE_URL`.

No macOS/Linux, o `start.sh` tenta usar Homebrew, apt, dnf, yum, pacman ou apk,
dependendo do sistema. No Windows, o `start.bat` tenta usar `winget` para instalar
Node.js LTS e Docker Desktop. Em alguns computadores, o Docker Desktop pode pedir
permissão, reinicialização ou que o aplicativo seja aberto uma vez.

Ao iniciar, o terminal mostra:

- URL da API: `http://localhost:3000/api/v1`
- URL da documentação Swagger: `http://localhost:3000/docs`
- URL do OpenAPI YAML: `http://localhost:3000/docs/openapi.yaml`
- Banco padrão: `postgresql://localhost:15432/denkenhub`
- Usuário: `denkenhub`
- Senha: `denkenhub123`

Por padrão a API tenta usar a porta `3000` e o PostgreSQL tenta usar a porta
`15432`, mas os scripts ajustam esses valores automaticamente quando encontram
conflito.

## Requisitos

- Node.js LTS;
- npm;
- Docker Desktop.

## Comandos úteis

```sh
npm test
npm run build
npm run lint
npm run db:up
npm run db:down
```

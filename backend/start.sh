#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

load_env_file() {
  if [ -f ".env" ]; then
    set -a
    # shellcheck disable=SC1091
    . ./.env
    set +a
  fi
}

load_env_file

PORT="${PORT:-3000}"
POSTGRES_DB="${POSTGRES_DB:-denkenhub}"
POSTGRES_USER="${POSTGRES_USER:-denkenhub}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-denkenhub123}"
POSTGRES_PORT="${POSTGRES_PORT:-15432}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}}"

export PORT
export POSTGRES_DB
export POSTGRES_USER
export POSTGRES_PASSWORD
export POSTGRES_PORT
export DATABASE_URL

DOCKER_CMD=()
COMPOSE=()

refresh_database_url() {
  DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"

  export PORT
  export POSTGRES_DB
  export POSTGRES_USER
  export POSTGRES_PASSWORD
  export POSTGRES_PORT
  export DATABASE_URL
}

write_env_file() {
  refresh_database_url
  node scripts/write-env.mjs
}

run_admin() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1; then
    sudo "$@"
  else
    echo "Preciso de permissao de administrador para instalar: $*"
    echo "Instale manualmente e rode este script de novo."
    exit 1
  fi
}

install_with_package_manager() {
  local package_name="$1"
  shift

  if [[ "$(uname -s)" == "Darwin" ]]; then
    if command -v brew >/dev/null 2>&1; then
      brew install "$@"
      return
    fi

    echo "Homebrew nao encontrado. Instale em https://brew.sh/ e rode este script de novo."
    exit 1
  fi

  if command -v apt-get >/dev/null 2>&1; then
    run_admin apt-get update
    run_admin apt-get install -y "$@"
  elif command -v dnf >/dev/null 2>&1; then
    run_admin dnf install -y "$@"
  elif command -v yum >/dev/null 2>&1; then
    run_admin yum install -y "$@"
  elif command -v pacman >/dev/null 2>&1; then
    run_admin pacman -Sy --noconfirm "$@"
  elif command -v apk >/dev/null 2>&1; then
    run_admin apk add --no-cache "$@"
  else
    echo "Nao encontrei um gerenciador de pacotes suportado para instalar ${package_name}."
    echo "Instale manualmente e rode este script de novo."
    exit 1
  fi
}

install_node() {
  echo "Node.js/npm nao encontrado. Tentando instalar Node.js LTS..."

  if [[ "$(uname -s)" == "Darwin" ]]; then
    install_with_package_manager "Node.js" node
  elif command -v apt-get >/dev/null 2>&1; then
    run_admin apt-get update
    run_admin apt-get install -y ca-certificates curl
    curl -fsSL https://deb.nodesource.com/setup_22.x | run_admin bash -
    run_admin apt-get install -y nodejs
  elif command -v dnf >/dev/null 2>&1; then
    run_admin dnf install -y curl
    curl -fsSL https://rpm.nodesource.com/setup_22.x | run_admin bash -
    run_admin dnf install -y nodejs
  elif command -v yum >/dev/null 2>&1; then
    run_admin yum install -y curl
    curl -fsSL https://rpm.nodesource.com/setup_22.x | run_admin bash -
    run_admin yum install -y nodejs
  elif command -v pacman >/dev/null 2>&1; then
    run_admin pacman -Sy --noconfirm nodejs npm
  elif command -v apk >/dev/null 2>&1; then
    run_admin apk add --no-cache nodejs npm
  else
    echo "Nao consegui instalar Node.js automaticamente neste sistema."
    echo "Instale o Node.js LTS em https://nodejs.org/ e rode este script de novo."
    exit 1
  fi
}

node_major_version() {
  if command -v node >/dev/null 2>&1; then
    node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0
  else
    echo 0
  fi
}

port_is_free() {
  node -e "
    const net = require('node:net');
    const port = Number(process.argv[1]);
    const server = net.createServer();
    server.once('error', () => process.exit(1));
    server.once('listening', () => server.close(() => process.exit(0)));
    server.listen(port);
  " "$1"
}

ensure_free_api_port() {
  local initial_port="$PORT"

  for offset in {0..30}; do
    local candidate=$((initial_port + offset))

    if port_is_free "$candidate"; then
      if [ "$candidate" -ne "$initial_port" ]; then
        echo "Porta ${initial_port} ocupada. Usando porta ${candidate} para a API."
      fi

      PORT="$candidate"
      export PORT
      return
    fi
  done

  echo "Nao encontrei uma porta livre para a API entre ${initial_port} e $((initial_port + 30))."
  exit 1
}

published_postgres_port() {
  local published

  published="$("${COMPOSE[@]}" port postgres 5432 2>/dev/null | tail -n 1 || true)"

  if [ -z "$published" ]; then
    return 1
  fi

  echo "${published##*:}"
}

ensure_free_postgres_port() {
  local current_port

  if current_port="$(published_postgres_port)" && [ -n "$current_port" ]; then
    if [ "$current_port" != "$POSTGRES_PORT" ]; then
      echo "PostgreSQL do projeto ja esta usando a porta ${current_port}. Atualizando .env."
    fi

    POSTGRES_PORT="$current_port"
    refresh_database_url
    return
  fi

  local initial_port="$POSTGRES_PORT"

  for offset in {0..30}; do
    local candidate=$((initial_port + offset))

    if port_is_free "$candidate"; then
      if [ "$candidate" -ne "$initial_port" ]; then
        echo "Porta ${initial_port} ocupada. Usando porta ${candidate} para o PostgreSQL."
      fi

      POSTGRES_PORT="$candidate"
      refresh_database_url
      return
    fi
  done

  echo "Nao encontrei uma porta livre para o PostgreSQL entre ${initial_port} e $((initial_port + 30))."
  exit 1
}

ensure_node() {
  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    install_node
  elif [ "$(node_major_version)" -lt 20 ]; then
    echo "Node.js 20+ e necessario. Versao atual: $(node -v). Tentando atualizar..."
    install_node
  fi

  if ! command -v npm >/dev/null 2>&1 || [ "$(node_major_version)" -lt 20 ]; then
    echo "Nao consegui deixar o Node.js na versao 20 ou superior automaticamente."
    echo "Instale o Node.js LTS em https://nodejs.org/ e rode este script de novo."
    exit 1
  fi
}

install_docker() {
  echo "Docker nao encontrado. Tentando instalar Docker..."

  if [[ "$(uname -s)" == "Darwin" ]]; then
    if command -v brew >/dev/null 2>&1; then
      brew install --cask docker
      open -a Docker >/dev/null 2>&1 || true
      return
    fi

    echo "Homebrew nao encontrado. Instale o Docker Desktop em https://www.docker.com/products/docker-desktop/"
    echo "Depois rode este script de novo."
    exit 1
  fi

  if command -v apt-get >/dev/null 2>&1; then
    run_admin apt-get update
    run_admin apt-get install -y docker.io docker-compose-plugin
  elif command -v dnf >/dev/null 2>&1; then
    run_admin dnf install -y docker docker-compose-plugin
  elif command -v yum >/dev/null 2>&1; then
    run_admin yum install -y docker docker-compose-plugin
  elif command -v pacman >/dev/null 2>&1; then
    run_admin pacman -Sy --noconfirm docker docker-compose
  elif command -v apk >/dev/null 2>&1; then
    run_admin apk add --no-cache docker docker-cli-compose
  else
    echo "Nao consegui instalar Docker automaticamente neste sistema."
    echo "Instale o Docker Desktop em https://www.docker.com/products/docker-desktop/ e rode este script de novo."
    exit 1
  fi

  if command -v systemctl >/dev/null 2>&1; then
    run_admin systemctl enable --now docker || true
  elif command -v service >/dev/null 2>&1; then
    run_admin service docker start || true
  fi
}

install_compose_plugin() {
  echo "Docker Compose nao encontrado. Tentando instalar o plugin..."

  if [[ "$(uname -s)" == "Darwin" ]]; then
    echo "No macOS, o Docker Compose vem com o Docker Desktop."
    echo "Abra o Docker Desktop e rode este script de novo."
    exit 1
  elif command -v apt-get >/dev/null 2>&1; then
    run_admin apt-get update
    run_admin apt-get install -y docker-compose-plugin
  elif command -v dnf >/dev/null 2>&1; then
    run_admin dnf install -y docker-compose-plugin
  elif command -v yum >/dev/null 2>&1; then
    run_admin yum install -y docker-compose-plugin
  elif command -v pacman >/dev/null 2>&1; then
    run_admin pacman -Sy --noconfirm docker-compose
  elif command -v apk >/dev/null 2>&1; then
    run_admin apk add --no-cache docker-cli-compose
  else
    echo "Nao consegui instalar Docker Compose automaticamente neste sistema."
    exit 1
  fi
}

detect_docker_command() {
  if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    DOCKER_CMD=(docker)
    return 0
  fi

  if command -v sudo >/dev/null 2>&1 && command -v docker >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD=(sudo docker)
    return 0
  fi

  return 1
}

start_docker_if_needed() {
  if detect_docker_command; then
    return
  fi

  if [[ "$(uname -s)" == "Darwin" ]]; then
    echo "Abrindo Docker Desktop..."
    open -a Docker >/dev/null 2>&1 || true
  elif command -v systemctl >/dev/null 2>&1; then
    run_admin systemctl start docker || true
  elif command -v service >/dev/null 2>&1; then
    run_admin service docker start || true
  fi

  echo "Aguardando o Docker iniciar..."
  for _attempt in {1..60}; do
    if detect_docker_command; then
      return
    fi
    sleep 2
  done

  echo "Docker foi instalado/encontrado, mas nao iniciou a tempo."
  echo "Abra o Docker Desktop ou inicie o servico Docker e rode este script de novo."
  exit 1
}

detect_compose_command() {
  if "${DOCKER_CMD[@]}" compose version >/dev/null 2>&1; then
    COMPOSE=("${DOCKER_CMD[@]}" compose)
    return 0
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE=(docker-compose)
    return 0
  fi

  return 1
}

ensure_node
ensure_free_api_port

if ! command -v docker >/dev/null 2>&1; then
  install_docker
fi

start_docker_if_needed

if ! detect_compose_command; then
  install_compose_plugin
  start_docker_if_needed

  if ! detect_compose_command; then
    echo "Docker Compose ainda nao esta disponivel."
    echo "Instale/atualize o Docker Desktop e rode este script de novo."
    exit 1
  fi
fi

ensure_free_postgres_port
write_env_file

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias Node do projeto..."
  npm install
fi

echo "Iniciando PostgreSQL local com Docker..."
"${COMPOSE[@]}" up -d postgres

echo "Aguardando o banco aceitar conexoes..."
for attempt in {1..30}; do
  if "${COMPOSE[@]}" exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
    break
  fi

  if [ "$attempt" -eq 30 ]; then
    echo "PostgreSQL nao ficou pronto a tempo. Veja os logs com: ${COMPOSE[*]} logs postgres"
    exit 1
  fi

  sleep 2
done

echo
echo "DenkenHub pronto para a aula"
echo "API:        http://localhost:${PORT}/api/v1"
echo "Docs:       http://localhost:${PORT}/docs"
echo "OpenAPI:    http://localhost:${PORT}/docs/openapi.yaml"
echo "Banco:      postgresql://localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
echo "Usuario:    ${POSTGRES_USER}"
echo "Senha:      ${POSTGRES_PASSWORD}"
echo
echo "Pressione Ctrl+C para parar a API. O banco continua rodando no Docker."
echo

npm run dev

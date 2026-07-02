@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"

if exist ".env" call :LoadEnvFile

if "%PORT%"=="" set "PORT=3000"
if "%POSTGRES_DB%"=="" set "POSTGRES_DB=denkenhub"
if "%POSTGRES_USER%"=="" set "POSTGRES_USER=denkenhub"
if "%POSTGRES_PASSWORD%"=="" set "POSTGRES_PASSWORD=denkenhub123"
if "%POSTGRES_PORT%"=="" set "POSTGRES_PORT=15432"
call :RefreshDatabaseUrl

call :EnsureNpm
if errorlevel 1 exit /b 1

call :EnsureFreeApiPort
if errorlevel 1 exit /b 1

call :EnsureDocker
if errorlevel 1 exit /b 1

call :EnsureCompose
if errorlevel 1 exit /b 1

call :EnsureFreePostgresPort
if errorlevel 1 exit /b 1

call :WriteEnvFile
if errorlevel 1 exit /b 1

if not exist "node_modules" (
  echo Instalando dependencias Node do projeto...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Iniciando PostgreSQL local com Docker...
%COMPOSE% up -d postgres
if errorlevel 1 exit /b 1

echo Aguardando o banco aceitar conexoes...
for /l %%i in (1,1,30) do (
  %COMPOSE% exec -T postgres pg_isready -U %POSTGRES_USER% -d %POSTGRES_DB% >nul 2>nul
  if not errorlevel 1 goto db_ready
  timeout /t 2 /nobreak >nul
)

echo PostgreSQL nao ficou pronto a tempo. Veja os logs com: %COMPOSE% logs postgres
exit /b 1

:db_ready
echo.
echo DenkenHub pronto para a aula
echo API:        http://localhost:%PORT%/api/v1
echo Docs:       http://localhost:%PORT%/docs
echo OpenAPI:    http://localhost:%PORT%/docs/openapi.yaml
echo Banco:      postgresql://localhost:%POSTGRES_PORT%/%POSTGRES_DB%
echo Usuario:    %POSTGRES_USER%
echo Senha:      %POSTGRES_PASSWORD%
echo.
echo Pressione Ctrl+C para parar a API. O banco continua rodando no Docker.
echo.

call npm run dev
exit /b %ERRORLEVEL%

:LoadEnvFile
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
  if not "%%A"=="" (
    if not defined %%A set "%%A=%%B"
  )
)
exit /b 0

:RefreshDatabaseUrl
set "DATABASE_URL=postgresql://%POSTGRES_USER%:%POSTGRES_PASSWORD%@localhost:%POSTGRES_PORT%/%POSTGRES_DB%"
exit /b 0

:EnsureNpm
where node >nul 2>nul
if errorlevel 1 goto install_node

where npm >nul 2>nul
if errorlevel 1 goto install_node

set "NODE_MAJOR=0"
for /f %%v in ('node -p "process.versions.node.split('.')[0]" 2^>nul') do set "NODE_MAJOR=%%v"
if %NODE_MAJOR% LSS 20 (
  echo Node.js 20+ e necessario. Tentando atualizar Node.js LTS com winget...
  goto install_node
)

exit /b 0

:install_node
echo Node.js/npm nao encontrado. Tentando instalar Node.js LTS com winget...
call :RequireWinget
if errorlevel 1 exit /b 1

winget upgrade -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
if errorlevel 1 (
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo Nao consegui instalar Node.js automaticamente.
    echo Instale em https://nodejs.org/ e execute este script novamente.
    exit /b 1
  )
)

call :RefreshPath
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js foi instalado, mas o npm ainda nao apareceu neste terminal.
  echo Feche e abra o terminal, depois execute start.bat novamente.
  exit /b 1
)

set "NODE_MAJOR=0"
for /f %%v in ('node -p "process.versions.node.split('.')[0]" 2^>nul') do set "NODE_MAJOR=%%v"
if %NODE_MAJOR% LSS 20 (
  echo Node.js instalado, mas a versao ainda e menor que 20.
  echo Feche e abra o terminal, ou instale o Node.js LTS em https://nodejs.org/.
  exit /b 1
)

exit /b 0

:EnsureFreeApiPort
set /a "INITIAL_PORT=%PORT%"
set /a "FINAL_PORT=%INITIAL_PORT%+30"

for /l %%i in (0,1,30) do (
  set /a "CANDIDATE=%INITIAL_PORT%+%%i"
  call :IsPortFree
  if not errorlevel 1 (
    if not "!CANDIDATE!"=="%INITIAL_PORT%" echo Porta %INITIAL_PORT% ocupada. Usando porta !CANDIDATE! para a API.
    set "PORT=!CANDIDATE!"
    exit /b 0
  )
)

echo Nao encontrei uma porta livre para a API entre %INITIAL_PORT% e %FINAL_PORT%.
exit /b 1

:EnsureFreePostgresPort
set "PUBLISHED_POSTGRES="
set "RUNNING_POSTGRES_PORT="
for /f "usebackq tokens=*" %%p in (`%COMPOSE% port postgres 5432 2^>nul`) do set "PUBLISHED_POSTGRES=%%p"

if defined PUBLISHED_POSTGRES (
  call :ParsePublishedPostgresPort
)

if defined RUNNING_POSTGRES_PORT (
  if not "!RUNNING_POSTGRES_PORT!"=="%POSTGRES_PORT%" echo PostgreSQL do projeto ja esta usando a porta !RUNNING_POSTGRES_PORT!. Atualizando .env.
  set "POSTGRES_PORT=!RUNNING_POSTGRES_PORT!"
  call :RefreshDatabaseUrl
  exit /b 0
)

set /a "INITIAL_PORT=%POSTGRES_PORT%"
set /a "FINAL_PORT=%INITIAL_PORT%+30"

for /l %%i in (0,1,30) do (
  set /a "CANDIDATE=%INITIAL_PORT%+%%i"
  call :IsPortFree
  if not errorlevel 1 (
    if not "!CANDIDATE!"=="%INITIAL_PORT%" echo Porta %INITIAL_PORT% ocupada. Usando porta !CANDIDATE! para o PostgreSQL.
    set "POSTGRES_PORT=!CANDIDATE!"
    call :RefreshDatabaseUrl
    exit /b 0
  )
)

echo Nao encontrei uma porta livre para o PostgreSQL entre %INITIAL_PORT% e %FINAL_PORT%.
exit /b 1

:IsPortFree
node -e "const net=require('node:net');const port=Number(process.argv[1]);const server=net.createServer();server.once('error',()=>process.exit(1));server.once('listening',()=>server.close(()=>process.exit(0)));server.listen(port);" %CANDIDATE%
exit /b %ERRORLEVEL%

:ParsePublishedPostgresPort
for /f "tokens=1-4 delims=:" %%A in ("%PUBLISHED_POSTGRES%") do (
  if not "%%D"=="" (
    set "RUNNING_POSTGRES_PORT=%%D"
  ) else if not "%%C"=="" (
    set "RUNNING_POSTGRES_PORT=%%C"
  ) else (
    set "RUNNING_POSTGRES_PORT=%%B"
  )
)
exit /b 0

:WriteEnvFile
node scripts/write-env.mjs
exit /b %ERRORLEVEL%

:EnsureDocker
where docker >nul 2>nul
if errorlevel 1 (
  echo Docker nao encontrado. Tentando instalar Docker Desktop com winget...
  call :RequireWinget
  if errorlevel 1 exit /b 1

  winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo Nao consegui instalar Docker Desktop automaticamente.
    echo Instale em https://www.docker.com/products/docker-desktop/ e execute este script novamente.
    exit /b 1
  )

  call :RefreshPath
)

docker info >nul 2>nul
if not errorlevel 1 exit /b 0

echo Docker instalado, mas ainda nao esta rodando. Tentando abrir Docker Desktop...
call :StartDockerDesktop

echo Aguardando o Docker iniciar...
for /l %%i in (1,1,60) do (
  docker info >nul 2>nul
  if not errorlevel 1 exit /b 0
  timeout /t 2 /nobreak >nul
)

echo Docker nao iniciou a tempo.
echo Abra o Docker Desktop, aguarde ele ficar pronto e execute start.bat novamente.
exit /b 1

:EnsureCompose
docker compose version >nul 2>nul
if not errorlevel 1 (
  set "COMPOSE=docker compose"
  exit /b 0
)

where docker-compose >nul 2>nul
if not errorlevel 1 (
  set "COMPOSE=docker-compose"
  exit /b 0
)

echo Docker Compose nao encontrado.
echo No Windows, ele vem com o Docker Desktop. Atualize ou reinstale o Docker Desktop e execute este script novamente.
exit /b 1

:RequireWinget
where winget >nul 2>nul
if not errorlevel 1 exit /b 0

echo winget nao esta disponivel neste Windows.
echo Instale o App Installer pela Microsoft Store ou instale as dependencias manualmente.
exit /b 1

:RefreshPath
set "MACHINE_PATH="
set "USER_PATH="
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "MACHINE_PATH=%%B"
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%B"
if defined MACHINE_PATH set "PATH=%MACHINE_PATH%;%PATH%"
if defined USER_PATH set "PATH=%USER_PATH%;%PATH%"
exit /b 0

:StartDockerDesktop
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
  start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
  exit /b 0
)

if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
  start "" "%LocalAppData%\Docker\Docker Desktop.exe"
  exit /b 0
)

start "" "Docker Desktop"
exit /b 0

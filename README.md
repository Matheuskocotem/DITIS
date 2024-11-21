## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## Instruções de Execução

### Execução Inicial

Antes de executar o projeto pela primeira vez, siga os passos abaixo:

1. **Parar e Remover Contêineres Existentes:**

   Execute os seguintes comandos para parar e remover todos os contêineres em execução:

   ```bash
   docker stop $(docker ps -qa)
   docker rm $(docker ps -qa)
   ```

2. **Criar o Arquivo `.env`:**

   Na pasta `/src`, crie um arquivo chamado `.env` e copie o conteúdo do arquivo `.env.example` para ele.

3. **Executar os Contêineres:**

   Execute o seguinte comando para construir e iniciar os contêineres:

   ```bash
   docker compose up --build -d
   ```

4. **Executar o Composer e Gerar Chave:**

   Em um novo terminal, execute os seguintes comandos:

   ```bash
   docker compose run --rm composer update
   docker compose run --rm artisan key:generate
   ```

5. **Migrar o Banco de Dados:**

   Execute o comando abaixo para criar o banco de dados:

   ```bash
   docker compose run --rm artisan migrate
   ```

### Comandos Úteis

- Para usar o Docker:

  ```bash
  docker compose up --build
  ```

- Para instalar um pacote no frontend:

  ```bash
  docker compose run --rm npm <COMANDO>
  ```

- Para executar comandos do PHP Artisan:

  ```bash
  docker compose run --rm artisan <COMANDO>
  ```

- Para executar comandos do Composer:

  ```bash
  docker compose run --rm composer <COMANDO>
  ```

## Observações

- Sempre que executar comandos do Docker, é necessário estar na mesma pasta que contém o arquivo `docker-compose.yml` (neste caso, a pasta raiz).
- É recomendado utilizar a imagem do Docker para aqueles que estiverem em ambiente Linux.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.



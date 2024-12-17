## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

## Instruções de Execução

### Execução Inicial

Antes de executar o projeto pela primeira vez, siga os passos abaixo:

1. **Criar os Arquivos `.env`:**

   Na pasta `/src/backend`, crie um arquivo chamado `.env` e copie o conteúdo do arquivo `.env.example` para ele. Repita o mesmo processo na pasta `/src/frontend`, criando o arquivo `.env` com o conteúdo de `.env.example`.

2. **Atualizar Dependências do Backend:**

   Execute o seguinte comando para instalar as dependências do backend:

   ```bash
   docker compose run --rm composer update

3. **Gerar a Chave do Backend:**
   Execute o comando abaixo para gerar a chave de aplicação do backend:
   ```bash
   docker compose run --rm artisan key:generate

4. **Migrar o Banco de Dados:**
   Execute o comando abaixo para criar o banco de dados:
   ```bash
    docker compose run --rm artisan migrate

5. **Executar os Contêiners:**
   Por fim, execute o seguinte comando para construir e iniciar os contêineres:
   ```bash
   docker compose up --build -d

   




   
    

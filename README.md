Pré-requisitos

Docker instalado

Docker Compose instalado

Instruções de Execução

Execução Inicial

Antes de executar o projeto pela primeira vez, siga os passos abaixo:

Criar os Arquivos .env:

Na pasta /src/backend, crie um arquivo chamado .env e copie o conteúdo do arquivo .env.example para ele. Repita o mesmo processo na pasta /src/frontend, criando o arquivo .env com o conteúdo de .env.example.

Atualizar Dependências do Backend:

Execute o seguinte comando para instalar as dependências do backend:

docker compose run --rm composer update

Gerar a Chave do Backend:

Execute o comando abaixo para gerar a chave de aplicação do backend:

docker compose run --rm artisan key:generate

Migrar o Banco de Dados:

Execute o comando abaixo para criar o banco de dados:

docker compose run --rm artisan migrate

Executar os Contêineres:

Por fim, execute o seguinte comando para construir e iniciar os contêineres:

docker compose up --build -d

Comandos Úteis

Para usar o Docker:

docker compose up --build

Para instalar um pacote no frontend:

docker compose run --rm npm <COMANDO>

Para executar comandos do PHP Artisan:

docker compose run --rm artisan <COMANDO>

Para executar comandos do Composer:

docker compose run --rm composer <COMANDO>

Observações

Sempre que executar comandos do Docker, é necessário estar na mesma pasta que contém o arquivo docker-compose.yml (neste caso, a pasta raiz).

É recomendado utilizar a imagem do Docker para aqueles que estiverem em ambiente Linux.

Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

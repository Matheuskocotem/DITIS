# Documentação Completa da API

## Autenticação

- A maioria dos endpoints exige autenticação via Sanctum (`auth:sanctum`).
- Algumas rotas exigem permissão de administrador (`role:admin`).

---

## Endpoints

### Autenticação e Usuários

- **POST `/register`**  
  Cadastra um novo usuário.  
  Parâmetros (body):  
  - `name` (string, obrigatório)
  - `email` (string, obrigatório, único)
  - `cpf` (string, obrigatório, único, 11 dígitos)
  - `password` (string, obrigatório, min 8, confirmação: `password_confirmation`)
  - `role` (string, opcional, só pode ser definido por admin)
  Retorno:  
  - 201: Usuário criado
  - 422: Erros de validação

- **POST `/login`**  
  Login do usuário.  
  Parâmetros (body):  
  - `cpf` (string, obrigatório, 11 dígitos)
  - `password` (string, obrigatório)
  Retorno:  
  - 200: Dados do usuário + token
  - 401: Credenciais inválidas

- **POST `/forgot-password`**  
  Envia e-mail para redefinição de senha.  
  Parâmetros (body):  
  - `email` (string, obrigatório)

- **POST `/reset-password`**  
  Redefine a senha do usuário.  
  Parâmetros (body):  
  - `token` (string, obrigatório)
  - `email` (string, obrigatório)
  - `password` (string, obrigatório, confirmação: `password_confirmation`)

- **GET `/users/index`**  
  Lista todos os usuários (admin).  
  Retorno:  
  - 200: Lista de usuários

- **PUT `/update/{id}`**  
  Atualiza dados de um usuário.  
  Parâmetros (body):  
  - `name`, `email`, `cpf`, `password` (opcionais)
  - `role` (apenas admin pode alterar)

- **DELETE `/delete/{id}`**  
  Remove um usuário.

- **POST `/logout`**  
  Logout do usuário autenticado.

#### Admin

- **POST `/users/add-admin`**  
  Adiciona um novo admin.

- **PUT `/users/updateAdmin/{id}`**  
  Atualiza dados de um admin.

- **GET `/users/summary-data`**  
  Retorna dados de resumo para dashboard.

---

### Salas de Reunião

- **GET `/meeting-rooms`**  
  Lista todas as salas.

- **GET `/meeting-rooms/{id}`**  
  Detalhes de uma sala.

- **POST `/meeting-rooms/`**  
  Cria uma nova sala (admin).

- **PUT `/meeting-rooms/{id}`**  
  Atualiza uma sala (admin).

- **DELETE `/meeting-rooms/{id}`**  
  Remove uma sala (admin).

- **GET `/meeting-rooms/{roomId}/occupancies/day/{date}`**  
  Horários ocupados de uma sala em um dia (admin).

- **GET `/meeting-rooms/occupancies`**  
  Dados de ocupação de todas as salas (admin).

---

### Reuniões

- **GET `/meetings/`**  
  Lista todas as reuniões.

- **GET `/meetings/day/{date}`**  
  Lista todas as reuniões de um dia.

- **GET `/meetings/my-meetings`**  
  Lista reuniões do usuário autenticado.

- **POST `/meetings/`**  
  Cria uma nova reunião.  
  Parâmetros (body):  
  - `room_id` (int, obrigatório)
  - `title` (string, obrigatório)
  - `description` (string, opcional)
  - `date` (date, obrigatório)
  - `start_time` (HH:mm, obrigatório)
  - `end_time` (HH:mm, obrigatório, depois de start_time)

- **GET `/meetings/{id}`**  
  Detalhes de uma reunião.

- **PUT `/meetings/{id}`**  
  Atualiza uma reunião.

- **DELETE `/meetings/{id}`**  
  Remove uma reunião.

- **PUT `/meetings/{id}/status`**  
  Atualiza status (`confirmed` ou `canceled`).

- **GET `/meetings/room-occupaprecncy/{date}`**  
  Ocupação das salas por data.

- **GET `/meetings/reservations-by-day/{id}`**  
  Quantidade de reservas por dia.

---

### Selects (para formulários)

- **GET `/selects/users`**  
  Lista de usuários para selects.

- **GET `/selects/rooms`**  
  Lista de salas para selects.

- **GET `/selects/meeting-statuses`**  
  Lista de status de reunião (`confirmed`, `canceled`).

---

## Observações Gerais

- Todos os endpoints retornam JSON.
- Erros de validação retornam status 422.
- Erros de autenticação/autorização retornam status 401/403.
- Campos obrigatórios e formatos são validados conforme descrito nos controllers.
- As respostas dos endpoints de listagem são arrays de objetos normalizados para o frontend.

---

Se quiser a documentação em outro formato (Swagger/OpenAPI, HTML, etc.), posso gerar para você!
Se desejar detalhamento de algum endpoint, parâmetros ou exemplos de request/response, é só pedir!

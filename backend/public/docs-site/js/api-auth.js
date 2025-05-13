// Documentação detalhada das APIs de Autenticação e Usuários

const authApiContent = `
<h2>Autenticação e Usuários</h2>

<div class="api-section">
    <h3>POST /register</h3>
    <div class="api-description">
        <p>Cadastra um novo usuário no sistema.</p>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>name</code> (string, obrigatório) - Nome completo do usuário</li>
            <li><code>email</code> (string, obrigatório) - Email único do usuário</li>
            <li><code>cpf</code> (string, obrigatório) - CPF com 11 dígitos, sem pontuação</li>
            <li><code>password</code> (string, obrigatório) - Senha (mínimo 8 caracteres)</li>
            <li><code>password_confirmation</code> (string, obrigatório) - Confirmação da senha</li>
            <li><code>role</code> (string, opcional) - Perfil do usuário (padrão: "user", pode ser definido como "admin" apenas por administradores)</li>
        </ul>

        <h4>Validações:</h4>
        <ul>
            <li>Nome é obrigatório</li>
            <li>Email deve ser único e válido</li>
            <li>CPF deve ser único e válido (11 dígitos)</li>
            <li>Senha deve ter no mínimo 8 caracteres</li>
            <li>Confirmação de senha deve ser igual à senha</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>201 - Criado com sucesso</h5>
            <pre><code>{
    "message": "Usuário registrado com sucesso!",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "cpf": "12345678901",
        "role": "user",
        "created_at": "2025-05-12T10:00:00.000000Z",
        "updated_at": "2025-05-12T10:00:00.000000Z"
    }
}</code></pre>
        </div>
        <div class="response error">
            <h5>422 - Erro de validação</h5>
            <pre><code>{
    "errors": {
        "email": ["O email já está sendo utilizado."],
        "cpf": ["CPF inválido."]
    }
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>POST /login</h3>
    <div class="api-description">
        <p>Autentica um usuário e retorna o token de acesso.</p>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>cpf</code> (string, obrigatório) - CPF do usuário (11 dígitos)</li>
            <li><code>password</code> (string, obrigatório) - Senha do usuário</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Autenticado com sucesso</h5>
            <pre><code>{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "cpf": "12345678901",
        "role": "user"
    },
    "token": "1|laravel_sanctum_token..."
}</code></pre>
        </div>
        <div class="response error">
            <h5>401 - Não autorizado</h5>
            <pre><code>{
    "message": "CPF ou senha incorretos."
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function login(Request $request)
{
    try {
        $data = $request->validate([
            'cpf' => 'required|string|regex:/^\\d{11}$/',
            'password' => 'required|string',
        ]);

        $loginData = $this->userService->loginUser($data['cpf'], $data['password']);
        return response()->json($loginData);
    } catch (ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 401);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>POST /forgot-password</h3>
    <div class="api-description">
        <p>Envia email para recuperação de senha.</p>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>email</code> (string, obrigatório) - Email do usuário</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Email enviado com sucesso</h5>
            <pre><code>{
    "message": "Link de redefinição de senha enviado para seu e-mail."
}</code></pre>
        </div>
        <div class="response error">
            <h5>400 - Erro ao enviar email</h5>
            <pre><code>{
    "message": "Não encontramos um usuário com esse endereço de e-mail."
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>POST /reset-password</h3>
    <div class="api-description">
        <p>Redefine a senha do usuário.</p>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>token</code> (string, obrigatório) - Token recebido por email</li>
            <li><code>email</code> (string, obrigatório) - Email do usuário</li>
            <li><code>password</code> (string, obrigatório) - Nova senha</li>
            <li><code>password_confirmation</code> (string, obrigatório) - Confirmação da nova senha</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Senha atualizada com sucesso</h5>
            <pre><code>{
    "message": "Senha atualizada com sucesso."
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>POST /logout (Autenticado)</h3>
    <div class="api-description">
        <p>Realiza logout do usuário, invalidando o token atual.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Logout bem-sucedido</h5>
            <pre><code>{
    "message": "Logout realizado com sucesso."
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>PUT /update/{id} (Autenticado)</h3>
    <div class="api-description">
        <p>Atualiza os dados de um usuário.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID do usuário</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>name</code> (string, opcional) - Nome do usuário</li>
            <li><code>email</code> (string, opcional) - Email do usuário</li>
            <li><code>cpf</code> (string, opcional) - CPF do usuário</li>
            <li><code>password</code> (string, opcional) - Nova senha</li>
            <li><code>password_confirmation</code> (string, condicional) - Confirmação da nova senha</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Atualizado com sucesso</h5>
            <pre><code>{
    "message": "Usuário atualizado com sucesso!",
    "user": { ... }
}</code></pre>
        </div>
        <div class="response error">
            <h5>403 - Não autorizado</h5>
            <pre><code>{
    "message": "Você não tem permissão para editar este usuário."
}</code></pre>
        </div>
    </div>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.authApiContent = authApiContent;
}

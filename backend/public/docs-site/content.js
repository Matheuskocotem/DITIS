// Conteúdo dinâmico para a documentação HTML
// Cada seção é preenchida automaticamente

const apiContent = `
<h3>Autenticação e Usuários</h3>
<ul>
<li><b>POST <code>/register</code></b> – Cadastra novo usuário.<br>Parâmetros: <code>name</code>, <code>email</code>, <code>cpf</code>, <code>password</code>, <code>password_confirmation</code>, <code>role</code> (admin)<br>Respostas: 201 (criado), 422 (validação)</li>
<li><b>POST <code>/login</code></b> – Login. Parâmetros: <code>cpf</code>, <code>password</code>. Respostas: 200 (token), 401 (erro)</li>
<li><b>POST <code>/forgot-password</code></b> – Envia e-mail de recuperação. Parâmetros: <code>email</code></li>
<li><b>POST <code>/reset-password</code></b> – Redefine senha. Parâmetros: <code>token</code>, <code>email</code>, <code>password</code>, <code>password_confirmation</code></li>
<li><b>GET <code>/users/index</code></b> – Lista todos os usuários (admin)</li>
<li><b>PUT <code>/update/{id}</code></b> – Atualiza usuário</li>
<li><b>DELETE <code>/delete/{id}</code></b> – Remove usuário</li>
<li><b>POST <code>/logout</code></b> – Logout</li>
<li><b>POST <code>/users/add-admin</code></b> – Adiciona admin</li>
<li><b>PUT <code>/users/updateAdmin/{id}</code></b> – Atualiza admin</li>
<li><b>GET <code>/users/summary-data</code></b> – Dados de resumo</li>
</ul>

<h3>Salas de Reunião</h3>
<ul>
<li><b>GET <code>/meeting-rooms</code></b> – Lista todas as salas</li>
<li><b>GET <code>/meeting-rooms/{id}</code></b> – Detalhes de uma sala</li>
<li><b>POST <code>/meeting-rooms/</code></b> – Cria sala (admin)</li>
<li><b>PUT <code>/meeting-rooms/{id}</code></b> – Atualiza sala (admin)</li>
<li><b>DELETE <code>/meeting-rooms/{id}</code></b> – Remove sala (admin)</li>
<li><b>GET <code>/meeting-rooms/{roomId}/occupancies/day/{date}</code></b> – Horários ocupados de uma sala (admin)</li>
<li><b>GET <code>/meeting-rooms/occupancies</code></b> – Dados de ocupação de todas as salas (admin)</li>
</ul>

<h3>Reuniões</h3>
<ul>
<li><b>GET <code>/meetings/</code></b> – Lista todas as reuniões</li>
<li><b>GET <code>/meetings/day/{date}</code></b> – Lista reuniões do dia</li>
<li><b>GET <code>/meetings/my-meetings</code></b> – Lista reuniões do usuário autenticado</li>
<li><b>POST <code>/meetings/</code></b> – Cria reunião. Parâmetros: <code>room_id</code>, <code>title</code>, <code>description</code>, <code>date</code>, <code>start_time</code>, <code>end_time</code></li>
<li><b>GET <code>/meetings/{id}</code></b> – Detalhes de uma reunião</li>
<li><b>PUT <code>/meetings/{id}</code></b> – Atualiza reunião</li>
<li><b>DELETE <code>/meetings/{id}</code></b> – Remove reunião</li>
<li><b>PUT <code>/meetings/{id}/status</code></b> – Atualiza status</li>
<li><b>GET <code>/meetings/room-occupaprecncy/{date}</code></b> – Ocupação das salas por data</li>
<li><b>GET <code>/meetings/reservations-by-day/{id}</code></b> – Quantidade de reservas por dia</li>
</ul>

<h3>Selects (para formulários)</h3>
<ul>
<li><b>GET <code>/selects/users</code></b> – Lista de usuários para selects</li>
<li><b>GET <code>/selects/rooms</code></b> – Lista de salas para selects</li>
<li><b>GET <code>/selects/meeting-statuses</code></b> – Lista de status de reunião</li>
</ul>

<h4>Observações Gerais</h4>
<ul>
<li>Todos os endpoints retornam JSON</li>
<li>Erros de validação: 422</li>
<li>Erros de autenticação/autorização: 401/403</li>
<li>Campos obrigatórios e formatos validados nos controllers</li>
<li>Listagens retornam arrays normalizados para o frontend</li>
</ul>
";

const arquiteturaContent = `
<p>O sistema é dividido em duas partes principais:</p>
<ul>
<li><b>Backend:</b> API RESTful em Laravel (PHP)</li>
<li><b>Frontend:</b> SPA em Vue.js</li>
</ul>
<p><b>Backend:</b> Estrutura de pastas:<br>
<code>app/Http/Controllers/</code> (controllers), <code>app/Services/</code> (serviços), <code>app/Models/</code> (modelos), <code>routes/api.php</code> (rotas), <code>database/migrations/</code> (migrations), <code>public/</code> (arquivos públicos, docs-site), <code>tests/</code> (testes), <code>docs/</code> (documentação markdown)</p>
<p><b>Frontend:</b> Estrutura de pastas:<br>
<code>src/views/</code> (páginas), <code>src/components/</code> (componentes), <code>src/services/</code> (serviços JS), <code>src/router/</code> (rotas SPA), <code>public/</code> (index.html, favicon)</p>
<p><b>Fluxo:</b> O frontend faz requisições HTTP para a API. O backend valida, executa regras de negócio e responde em JSON. Autenticação via Sanctum. Rotas protegidas por middleware.</p>
<p><b>Como rodar:</b> Backend: <code>php artisan serve</code> | Frontend: <code>npm run serve</code> | Docs: <code>http://localhost:8000/docs-site/</code></p>
";

const exemplosContent = `
<pre><code>// Exemplo de login (JS)
fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cpf: '12345678901', password: 'senha123' })
})
.then(r => r.json()).then(console.log);
</code></pre>
<pre><code>// Exemplo de resposta de listagem de salas
[
  {
    "id": 1,
    "nome": "Sala 1",
    "capacidade": 10,
    "localizacao": "Prédio A",
    ...
  }
]
</code></pre>
<pre><code>// Exemplo de requisição para criar reunião (JS)
fetch('http://localhost:8000/api/meetings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer TOKEN' },
  body: JSON.stringify({
    room_id: 1,
    title: 'Reunião Importante',
    date: '2025-05-13',
    start_time: '10:00',
    end_time: '11:00'
  })
})
</code></pre>
";

const faqContent = `
<ul>
<li><b>Como acessar a documentação?</b> Vá em <code>/docs-site/</code> no navegador.</li>
<li><b>Como proteger endpoints?</b> Use os middlewares <code>auth:sanctum</code> e <code>role:admin</code>.</li>
<li><b>Como adicionar um novo endpoint?</b> Crie um método no controller, adicione a rota em <code>routes/api.php</code> e documente.</li>
<li><b>Como rodar testes?</b> <code>php artisan test</code> no backend.</li>
<li><b>Como rodar o frontend?</b> <code>npm run serve</code> na pasta <code>frontend</code>.</li>
</ul>
";

// Preenche as seções da documentação
window.addEventListener('DOMContentLoaded', function() {
  const apiDiv = document.getElementById('api-content');
  const arqDiv = document.getElementById('arquitetura-content');
  const exDiv = document.getElementById('exemplos-content');
  const faqDiv = document.getElementById('faq-content');
  if (apiDiv) apiDiv.innerHTML = apiContent;
  if (arqDiv) arqDiv.innerHTML = arquiteturaContent;
  if (exDiv) exDiv.innerHTML = exemplosContent;
  if (faqDiv) faqDiv.innerHTML = faqContent;
});

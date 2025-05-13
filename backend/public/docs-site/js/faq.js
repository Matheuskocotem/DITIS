// FAQ - Perguntas Frequentes sobre o sistema

const faqContent = `
<h2>Perguntas Frequentes (FAQ)</h2>

<div class="faq-section">
    <div class="faq-item">
        <h3>Como acessar a documentação?</h3>
        <div class="faq-answer">
            <p>A documentação está disponível em <code>http://localhost:8000/docs-site/</code> quando o backend está em execução. Se estiver em produção, acesse <code>https://seudominio.com/docs-site/</code>.</p>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como configurar o ambiente de desenvolvimento?</h3>
        <div class="faq-answer">
            <p><strong>Backend (Laravel):</strong></p>
            <ol>
                <li>Clone o repositório</li>
                <li>Execute <code>composer install</code> para instalar dependências</li>
                <li>Copie <code>.env.example</code> para <code>.env</code> e configure o banco de dados</li>
                <li>Execute <code>php artisan key:generate</code> para gerar a chave de aplicação</li>
                <li>Execute <code>php artisan migrate</code> para criar as tabelas no banco</li>
                <li>Execute <code>php artisan serve</code> para iniciar o servidor</li>
            </ol>
            
            <p><strong>Frontend (Vue.js):</strong></p>
            <ol>
                <li>Navegue até a pasta <code>frontend</code></li>
                <li>Execute <code>npm install</code> para instalar dependências</li>
                <li>Copie <code>.env.example</code> para <code>.env</code> e configure a URL da API</li>
                <li>Execute <code>npm run serve</code> para iniciar o servidor de desenvolvimento</li>
            </ol>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como adicionar um novo endpoint à API?</h3>
        <div class="faq-answer">
            <ol>
                <li>Crie um método no controller apropriado (ou crie um novo controller)</li>
                <li>Adicione a rota em <code>routes/api.php</code> com o middleware adequado</li>
                <li>Implemente a lógica no controller, seguindo o padrão existente</li>
                <li>Documente o endpoint nesta documentação</li>
            </ol>
            <p>Exemplo de adição de rota:</p>
            <pre><code>Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/endpoint-novo', [SeuController::class, 'seuMetodo']);
});</code></pre>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como proteger um endpoint com autenticação?</h3>
        <div class="faq-answer">
            <p>Use o middleware <code>auth:sanctum</code> para proteger endpoints que exigem autenticação:</p>
            <pre><code>Route::middleware(['auth:sanctum'])->group(function () {
    // Rotas protegidas aqui
});</code></pre>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como restringir acesso apenas a administradores?</h3>
        <div class="faq-answer">
            <p>Use o middleware <code>role:admin</code> em conjunto com o <code>auth:sanctum</code>:</p>
            <pre><code>Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Rotas de admin aqui
});</code></pre>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como verificar se há conflito de horários para reuniões?</h3>
        <div class="faq-answer">
            <p>O serviço <code>MeetingService</code> já implementa a verificação de conflitos. Quando tenta criar ou atualizar uma reunião, ele verifica se há reuniões existentes na mesma sala e com horários sobrepostos.</p>
            <p>Para verificar horários ocupados diretamente:</p>
            <pre><code>GET /meeting-rooms/{roomId}/occupancies/day/{date}</code></pre>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como rodar os testes automatizados?</h3>
        <div class="faq-answer">
            <p>Execute os testes do backend com:</p>
            <pre><code>cd backend
php artisan test</code></pre>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como implementar um novo relatório ou dashboard?</h3>
        <div class="faq-answer">
            <ol>
                <li>Crie um novo método em um controller existente (ou crie um novo controller)</li>
                <li>Implemente as consultas e agregações necessárias</li>
                <li>Formate os dados para consumo no frontend</li>
                <li>Adicione a rota em <code>routes/api.php</code></li>
                <li>Crie o componente de visualização no frontend</li>
            </ol>
        </div>
    </div>

    <div class="faq-item">
        <h3>Quais são as convenções de nomenclatura do projeto?</h3>
        <div class="faq-answer">
            <ul>
                <li><strong>Controllers:</strong> Singular, sufixo "Controller" (ex: <code>MeetingController</code>)</li>
                <li><strong>Models:</strong> Singular, primeira letra maiúscula (ex: <code>User</code>, <code>MeetingRoom</code>)</li>
                <li><strong>Services:</strong> Singular, sufixo "Service" (ex: <code>UserService</code>)</li>
                <li><strong>Tabelas:</strong> Plural, snake_case (ex: <code>users</code>, <code>meeting_rooms</code>)</li>
                <li><strong>Métodos:</strong> camelCase, verbo+substantivo (ex: <code>getUsers</code>, <code>createMeeting</code>)</li>
                <li><strong>Rotas:</strong> kebab-case, substantivos no plural (ex: <code>/meeting-rooms</code>)</li>
            </ul>
        </div>
    </div>

    <div class="faq-item">
        <h3>Como contribuir para o projeto?</h3>
        <div class="faq-answer">
            <ol>
                <li>Siga os padrões de código e arquitetura existentes</li>
                <li>Documente novas funcionalidades nesta documentação</li>
                <li>Escreva testes para novas funcionalidades</li>
                <li>Valide todos os dados de entrada</li>
                <li>Respeite as convenções de nomenclatura</li>
                <li>Use branches para desenvolvimento de novas funcionalidades</li>
            </ol>
        </div>
    </div>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.faqContent = faqContent;
}

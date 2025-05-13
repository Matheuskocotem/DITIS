// Documentação detalhada da arquitetura do sistema

const architectureContent = `
<h2>Arquitetura do Sistema</h2>

<div class="architecture-section">
    <h3>Visão Geral</h3>
    <p>O sistema DITIS é construído seguindo uma arquitetura moderna de aplicação web separada em duas camadas principais:</p>
    <ul>
        <li><strong>Backend:</strong> API RESTful desenvolvida em Laravel (PHP)</li>
        <li><strong>Frontend:</strong> Single Page Application (SPA) desenvolvida em Vue.js</li>
    </ul>
    <p>Essa separação permite escalabilidade, manutenção facilitada e independência entre a lógica de negócio (backend) e a interface do usuário (frontend).</p>
    
    <div class="architecture-diagram">
        <pre class="text-diagram">
┌─────────────────┐     HTTP/JSON     ┌─────────────────┐
│                 │                   │                 │
│    Frontend     │<───────────────-->│     Backend     │<────> Database
│    (Vue.js)     │   REST API Calls  │    (Laravel)    │
│                 │                   │                 │
└─────────────────┘                   └─────────────────┘
        </pre>
    </div>
</div>

<div class="architecture-section">
    <h3>Backend (Laravel)</h3>
    
    <h4>Estrutura de Pastas</h4>
    <ul>
        <li><code>app/Http/Controllers/</code> - Controllers da API</li>
        <li><code>app/Services/</code> - Serviços com lógica de negócio</li>
        <li><code>app/Models/</code> - Modelos Eloquent (representação do banco de dados)</li>
        <li><code>routes/api.php</code> - Definição de todas as rotas da API</li>
        <li><code>config/</code> - Configurações do Laravel e pacotes</li>
        <li><code>database/migrations/</code> - Scripts para criar/alterar tabelas</li>
        <li><code>database/seeders/</code> - Scripts para popular o banco com dados iniciais</li>
        <li><code>public/</code> - Arquivos públicos, incluindo docs-site</li>
        <li><code>storage/</code> - Logs, uploads, cache</li>
        <li><code>tests/</code> - Testes automatizados</li>
    </ul>
    
    <h4>Padrão de Arquitetura</h4>
    <p>O backend segue uma arquitetura em camadas:</p>
    
    <div class="architecture-diagram">
        <pre class="text-diagram">
┌───────────────┐
│     Routes    │ → Define URLs e métodos HTTP
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Middlewares  │ → Autenticação (Sanctum), Autorização (Roles)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Controllers  │ → Recebe requisições, valida dados
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Services    │ → Lógica de negócio, regras complexas
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Models     │ → Representação e persistência no banco
└───────────────┘
        </pre>
    </div>
    
    <h4>Componentes Principais</h4>
    <ul>
        <li><strong>Controllers:</strong> Responsáveis por receber as requisições HTTP, validar dados e retornar respostas JSON. São a primeira camada de contato com o frontend.</li>
        <li><strong>Services:</strong> Encapsulam a lógica de negócio mais complexa e reutilizável. Separam as regras de negócio dos controllers, facilitando testes e manutenção.</li>
        <li><strong>Models:</strong> Representam as tabelas do banco de dados e encapsulam as operações de persistência usando o Eloquent ORM.</li>
        <li><strong>Middlewares:</strong> Interceptam requisições para aplicar autenticação (Sanctum) e autorização (role:admin).</li>
        <li><strong>Routes:</strong> Definem o mapeamento entre URLs + métodos HTTP e os métodos de controllers.</li>
    </ul>
    
    <h4>Fluxo de uma Requisição</h4>
    <ol>
        <li>O frontend faz uma requisição HTTP (ex: POST <code>/login</code>).</li>
        <li>O Laravel identifica a rota em <code>routes/api.php</code>.</li>
        <li>Middlewares verificam autenticação e autorização, se necessário.</li>
        <li>O controller apropriado é chamado.</li>
        <li>O controller valida os dados de entrada e chama o service/model adequado.</li>
        <li>A operação é realizada (consulta ao banco, processamento, etc.).</li>
        <li>O controller formata e retorna a resposta em JSON.</li>
    </ol>
</div>

<div class="architecture-section">
    <h3>Frontend (Vue.js)</h3>
    
    <h4>Estrutura de Pastas</h4>
    <ul>
        <li><code>src/views/</code> - Páginas da aplicação (Login, Dashboard, etc.)</li>
        <li><code>src/components/</code> - Componentes reutilizáveis</li>
        <li><code>src/services/</code> - Serviços JS para consumir a API</li>
        <li><code>src/router/</code> - Configuração das rotas da SPA</li>
        <li><code>src/store/</code> - Gerenciamento de estado global (Vuex/Pinia, se usado)</li>
        <li><code>public/</code> - <code>index.html</code>, favicon, etc.</li>
    </ul>
    
    <h4>Padrão de Arquitetura</h4>
    <p>O frontend segue o padrão de componentes do Vue.js com serviços para a comunicação com a API:</p>
    
    <div class="architecture-diagram">
        <pre class="text-diagram">
┌───────────────┐
│     Router    │ → Gerencia navegação da SPA
└───────┬───────┘
        │
        ▼
┌───────────────┐
│     Views     │ → Páginas completas da aplicação
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Components   │ → Componentes reutilizáveis (formulários, tabelas, etc.)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Services    │ → Comunicação com a API
└───────────────┘
        </pre>
    </div>
    
    <h4>Componentes Principais</h4>
    <ul>
        <li><strong>Views:</strong> Páginas completas da aplicação, como Login, Dashboard, Listagem de Salas, etc.</li>
        <li><strong>Components:</strong> Componentes reutilizáveis menores, como formulários, tabelas, botões customizados, etc.</li>
        <li><strong>Services:</strong> Serviços JavaScript para comunicação com a API do backend.</li>
        <li><strong>Router:</strong> Gerencia a navegação SPA, mapeando URLs para components/views.</li>
        <li><strong>Store:</strong> (Se utilizado) Gerencia o estado global da aplicação.</li>
    </ul>
</div>

<div class="architecture-section">
    <h3>Segurança</h3>
    
    <h4>Autenticação</h4>
    <p>O sistema utiliza Laravel Sanctum para autenticação baseada em tokens:</p>
    <ol>
        <li>Usuário faz login enviando CPF e senha.</li>
        <li>Backend valida as credenciais e gera um token de autenticação.</li>
        <li>Frontend armazena o token (localStorage/cookies).</li>
        <li>Requisições subsequentes incluem o token no header <code>Authorization</code>.</li>
        <li>Middleware <code>auth:sanctum</code> valida o token em cada requisição protegida.</li>
    </ol>
    
    <h4>Autorização</h4>
    <p>O controle de acesso é baseado em perfis (roles):</p>
    <ul>
        <li><strong>user:</strong> Perfil padrão para usuários comuns.</li>
        <li><strong>admin:</strong> Perfil com acesso a funcionalidades administrativas.</li>
    </ul>
    <p>O middleware <code>role:admin</code> protege rotas que exigem permissão de administrador.</p>
    
    <h4>Validação</h4>
    <p>Todos os dados recebidos pelo backend são validados antes de qualquer operação, garantindo integridade e segurança.</p>
</div>

<div class="architecture-section">
    <h3>Banco de Dados</h3>
    
    <h4>Principais Tabelas</h4>
    <ul>
        <li><strong>users:</strong> Armazena informações dos usuários (nome, email, cpf, senha, perfil).</li>
        <li><strong>meeting_rooms:</strong> Armazena informações das salas de reunião (nome, capacidade, localização, recursos).</li>
        <li><strong>meetings:</strong> Armazena informações das reuniões (título, descrição, data, horário início/fim, status).</li>
        <li><strong>password_reset_tokens:</strong> Armazena tokens para redefinição de senha.</li>
        <li><strong>personal_access_tokens:</strong> Armazena tokens de autenticação (Sanctum).</li>
    </ul>
    
    <h4>Relacionamentos</h4>
    <ul>
        <li>Uma reunião (meeting) pertence a uma sala (meeting_room) e a um usuário (user).</li>
        <li>Uma sala (meeting_room) pode ter várias reuniões (meetings).</li>
        <li>Um usuário (user) pode ter várias reuniões (meetings).</li>
    </ul>
</div>

<div class="architecture-section">
    <h3>Implantação e Ambiente</h3>
    
    <h4>Requisitos</h4>
    <ul>
        <li><strong>Backend:</strong> PHP 8.1+, Composer, Laravel 10, MySQL/MariaDB</li>
        <li><strong>Frontend:</strong> Node.js 14+, npm, Vue.js 3</li>
    </ul>
    
    <h4>Configuração</h4>
    <ul>
        <li>Arquivos <code>.env</code> no backend e frontend para configurações de ambiente.</li>
        <li>Banco de dados configurado no <code>.env</code> do backend.</li>
        <li>URL da API configurada no <code>.env</code> do frontend.</li>
    </ul>
    
    <h4>Como Rodar</h4>
    <p><strong>Backend:</strong></p>
    <pre><code>cd backend
composer install
php artisan migrate
php artisan serve</code></pre>
    
    <p><strong>Frontend:</strong></p>
    <pre><code>cd frontend
npm install
npm run serve</code></pre>
    
    <p><strong>Documentação:</strong></p>
    <pre><code>http://localhost:8000/docs-site/</code></pre>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.architectureContent = architectureContent;
}

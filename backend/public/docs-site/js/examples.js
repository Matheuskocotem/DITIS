// Exemplos detalhados de uso da API

const examplesContent = `
<h2>Exemplos de Uso</h2>

<div class="example-section">
    <h3>Autenticação e Gerenciamento de Usuários</h3>
    
    <h4>Login (JavaScript/Fetch)</h4>
    <pre><code class="language-javascript">// Login usando Fetch API
fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        cpf: '12345678901',
        password: 'senha123'
    })
})
.then(response => response.json())
.then(data => {
    // Salvar token no localStorage
    if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('Login bem-sucedido!', data.user);
    } else {
        console.error('Erro no login:', data.message);
    }
})
.catch(error => console.error('Erro na requisição:', error));</code></pre>

    <h4>Login (Axios - recomendado)</h4>
    <pre><code class="language-javascript">// Login usando Axios
import axios from 'axios';

axios.post('http://localhost:8000/api/login', {
    cpf: '12345678901',
    password: 'senha123'
})
.then(response => {
    const { token, user } = response.data;
    // Configurar Axios para incluir token em todas as requisições
    axios.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    localStorage.setItem('auth_token', token);
    console.log('Login bem-sucedido!', user);
})
.catch(error => {
    console.error('Erro no login:', 
        error.response ? error.response.data.message : error.message);
});</code></pre>

    <h4>Registro de Novo Usuário</h4>
    <pre><code class="language-javascript">axios.post('http://localhost:8000/api/register', {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    cpf: '12345678901',
    password: 'senha123',
    password_confirmation: 'senha123'
})
.then(response => {
    console.log('Usuário registrado com sucesso!', response.data);
})
.catch(error => {
    if (error.response && error.response.status === 422) {
        console.error('Erros de validação:', error.response.data.errors);
    } else {
        console.error('Erro no registro:', error.message);
    }
});</code></pre>

    <h4>Recuperação de Senha</h4>
    <pre><code class="language-javascript">// Etapa 1: Enviar email de recuperação
axios.post('http://localhost:8000/api/forgot-password', {
    email: 'usuario@exemplo.com'
})
.then(response => {
    console.log(response.data.message);
    // Mostrar mensagem: "Verifique seu email para redefinir a senha"
})
.catch(error => console.error('Erro:', error.response.data.message));

// Etapa 2: Redefinir senha (quando usuário clica no link do email)
axios.post('http://localhost:8000/api/reset-password', {
    token: 'token-recebido-por-email',
    email: 'usuario@exemplo.com',
    password: 'nova-senha',
    password_confirmation: 'nova-senha'
})
.then(response => {
    console.log('Senha redefinida com sucesso!');
})
.catch(error => console.error('Erro:', error.response.data.message));</code></pre>
</div>

<div class="example-section">
    <h3>Gerenciamento de Salas de Reunião</h3>
    
    <h4>Listar Todas as Salas</h4>
    <pre><code class="language-javascript">axios.get('http://localhost:8000/api/meeting-rooms')
.then(response => {
    const rooms = response.data;
    console.log('Salas disponíveis:', rooms);
    
    // Exemplo: Renderizar lista de salas
    const roomsList = document.getElementById('rooms-list');
    roomsList.innerHTML = rooms.map(room => 
        '\n        <div class="room-card">\n' +
        '            <h3>' + room.nome + '</h3>\n' +
        '            <p>Localização: ' + room.localizacao + '</p>\n' +
        '            <p>Capacidade: ' + room.capacidade + ' pessoas</p>\n' +
        '        </div>\n'
    ).join('');
})
.catch(error => console.error('Erro ao buscar salas:', error));</code></pre>

    <h4>Criar Nova Sala (Admin)</h4>
    <pre><code class="language-javascript">// Certifique-se de incluir o token de autenticação
const token = localStorage.getItem('auth_token');

axios.post('http://localhost:8000/api/meeting-rooms', {
    nome: 'Nova Sala de Reuniões',
    localizacao: 'Bloco C, 2º andar',
    capacidade: 12,
    recursos: ['Projetor', 'Quadro branco', 'Videoconferência'],
    descricao: 'Sala ampla com boa iluminação natural'
}, {
    headers: {
        Authorization: \`Bearer \${token}\`
    }
})
.then(response => {
    console.log('Sala criada com sucesso!', response.data.room);
})
.catch(error => {
    if (error.response && error.response.status === 403) {
        console.error('Acesso negado. Apenas administradores podem criar salas.');
    } else {
        console.error('Erro ao criar sala:', error.response.data.message);
    }
});</code></pre>
</div>

<div class="example-section">
    <h3>Gerenciamento de Reuniões</h3>
    
    <h4>Listar Minhas Reuniões</h4>
    <pre><code class="language-javascript">const token = localStorage.getItem('auth_token');

axios.get('http://localhost:8000/api/meetings/my-meetings', {
    headers: {
        Authorization: \`Bearer \${token}\`
    }
})
.then(response => {
    const meetings = response.data;
    console.log('Minhas reuniões:', meetings);
    
    // Exemplo: Renderizar calendário de reuniões
    renderMeetingsCalendar(meetings);
})
.catch(error => console.error('Erro ao buscar reuniões:', error));</code></pre>

    <h4>Agendar Nova Reunião</h4>
    <pre><code class="language-javascript">const token = localStorage.getItem('auth_token');

axios.post('http://localhost:8000/api/meetings', {
    room_id: 2,
    title: 'Reunião de Planejamento Trimestral',
    description: 'Discussão sobre metas e objetivos para o próximo trimestre',
    date: '2025-06-15',
    start_time: '14:00',
    end_time: '15:30'
}, {
    headers: {
        Authorization: \`Bearer \${token}\`
    }
})
.then(response => {
    console.log('Reunião agendada com sucesso!', response.data);
})
.catch(error => {
    if (error.response && error.response.data.error) {
        console.error('Erro ao agendar reunião:', error.response.data.message);
    } else {
        console.error('Erro na requisição:', error);
    }
});</code></pre>

    <h4>Cancelar uma Reunião</h4>
    <pre><code class="language-javascript">const token = localStorage.getItem('auth_token');
const meetingId = 5; // ID da reunião a ser cancelada

axios.put(\`http://localhost:8000/api/meetings/\${meetingId}/status\`, {
    status: 'canceled'
}, {
    headers: {
        Authorization: \`Bearer \${token}\`
    }
})
.then(response => {
    console.log('Reunião cancelada com sucesso!', response.data);
})
.catch(error => console.error('Erro ao cancelar reunião:', error.response.data.message));</code></pre>
</div>

<div class="example-section">
    <h3>Uso de Endpoints de Selects</h3>
    
    <h4>Carregar Opções para Select de Salas</h4>
    <pre><code class="language-javascript">// Preenchendo um select de salas
axios.get('http://localhost:8000/api/selects/rooms')
.then(response => {
    const roomOptions = response.data;
    const selectElement = document.getElementById('room-select');
    
    // Limpar select
    selectElement.innerHTML = '';
    
    // Adicionar opção padrão
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Selecione uma sala';
    defaultOption.value = '';
    selectElement.appendChild(defaultOption);
    
    // Adicionar opções de salas
    roomOptions.forEach(room => {
        const option = document.createElement('option');
        option.text = room.label;
        option.value = room.value;
        option.dataset.capacidade = room.capacidade;
        selectElement.appendChild(option);
    });
})
.catch(error => console.error('Erro ao carregar salas:', error));</code></pre>

    <h4>Aplicação Completa: Formulário de Agendamento</h4>
    <pre><code class="language-html">&lt;!-- HTML do formulário -->
&lt;form id="meeting-form">
    &lt;div class="form-group">
        &lt;label for="room-select">Sala:&lt;/label>
        &lt;select id="room-select" name="room_id" required>&lt;/select>
    &lt;/div>
    
    &lt;div class="form-group">
        &lt;label for="title">Título:&lt;/label>
        &lt;input type="text" id="title" name="title" required>
    &lt;/div>
    
    &lt;div class="form-group">
        &lt;label for="date">Data:&lt;/label>
        &lt;input type="date" id="date" name="date" required>
    &lt;/div>
    
    &lt;div class="form-row">
        &lt;div class="form-group">
            &lt;label for="start-time">Início:&lt;/label>
            &lt;input type="time" id="start-time" name="start_time" required>
        &lt;/div>
        
        &lt;div class="form-group">
            &lt;label for="end-time">Término:&lt;/label>
            &lt;input type="time" id="end-time" name="end_time" required>
        &lt;/div>
    &lt;/div>
    
    &lt;div class="form-group">
        &lt;label for="description">Descrição:&lt;/label>
        &lt;textarea id="description" name="description">&lt;/textarea>
    &lt;/div>
    
    &lt;button type="submit">Agendar Reunião&lt;/button>
&lt;/form></code></pre>

    <pre><code class="language-javascript">// JavaScript para o formulário
document.addEventListener('DOMContentLoaded', function() {
    // Carregar select de salas
    axios.get('http://localhost:8000/api/selects/rooms')
        .then(response => {
            const roomSelect = document.getElementById('room-select');
            response.data.forEach(room => {
                const option = document.createElement('option');
                option.value = room.value;
                option.text = room.label;
                roomSelect.appendChild(option);
            });
        });
    
    // Processar envio do formulário
    document.getElementById('meeting-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const meetingData = {
            room_id: formData.get('room_id'),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time')
        };
        
        const token = localStorage.getItem('auth_token');
        
        axios.post('http://localhost:8000/api/meetings', meetingData, {
            headers: {
                Authorization: \`Bearer \${token}\`
            }
        })
        .then(response => {
            alert('Reunião agendada com sucesso!');
            // Redirecionar ou limpar formulário
        })
        .catch(error => {
            if (error.response && error.response.data) {
                alert('Erro: ' + error.response.data.message);
            } else {
                alert('Erro ao agendar reunião.');
            }
        });
    });
});</code></pre>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.examplesContent = examplesContent;
}

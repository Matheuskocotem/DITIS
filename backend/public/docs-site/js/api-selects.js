// Documentação detalhada das APIs de Selects e opções para formulários

const selectsApiContent = `
<h2>Selects (para formulários)</h2>

<div class="api-section">
    <h3>GET /selects/users</h3>
    <div class="api-description">
        <p>Retorna uma lista formatada de usuários para uso em inputs do tipo select. Facilita a criação de formulários no frontend.</p>
        
        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de usuários formatada para selects</h5>
            <pre><code>[
    {
        "value": 1,
        "label": "John Doe",
        "email": "john@example.com"
    },
    {
        "value": 2,
        "label": "Jane Smith",
        "email": "jane@example.com"
    }
]</code></pre>
        </div>
        <div class="response error">
            <h5>500 - Erro ao buscar usuários</h5>
            <pre><code>{
    "message": "Erro ao buscar usuários",
    "error": "Error message details"
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function getUsers()
{
    try {
        $users = User::all();
        
        // Formatação específica para selects
        $formattedUsers = $users->map(function ($user) {
            // Garantir que os campos não sejam undefined
            $name = $user->name ?: 'Usuário ' . $user->id;
            
            return [
                'value' => $user->id,
                'label' => $name,
                'email' => $user->email ?: ''
            ];
        });
        
        // Log dos dados para debug
        \\Log::info('Dados de usuários formatados para select:', ['users' => $formattedUsers->toArray()]);
        
        return response()->json($formattedUsers);
    } catch (\\Exception $e) {
        return response()->json([
            'message' => 'Erro ao buscar usuários',
            'error' => $e->getMessage()
        ], 500);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>GET /selects/rooms</h3>
    <div class="api-description">
        <p>Retorna uma lista formatada de salas para uso em inputs do tipo select, incluindo capacidade e localização.</p>
        
        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de salas formatada para selects</h5>
            <pre><code>[
    {
        "value": 1,
        "label": "Sala de Reuniões 1 (Bloco A)",
        "capacidade": 10
    },
    {
        "value": 2,
        "label": "Sala de Reuniões 2 (Bloco B)",
        "capacidade": 8
    }
]</code></pre>
        </div>
        <div class="response error">
            <h5>500 - Erro ao buscar salas</h5>
            <pre><code>{
    "message": "Erro ao buscar salas",
    "error": "Error message details"
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function getRooms()
{
    try {
        $rooms = MeetingRoom::all();
        
        // Formatação específica para selects
        $formattedRooms = $rooms->map(function ($room) {
            // Garantir que os campos não sejam undefined
            $nome = $room->nome ?: 'Sala sem nome';
            $localizacao = $room->localizacao ?: 'Sem localização';
            
            return [
                'value' => $room->id,
                'label' => "{$nome} ({$localizacao})",
                'capacidade' => $room->capacidade ?: 0
            ];
        });
        
        // Log dos dados para debug
        \\Log::info('Dados de salas formatados para select:', ['rooms' => $formattedRooms->toArray()]);
        
        return response()->json($formattedRooms);
    } catch (\\Exception $e) {
        return response()->json([
            'message' => 'Erro ao buscar salas',
            'error' => $e->getMessage()
        ], 500);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>GET /selects/meeting-statuses</h3>
    <div class="api-description">
        <p>Retorna as opções de status para reuniões (confirmada, cancelada) no formato adequado para selects.</p>
        
        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de status formatada para selects</h5>
            <pre><code>[
    {
        "value": "confirmed",
        "label": "Confirmada"
    },
    {
        "value": "canceled",
        "label": "Cancelada"
    }
]</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function getMeetingStatuses()
{
    $statuses = [
        ['value' => 'confirmed', 'label' => 'Confirmada'],
        ['value' => 'canceled', 'label' => 'Cancelada'],
    ];
    
    return response()->json($statuses);
}</code></pre>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.selectsApiContent = selectsApiContent;
}

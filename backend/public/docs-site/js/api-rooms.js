// Documentação detalhada das APIs de Salas de Reunião

const roomsApiContent = `
<h2>Salas de Reunião</h2>

<div class="api-section">
    <h3>GET /meeting-rooms</h3>
    <div class="api-description">
        <p>Lista todas as salas de reunião. Endpoint público, não requer autenticação.</p>
        
        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de salas</h5>
            <pre><code>[
    {
        "id": 1,
        "nome": "Sala de Reuniões 1",
        "capacidade": 10,
        "localizacao": "Bloco A",
        "recursos": ["Projetor", "Quadro branco", "Ar-condicionado"],
        "descricao": "Sala ampla para reuniões e treinamentos",
        "created_at": "2025-05-10T08:00:00.000000Z",
        "updated_at": "2025-05-10T08:00:00.000000Z"
    },
    {
        "id": 2,
        "nome": "Sala de Reuniões 2",
        "capacidade": 8,
        "localizacao": "Bloco B",
        "recursos": ["TV", "Videoconferência"],
        "descricao": "Sala para videoconferências",
        "created_at": "2025-05-10T08:00:00.000000Z",
        "updated_at": "2025-05-10T08:00:00.000000Z"
    }
]</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function index()
{
    try {
        // Tentar usar o serviço se estiver disponível
        if ($this->service) {
            $rooms = $this->service->getAllRooms();
        } else {
            // Fallback para consulta direta ao modelo se o serviço não estiver injetado
            $rooms = MeetingRoom::all();
        }
        
        // Normalizar os dados para compatibilidade com o frontend
        $normalizedRooms = [];
        
        foreach ($rooms as $room) {
            // Converter para array se for objeto
            $roomData = is_object($room) ? (array) $room : $room;
            
            // Garantir que todos os campos estão presentes com nomenclatura padronizada
            $normalizedRooms[] = [
                'id' => $roomData['id'],
                'nome' => $roomData['nome'] ?? $roomData['name'] ?? 'Sala sem nome',
                'capacidade' => $roomData['capacidade'] ?? $roomData['capacity'] ?? 0,
                'localizacao' => $roomData['localizacao'] ?? $roomData['localization'] ?? 'Sem localização',
                'recursos' => $roomData['recursos'] ?? $roomData['resources'] ?? [],
                'descricao' => $roomData['descricao'] ?? $roomData['description'] ?? '',
                // Manter outros campos originais que possam existir
                'created_at' => $roomData['created_at'] ?? null,
                'updated_at' => $roomData['updated_at'] ?? null,
            ];
        }
        
        return response()->json($normalizedRooms);
    } catch (\\Exception $e) {
        // Log detalhado do erro para depuração
        \\Log::error('Erro ao buscar salas: ' . $e->getMessage() . '\\n' . $e->getTraceAsString());
        
        // Retornar array vazio em caso de erro, sem quebrar o frontend
        return response()->json([]);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>GET /meeting-rooms/{id}</h3>
    <div class="api-description">
        <p>Retorna os detalhes de uma sala específica.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da sala</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Detalhes da sala</h5>
            <pre><code>{
    "id": 1,
    "nome": "Sala de Reuniões 1",
    "capacidade": 10,
    "localizacao": "Bloco A",
    "recursos": ["Projetor", "Quadro branco", "Ar-condicionado"],
    "descricao": "Sala ampla para reuniões e treinamentos",
    "created_at": "2025-05-10T08:00:00.000000Z",
    "updated_at": "2025-05-10T08:00:00.000000Z"
}</code></pre>
        </div>
        <div class="response error">
            <h5>404 - Sala não encontrada</h5>
            <pre><code>{
    "message": "Room not found"
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>POST /meeting-rooms (Admin)</h3>
    <div class="api-description">
        <p>Cria uma nova sala de reunião. Requer autenticação e permissão de administrador.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
            <li><code>Content-Type</code> (string, obrigatório) - application/json</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>nome</code> (string, obrigatório) - Nome da sala</li>
            <li><code>localizacao</code> (string, obrigatório) - Localização da sala</li>
            <li><code>capacidade</code> (integer, obrigatório) - Capacidade da sala (pessoas)</li>
            <li><code>recursos</code> (array, opcional) - Lista de recursos disponíveis</li>
            <li><code>descricao</code> (string, opcional) - Descrição detalhada da sala</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>201 - Sala criada com sucesso</h5>
            <pre><code>{
    "message": "Room created successfully",
    "room": {
        "id": 3,
        "nome": "Nova Sala",
        "capacidade": 15,
        "localizacao": "Bloco C",
        "recursos": ["TV", "Wi-Fi"],
        "descricao": "Nova sala de reuniões",
        "created_at": "2025-05-12T14:30:00.000000Z",
        "updated_at": "2025-05-12T14:30:00.000000Z"
    }
}</code></pre>
        </div>
        <div class="response error">
            <h5>400 - Erro de validação</h5>
            <pre><code>{
    "message": "O campo nome é obrigatório."
}</code></pre>
        </div>
        <div class="response error">
            <h5>403 - Não autorizado</h5>
            <pre><code>{
    "message": "Unauthorized. Admin permission required."
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function store(Request $request)
{
    try {
        if ($this->service) {
            $room = $this->service->createRoom($request);
            return response()->json(['message' => 'Room created successfully', 'room' => $room], 201);
        }
        
        // Fallback: criar sala diretamente usando o modelo
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'localizacao' => 'required|string|max:255',
            'capacidade' => 'required|integer',
            'recursos' => 'nullable|array',
            'descricao' => 'nullable|string',
        ]);
        
        $room = MeetingRoom::create($validatedData);
        return response()->json(['message' => 'Room created successfully', 'room' => $room], 201);
    } catch (\\Exception $e) {
        \\Log::error('Erro ao criar sala: ' . $e->getMessage());
        return response()->json(['message' => $e->getMessage()], 400);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>PUT /meeting-rooms/{id} (Admin)</h3>
    <div class="api-description">
        <p>Atualiza uma sala existente. Requer autenticação e permissão de administrador.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da sala</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>nome</code> (string, opcional) - Nome da sala</li>
            <li><code>localizacao</code> (string, opcional) - Localização da sala</li>
            <li><code>capacidade</code> (integer, opcional) - Capacidade da sala</li>
            <li><code>recursos</code> (array, opcional) - Lista de recursos</li>
            <li><code>descricao</code> (string, opcional) - Descrição da sala</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Sala atualizada com sucesso</h5>
            <pre><code>{
    "message": "Room updated successfully"
}</code></pre>
        </div>
        <div class="response error">
            <h5>404 - Sala não encontrada</h5>
            <pre><code>{
    "message": "Room not found"
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>DELETE /meeting-rooms/{id} (Admin)</h3>
    <div class="api-description">
        <p>Remove uma sala. Requer autenticação e permissão de administrador.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da sala</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Sala removida com sucesso</h5>
            <pre><code>{
    "message": "Room deleted successfully"
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>GET /meeting-rooms/{roomId}/occupancies/day/{date} (Admin)</h3>
    <div class="api-description">
        <p>Retorna os horários ocupados de uma sala em um dia específico. Requer autenticação e permissão de administrador.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>roomId</code> (integer, obrigatório) - ID da sala</li>
            <li><code>date</code> (string, obrigatório) - Data no formato "YYYY-MM-DD"</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de horários ocupados</h5>
            <pre><code>[
    {
        "start_time": "10:00",
        "end_time": "11:00",
        "meeting_id": 1,
        "title": "Reunião de Planejamento"
    },
    {
        "start_time": "14:30",
        "end_time": "15:30",
        "meeting_id": 5,
        "title": "Entrevista de Candidato"
    }
]</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>GET /meeting-rooms/occupancies (Admin)</h3>
    <div class="api-description">
        <p>Retorna dados de ocupação de todas as salas. Requer autenticação e permissão de administrador.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Dados de ocupação</h5>
            <pre><code>{
    "labels": ["Sala 1", "Sala 2", "Sala 3"],
    "data": [75, 45, 60]
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function getOccupancyData()
{
    try {
        if ($this->service) {
            $data = $this->service->getOccupancyData();
            return response()->json($data);
        }
        
        // Fallback: retornar dados de ocupação simulados que não quebram o frontend
        return response()->json(['labels' => [], 'data' => []]);
    } catch (\\Exception $e) {
        \\Log::error('Erro ao buscar dados de ocupação: ' . $e->getMessage());
        return response()->json(['labels' => [], 'data' => []]);
    }
}</code></pre>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.roomsApiContent = roomsApiContent;
}

// Documentação detalhada das APIs de Reuniões

const meetingsApiContent = `
<h2>Reuniões</h2>

<div class="api-section">
    <h3>GET /meetings (Autenticado)</h3>
    <div class="api-description">
        <p>Lista todas as reuniões. Requer autenticação.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
        </ul>

        <h4>Query Parameters:</h4>
        <ul class="params">
            <li><code>page</code> (integer, opcional) - Número da página para paginação</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de reuniões</h5>
            <pre><code>[
    {
        "id": 1,
        "room_id": 2,
        "user_id": 3,
        "title": "Reunião de Planejamento",
        "description": "Planejamento do próximo trimestre",
        "date": "2025-05-15",
        "start_time": "10:00",
        "end_time": "11:00",
        "status": "confirmed",
        "created_at": "2025-05-12T10:00:00.000000Z",
        "updated_at": "2025-05-12T10:00:00.000000Z",
        "room": {
            "id": 2,
            "nome": "Sala de Reuniões 2",
            "capacidade": 8,
            "localizacao": "Bloco B"
        },
        "user": {
            "id": 3,
            "name": "Jane Doe"
        }
    },
    ...
]</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function index()
{
    return response()->json($this->meetingService->getAllMeetings());
}</code></pre>
</div>

<div class="api-section">
    <h3>GET /meetings/day/{date} (Autenticado)</h3>
    <div class="api-description">
        <p>Lista todas as reuniões de uma data específica.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>date</code> (string, obrigatório) - Data no formato "YYYY-MM-DD"</li>
        </ul>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de reuniões</h5>
            <pre><code>[
    {
        "id": 1,
        "room_id": 2,
        "title": "Reunião de Planejamento",
        "description": "Planejamento do próximo trimestre",
        "date": "2025-05-15",
        "start_time": "10:00",
        "end_time": "11:00",
        "status": "confirmed",
        "room": {
            "id": 2,
            "nome": "Sala de Reuniões 2",
            "capacidade": 8
        }
    },
    ...
]</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>GET /meetings/my-meetings (Autenticado)</h3>
    <div class="api-description">
        <p>Lista todas as reuniões do usuário autenticado.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Lista de reuniões</h5>
            <pre><code>[
    {
        "id": 1,
        "room_id": 2,
        "title": "Reunião de Planejamento",
        "date": "2025-05-15",
        "start_time": "10:00",
        "end_time": "11:00",
        "status": "confirmed",
        "room": {
            "nome": "Sala de Reuniões 2"
        }
    },
    ...
]</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function getMyMeetings(Request $request)
{
    $user = $request->user();
    return response()->json($this->meetingService->getMeetingsByUser($user->id));
}</code></pre>
</div>

<div class="api-section">
    <h3>POST /meetings (Autenticado)</h3>
    <div class="api-description">
        <p>Cria uma nova reunião.</p>
        
        <h4>Headers:</h4>
        <ul class="params">
            <li><code>Authorization</code> (string, obrigatório) - Bearer {token}</li>
            <li><code>Content-Type</code> (string, obrigatório) - application/json</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>room_id</code> (integer, obrigatório) - ID da sala de reunião</li>
            <li><code>title</code> (string, obrigatório) - Título da reunião</li>
            <li><code>description</code> (string, opcional) - Descrição da reunião</li>
            <li><code>date</code> (string, obrigatório) - Data no formato "YYYY-MM-DD"</li>
            <li><code>start_time</code> (string, obrigatório) - Hora de início no formato "HH:MM"</li>
            <li><code>end_time</code> (string, obrigatório) - Hora de término no formato "HH:MM"</li>
        </ul>

        <h4>Validações:</h4>
        <ul>
            <li>A sala deve existir (room_id válido)</li>
            <li>A hora de término deve ser posterior à hora de início</li>
            <li>Não pode haver conflito com outras reuniões na mesma sala</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>201 - Reunião criada com sucesso</h5>
            <pre><code>{
    "id": 1,
    "room_id": 2,
    "user_id": 3,
    "title": "Reunião de Planejamento",
    "description": "Planejamento do próximo trimestre",
    "date": "2025-05-15",
    "start_time": "10:00",
    "end_time": "11:00",
    "status": "confirmed",
    "created_at": "2025-05-12T10:00:00.000000Z",
    "updated_at": "2025-05-12T10:00:00.000000Z"
}</code></pre>
        </div>
        <div class="response error">
            <h5>400 - Erro de validação</h5>
            <pre><code>{
    "error": true,
    "message": "Já existe uma reunião agendada para esta sala neste horário"
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function store(Request $request)
{
    $request->validate([
        'room_id' => 'required|exists:meeting_rooms,id',
        'title' => 'required|string',
        'description' => 'nullable|string',
        'date' => 'required|date',
        'start_time' => 'required|date_format:H:i',
        'end_time' => 'required|date_format:H:i|after:start_time',
    ]);

    try {
        $meeting = $this->meetingService->createMeeting($request->all());
        return response()->json($meeting, 201);
    } catch (\\Exception $e) {
        return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>PUT /meetings/{id} (Autenticado)</h3>
    <div class="api-description">
        <p>Atualiza uma reunião existente.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da reunião</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>room_id</code> (integer, obrigatório) - ID da sala</li>
            <li><code>title</code> (string, obrigatório) - Título da reunião</li>
            <li><code>description</code> (string, opcional) - Descrição da reunião</li>
            <li><code>date</code> (string, obrigatório) - Data (YYYY-MM-DD)</li>
            <li><code>start_time</code> (string, obrigatório) - Hora de início (HH:MM)</li>
            <li><code>end_time</code> (string, obrigatório) - Hora de término (HH:MM)</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Reunião atualizada com sucesso</h5>
            <pre><code>{
    "id": 1,
    "room_id": 2,
    "title": "Reunião de Planejamento Atualizada",
    "description": "Descrição atualizada",
    "date": "2025-05-15",
    "start_time": "11:00",
    "end_time": "12:00",
    "status": "confirmed",
    "updated_at": "2025-05-12T12:00:00.000000Z"
}</code></pre>
        </div>
    </div>
</div>

<div class="api-section">
    <h3>PUT /meetings/{id}/status (Autenticado)</h3>
    <div class="api-description">
        <p>Atualiza o status de uma reunião (confirmar ou cancelar).</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da reunião</li>
        </ul>
        
        <h4>Parâmetros (body):</h4>
        <ul class="params">
            <li><code>status</code> (string, obrigatório) - Novo status (confirmed ou canceled)</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Status atualizado com sucesso</h5>
            <pre><code>{
    "id": 1,
    "status": "canceled",
    "updated_at": "2025-05-12T12:00:00.000000Z"
}</code></pre>
        </div>
    </div>
    
    <h4>Implementação no Controller:</h4>
    <pre><code>public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:confirmed,canceled',
    ]);

    try {
        $meeting = $this->meetingService->updateMeetingStatus($id, $request->status);

        return response()->json($meeting);
    } catch (\\Exception $e) {
        return response()->json(['error' => true, 'message' => $e->getMessage()], 400);
    }
}</code></pre>
</div>

<div class="api-section">
    <h3>DELETE /meetings/{id} (Autenticado)</h3>
    <div class="api-description">
        <p>Remove uma reunião.</p>
        
        <h4>Parâmetros (path):</h4>
        <ul class="params">
            <li><code>id</code> (integer, obrigatório) - ID da reunião</li>
        </ul>

        <h4>Respostas:</h4>
        <div class="response success">
            <h5>200 - Reunião removida com sucesso</h5>
            <pre><code>{
    "message": "Reunião deletada com sucesso!",
    "meeting": { ... }
}</code></pre>
        </div>
    </div>
</div>
`;

// Exporta o conteúdo para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.meetingsApiContent = meetingsApiContent;
}

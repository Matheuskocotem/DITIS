<?php

namespace App\Http\Controllers;

use App\Services\MeetingRoomService;
use App\Models\MeetingRoom;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MeetingRoomController extends Controller
{
    protected $service;

    public function __construct(MeetingRoomService $service = null)
    {
        $this->service = $service;
    }

    public function index()
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
        } catch (\Exception $e) {
            // Log detalhado do erro para depuração
            \Log::error('Erro ao buscar salas: ' . $e->getMessage() . '\n' . $e->getTraceAsString());
            
            // Retornar array vazio em caso de erro, sem quebrar o frontend
            return response()->json([]);
        }
    }

    public function getOccupancyData()
    {
        try {
            if ($this->service) {
                $data = $this->service->getOccupancyData();
                return response()->json($data);
            }
            
            // Fallback: retornar dados de ocupação simulados que não quebram o frontend
            return response()->json(['labels' => [], 'data' => []]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar dados de ocupação: ' . $e->getMessage());
            return response()->json(['labels' => [], 'data' => []]);
        }
    }

    public function getOccupiedHours($roomId, $date)
    {
        try {
            if ($this->service) {
                $occupiedHours = $this->service->getOccupiedHours($roomId, $date);
                return response()->json($occupiedHours);
            }
            
            // Fallback: retornar horas ocupadas simuladas que não quebram o frontend
            return response()->json([]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar horas ocupadas: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function show($id)
    {
        try {
            if ($this->service) {
                $room = $this->service->getRoomById($id);
                return response()->json($room);
            }
            
            // Fallback: buscar sala diretamente do modelo
            $room = MeetingRoom::find($id);
            if (!$room) {
                return response()->json(['message' => 'Room not found'], 404);
            }
            
            return response()->json($room);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar sala: ' . $e->getMessage());
            return response()->json(['message' => 'Error retrieving room data'], 500);
        }
    }

    public function store(Request $request)
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
        } catch (\Exception $e) {
            \Log::error('Erro ao criar sala: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if ($this->service) {
                $this->service->updateRoom($request, $id);
                return response()->json(['message' => 'Room updated successfully']);
            }
            
            // Fallback: atualizar sala diretamente usando o modelo
            $room = MeetingRoom::find($id);
            if (!$room) {
                return response()->json(['message' => 'Room not found'], 404);
            }
            
            $validatedData = $request->validate([
                'nome' => 'sometimes|required|string|max:255',
                'localizacao' => 'sometimes|required|string|max:255',
                'capacidade' => 'sometimes|required|integer',
                'recursos' => 'nullable|array',
                'descricao' => 'nullable|string',
            ]);
            
            $room->update($validatedData);
            return response()->json(['message' => 'Room updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Erro ao atualizar sala: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function destroy($id)
    {
        try {
            if ($this->service) {
                $this->service->deleteRoom($id);
                return response()->json(['message' => 'Room deleted successfully']);
            }
            
            // Fallback: excluir sala diretamente usando o modelo
            $room = MeetingRoom::find($id);
            if (!$room) {
                return response()->json(['message' => 'Room not found'], 404);
            }
            
            $room->delete();
            return response()->json(['message' => 'Room deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Erro ao excluir sala: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MeetingRoom;

class SelectOptionsController extends Controller
{
    /**
     * Obtém a lista de usuários formatada para selects
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers()
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
            \Log::info('Dados de usuários formatados para select:', ['users' => $formattedUsers->toArray()]);
            
            return response()->json($formattedUsers);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtém a lista de salas formatada para selects
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRooms()
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
            \Log::info('Dados de salas formatados para select:', ['rooms' => $formattedRooms->toArray()]);
            
            return response()->json($formattedRooms);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar salas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retorna as opções de status para reuniões
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMeetingStatuses()
    {
        $statuses = [
            ['value' => 'confirmed', 'label' => 'Confirmada'],
            ['value' => 'canceled', 'label' => 'Cancelada'],
        ];
        
        return response()->json($statuses);
    }
}

import { api } from "@/lib/axios";

export async function apiGetMeetingRooms() {
  try {
    const response = await api.get('/meeting-rooms');
    
    // Verificar se os dados estão no formato esperado
    if (response.data && Array.isArray(response.data)) {
      // Garantir que cada sala tenha os campos necessários com nomes padronizados
      return response.data.map(room => ({
        ...room,
        id: room.id,
        nome: room.nome || room.name || 'Sala sem nome',
        capacidade: room.capacidade || room.capacity || 0,
        localizacao: room.localizacao || room.localization || 'Sem localização'
      }));
    }
    
    console.warn('API não retornou um array de salas');
    return [];
  } catch (error) {
    console.error('Erro ao buscar salas:', error);
    return [];
  }
}
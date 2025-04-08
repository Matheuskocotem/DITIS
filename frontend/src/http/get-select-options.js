import { api } from "@/lib/axios";

/**
 * Busca usuários formatados para selects
 * @returns {Promise<Array>} Lista de usuários no formato {value, label}
 */
export async function apiGetUserOptions() {
  try {
    const response = await api.get('/selects/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar opções de usuários:', error);
    return [];
  }
}

/**
 * Busca salas formatadas para selects
 * @returns {Promise<Array>} Lista de salas no formato {value, label, capacidade}
 */
export async function apiGetRoomOptions() {
  try {
    const response = await api.get('/selects/rooms');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar opções de salas:', error);
    return [];
  }
}

/**
 * Busca status de reuniões formatados para selects
 * @returns {Promise<Array>} Lista de status no formato {value, label}
 */
export async function apiGetMeetingStatusOptions() {
  try {
    const response = await api.get('/selects/meeting-statuses');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar opções de status:', error);
    // Fallback para opções padrão em caso de erro
    return [
      { value: 'confirmed', label: 'Confirmada' },
      { value: 'canceled', label: 'Cancelada' }
    ];
  }
}

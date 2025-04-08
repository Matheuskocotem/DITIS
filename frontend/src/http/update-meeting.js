import { api } from "@/lib/axios";

export async function apiUpdateMeeting(id, meeting) {
  // Prepara os dados para compatibilidade com o backend
  const payload = preparePayload(meeting);
  
  const response = await api.put(`/meetings/${id}`, payload);

  return response.data;
}

// Função para preparar o payload da reunião
function preparePayload(meeting) {
  // Se estamos usando organizer_name em vez de user_id, vamos adaptar
  const payload = { ...meeting };
  
  // O backend espera user_id, mas estamos usando organizer_name no front
  // Vamos adicionar um campo user_id do usuário atual se ele existir
  // Ou usar um ID padrão se não existir (o backend lidará com isso)
  if (!payload.user_id) {
    try {
      // Tenta obter o ID do usuário da sessão atual, ou usa um valor padrão
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        payload.user_id = user.id;
      } else {
        payload.user_id = 1; // ID padrão para compatibilidade
      }
    } catch (error) {
      payload.user_id = 1; // Em caso de erro, usa ID padrão
    }
  }
  
  // Garante que o organizer_name seja enviado como parte dos dados
  // também adiciona o campo organizer que o backend pode usar
  payload.organizer = payload.organizer_name || '';
  
  return payload;
}
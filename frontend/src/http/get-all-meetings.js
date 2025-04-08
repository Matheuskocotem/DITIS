import { api } from "@/lib/axios";

export async function apiGetAllMeetings() {
  const response = await api.get('/meetings');
  
  // Registrar resposta completa para depuração
  console.log('Resposta completa da API /meetings:', response);
  console.log('Dados retornados da API /meetings:', response.data);
  
  // Verificar a estrutura do primeiro item (se existir)
  if (response.data && response.data.length > 0) {
    console.log('Estrutura do primeiro item:', response.data[0]);
  }

  return response.data;
}
import { api } from "@/lib/axios";

export async function apiGetUsers() {
  try {
    const response = await api.get('/users/index');
    
    // Verificar se os dados estão no formato esperado
    if (response.data && Array.isArray(response.data)) {
      // Garantir que cada usuário tenha os campos necessários com nomes padronizados
      return response.data.map(user => ({
        ...user,
        id: user.id,
        name: user.name || user.nome || 'Usuário sem nome',
        email: user.email || '',
        role: user.role || user.papel || ''
      }));
    } else if (response.data) {
      // Se não for um array, mas tiver dados, tente extrair uma propriedade que pode conter o array
      const possibleArrays = ['users', 'data', 'items', 'records'];
      
      for (const key of possibleArrays) {
        if (response.data[key] && Array.isArray(response.data[key])) {
          return response.data[key].map(user => ({
            ...user,
            id: user.id,
            name: user.name || user.nome || 'Usuário sem nome',
            email: user.email || '',
            role: user.role || user.papel || ''
          }));
        }
      }
    }
    
    console.warn('API não retornou um array de usuários');
    return [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}
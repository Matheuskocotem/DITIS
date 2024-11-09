import { api } from '@/lib/axios'

export async function apiLogin({ cpf, password }) {
  const response = await api.post('/login', {
    cpf,
    password,
  });

  return response.data
}
import { api } from '@/lib/axios'

export async function apiForgotPassword({ email }) {
  const response = await api.post('/forgot-password', {
    email
  });

  return response.data
}
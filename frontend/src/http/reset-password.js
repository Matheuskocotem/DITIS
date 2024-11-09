import { api } from '@/lib/axios'

export async function apiResetPassword({ password, password_confirmation }) {
  await api.post('/reset-password', {
    password,
    password_confirmation
  });
}
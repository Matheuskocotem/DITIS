import { api } from '@/lib/axios'

export async function apiResetPassword({
  token,
  email,
  password,
  password_confirmation
}) {
  await api.post('/reset-password', {
    token,
    email,
    password,
    password_confirmation
  });
}
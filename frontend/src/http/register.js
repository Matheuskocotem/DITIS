import { api } from '@/lib/axios'

export async function apiRegister({
  name,
  email,
  cpf,
  password,
  password_confirmation
}) {
  await api.post('/register', {
    name,
    email,
    cpf,
    password,
    password_confirmation
  });
}
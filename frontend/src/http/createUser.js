import { api } from "@/lib/axios";

export async function apiCreateUser(payload) {
  const response = await api.post('/users/add-admin', payload);

  return response.data;
}
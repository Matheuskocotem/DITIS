import { api } from "@/lib/axios";

export async function apiGetUsers() {
  const response = await api.get('/users/index');

  return response.data
}
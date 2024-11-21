import { api } from "@/lib/axios";

export async function apiUpdateUser(id, payload) {
  const response = await api.put(`/users/updateAdmin/${id}`, payload);

  return response.data
}
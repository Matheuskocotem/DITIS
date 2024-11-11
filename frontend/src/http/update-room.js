import { api } from "@/lib/axios";

export async function apiUpdateRoom(id, form) {
  const response = await api.put(`/meeting-rooms/${id}`, form);

  return response.data;
}
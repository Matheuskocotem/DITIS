import { api } from "@/lib/axios";

export async function apiAddRoom(form) {
  const response = await api.post('/meeting-rooms', form);

  return response.data;
}
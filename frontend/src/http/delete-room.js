import { api } from "@/lib/axios";

export async function apiDeleteRoom(id) {
  await api.delete(`/meeting-rooms/${id}`);
}
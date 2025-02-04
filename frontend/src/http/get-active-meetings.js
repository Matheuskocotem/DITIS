import { api } from "@/lib/axios";

export async function apiActiveMeetings() {
  const response = await api.get(`/meetings?status=confirmed`);
  return response.data;
}
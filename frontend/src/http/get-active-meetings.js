import { api } from "@/lib/axios";

export async function apiActiveMeetings() {
  const response = await api.get(`/meetings-active`);
  return response.data;
}
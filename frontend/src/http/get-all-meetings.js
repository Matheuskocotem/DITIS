import { api } from "@/lib/axios";

export async function apiGetAllMeetings() {
  const response = await api.get('/meetings');

  return response.data
}
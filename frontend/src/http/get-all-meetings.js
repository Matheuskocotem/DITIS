import { api } from "@/lib/axios";

export async function apiGetAllMeetings(date) {
  const response = await api.get(`/meetings?date=${date}`);
  return response.data;
}

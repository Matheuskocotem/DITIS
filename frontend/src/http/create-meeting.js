import { api } from "@/lib/axios";

export async function apiCreateMeeting(meeting) {
  const response = await api.post('/meetings', meeting);

  return response.data
}
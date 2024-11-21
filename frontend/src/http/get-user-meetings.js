import { api } from "@/lib/axios";

export async function apiGetUserMeetings() {
  const response = await api.get('/meetings/my-meetings');

  return response.data
}
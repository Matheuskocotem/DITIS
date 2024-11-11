import { api } from "@/lib/axios";

export function apiGetAllMeetings() {
  const response = api.get('/meetings');

  return response.data
}
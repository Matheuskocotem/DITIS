import { api } from "@/lib/axios";

export async function apiUpdateMeeting(id, meeting) {
  const response = await api.put(`/meetings/${id}`, meeting);

  return response.data
}
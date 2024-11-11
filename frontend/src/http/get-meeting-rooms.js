import { api } from "@/lib/axios";

export async function apiGetMeetingRooms() {
  const response = await api.get('/meeting-rooms')

  return response.data
}
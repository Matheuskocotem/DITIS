import { api } from "@/lib/axios";

export async function apiDeleteMeeting(id) {
  await api.delete(`/meetings/${id}`);
}

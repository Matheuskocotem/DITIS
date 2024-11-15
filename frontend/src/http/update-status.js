import { api } from "@/lib/axios";

export async function apiUpdateStatus(id, status) {
  await api.put(`/meetings/${id}/status`, status)
}
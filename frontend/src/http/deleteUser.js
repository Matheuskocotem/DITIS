import { api } from "@/lib/axios";

export async function apiDeleteUser(id) {
  await api.delete(`/delete/${id}`)
}
import { api } from "@/lib/axios";

export async function apiLogout() {
  await api.post('/logout');
}
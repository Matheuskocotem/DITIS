import { api } from "@/lib/axios";

export async function apiGetSummaryData() {
  const response = await api.get('/users/summary-data');

  return response.data
}
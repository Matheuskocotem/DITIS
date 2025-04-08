import { api } from "@/lib/axios";

export async function apiAddRoom(form) {
  console.log('apiAddRoom - Request Payload:', form);
  try {
    const response = await api.post('/meeting-rooms', form);
    console.log('apiAddRoom - Response Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('apiAddRoom - Error Response:', error.response?.data || error.message);
    throw error;
  }
}
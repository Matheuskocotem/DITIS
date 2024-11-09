export const state = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
}
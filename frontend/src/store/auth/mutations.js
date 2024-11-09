export const mutations = {
  setToken(state, token) {
    console.log('Token sendo armazenado:', token); // Verifique se o token está sendo armazenado corretamente
    state.token = token;
    localStorage.setItem('token', token);
  },
  
  setRole(state, role) {
    state.role = role;
    localStorage.setItem('role', role);
  },
  clearAuth(state) {
    state.token = null;
    state.role = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  },
}
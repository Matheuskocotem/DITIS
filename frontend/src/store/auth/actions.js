import { apiLogin } from '@/http'

export const actions = {
  async authenticateUser({ }, { cpf, password }) {   
    try {
      const { token, role } = await apiLogin({ 
        cpf: cpf,
        password
      });

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      return role; 
    } catch (error) {
      throw error
    }
  },
  
  logout({ commit }) {
    commit('clearAuth');
  },
}
import { apiLogin } from '@/http'

export const actions = {
  async authenticateUser({ }, { cpf, password }) {   
    try {
      const { token, role, id } = await apiLogin({ 
        cpf: cpf.replace(/\D/g, ''),
        password
      });

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);

      return role; 
    } catch (error) {
      throw error
    }
  },
  
  logout({ }) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },
}
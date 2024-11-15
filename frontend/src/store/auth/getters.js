export const getters = {
  isAuthenticated(state) {
    return !!state.token;
  },
  isAdmin() {
    const role = localStorage.getItem('role')
    return role === 'admin'
  }
}
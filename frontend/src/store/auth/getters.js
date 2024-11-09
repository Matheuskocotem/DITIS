export const getters = {
  isAuthenticated(state) {
    return !!state.token;
  }
}
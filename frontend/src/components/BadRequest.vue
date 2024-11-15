<template>
  <div class="bad-request">
    <h1>403 - Acesso Negado</h1>
    <p>Você não tem permissão para acessar esta página.</p>
    <button @click="goToDashboard">Voltar para a Dashboard</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToDashboard() {
      this.$router.push({ name: 'Dashboard' });
    },
  },
};
</script>

<style scoped>
.bad-request {
  text-align: center;
  margin-top: 20px;
}
</style>
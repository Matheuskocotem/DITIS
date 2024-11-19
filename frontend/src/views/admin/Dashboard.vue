<template>
  <div class="dashboard">
    <AdminSidebar />

    <div class="main-content">
      <h1 class="py-5">Dashboard</h1>

      <section class="summary-cards">
        <div v-for="(card, index) in summaryCards" :key="index" class="card">
          <div class="card-content">
            <i :class="card.icon" class="card-icon pr-5"></i>
            <div>
              <p class="card-title">{{ card.title }}</p>
              <p class="card-value">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="dashboard">
        <div class="calendar-container">
          <Calendar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminSidebar from "@/components/AdminSidebar.vue";
import Calendar from '@/components/Calendar.vue'
import { apiGetSummaryData } from "@/http";

const summaryCards = ref([
  { title: "Total de Reservas", value: "Carregando...", icon: "fas fa-calendar" },
  { title: "Salas Disponíveis", value: "Carregando...", icon: "fas fa-th" },
  { title: "Usuários", value: "Carregando...", icon: "fas fa-users" },
]);

async function fetchSummaryData() {
  try {
    const data = await apiGetSummaryData();

    summaryCards.value = [
      { title: "Total de Reservas", value: data.totalReservas, icon: "fas fa-calendar" },
      { title: "Salas Disponíveis", value: data.salasDisponiveis, icon: "fas fa-th" },
      { title: "Usuários", value: data.totalUsuarios, icon: "fas fa-users" },
    ];
  } catch (error) {
    toast.error(`Erro ao buscar dados do resumo: ${error.response.data.message}`);
  }
}

onMounted(fetchSummaryData);
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 40px;
}

.dashboard {
  height: 100%;
  overflow-y: auto;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
  color:#2B73B4;
  font-size: 30px;
}

.card-value{
  font-size: 30px;
  font-weight: 600;
}
</style>

<template>
  <div class="dashboard">
    <AdminSidebar />

    <div class="main-content">
      <header class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <div class="dashboard-actions">
          <button class="refresh-btn" @click="fetchSummaryData">
            <i class="fas fa-sync-alt"></i> Atualizar Dados
          </button>
        </div>
      </header>

      <section class="summary-cards">
        <div v-for="(card, index) in summaryCards" :key="index" class="summary-card">
          <div class="card-content">
            <div class="card-icon-wrapper">
              <i :class="card.icon" class="card-icon"></i>
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-value">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="calendar-section">
        <Calendar />
      </div>

      <section class="data-analytics">
        <div class="chart-container">
          <h2 class="section-title">Ocupação de Salas</h2>
          <div class="chart-placeholder">
            <i class="fas fa-chart-bar chart-icon"></i>
            <p>Dados de ocupação das salas serão exibidos aqui</p>
          </div>
        </div>
      </section>
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
.dashboard {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.dashboard-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #edf2f7;
    color: #2B73B4;
  }

  i {
    font-size: 0.875rem;
  }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  background-color: rgba(43, 115, 180, 0.1);
}

.card-icon {
  color: #2B73B4;
  font-size: 1.5rem;
}

.card-info {
  flex: 1;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.calendar-section {
  margin-bottom: 2rem;
}

.data-analytics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

.chart-icon {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

@media (max-width: 1023px) {
  .main-content {
    padding: 1.5rem;
  }

  .summary-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>

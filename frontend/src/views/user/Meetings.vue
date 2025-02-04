<template>
  <div class="visualizar-reunioes">
    <SideBar class="sidebar" />

    <div class="content">
      <h1>Visualizar Reuniões</h1>

      <div v-if="meetings.length > 0" class="reunioes-list">
        <div v-for="meeting in meetings" :key="meeting.id" class="reuniao-card">
          <div class="reuniao-info">
            <h3>{{ meeting.title }}</h3>
            <p><strong>Sala:</strong> {{ meeting.room.nome }}</p>
            <p><strong>Data e Hora:</strong> {{ formatMeetingDate(meeting) }}</p>
          </div>
          <div class="action-container">
            <BadgeStatus :status="meeting.status" />
            <button
              v-if="meeting.status === 'canceled'"
              class="restore-btn"
              @click="updateStatus(meeting.id, 'confirmed')"
            >
              Reativar
            </button>
            <button v-else class="cancel-btn" @click="updateStatus(meeting.id, 'canceled')">
              Cancelar
            </button>
          </div>
        </div>
      </div>
  
      <div v-else>
        <p class="no-meetings">Não há reuniões agendadas.</p>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/Sidebar.vue';
import { apiGetUserMeetings, apiUpdateStatus } from '@/http';
import { toast } from 'vue3-toastify';
import BadgeStatus from './components/BadgeStatus.vue'

export default {
  components: {
    SideBar,
    BadgeStatus,
  },
  data() {
    return {
      meetings: [],
    };
  },
  mounted() {
    this.fetchMeetings();
  },
  methods: {
    formatMeetingDate(meeting) {
      const date = new Date(meeting.date); 
      const formattedDate = date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
      });
      const startTime = meeting.start_time.slice(0, 5);
      const endTime = meeting.end_time.slice(0, 5);

      return `${formattedDate} - ${startTime} às ${endTime}`;
    },
    async fetchMeetings() {
      try {
        const data = await apiGetUserMeetings()
        console.log(data);
        
        this.meetings = data;
      } catch (error) {
        toast.error('Erro ao buscar reuniões:', { autoClose: 5000 });
      }
    },
    async updateStatus(id, status) {
      try {
        const payload = {
          status
        }
        await apiUpdateStatus(id, payload)

        toast.success('Status da reunião alterado com sucesso', { autoClose: 5000 });
        const updatedMeetings = this.meetings.map((meeting) => (
          meeting.id === id ? { ...meeting, status } : meeting
        ))

        this.meetings = []

        this.$nextTick(() => {
          this.meetings = [...updatedMeetings]
        });
      } catch(error) {
        toast.error(error.response.data.message);
      }
    }
  },
};
</script>


<style lang="scss" scoped>
.visualizar-reunioes {
  display: flex;
  padding: 20px;
  background-color: #f9f9f9;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 250px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.content {
  margin-left: 250px;
  padding: 20px;
  flex: 1;
  background-color: #f9f9f9;
}

.reunioes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reuniao-card {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.reuniao-card:hover {
  transform: translateY(-3px);
}

.reuniao-info h3 {
  margin: 0;
  font-size: 20px;
  color: #4c51bf;
}

.reuniao-info p {
  margin: 5px 0;
  color: #666; 
}

.reuniao-info strong {
  color: #333;
}

.no-meetings {
  font-size: 18px;
  color: #777;
  text-align: center;
}

.action-container {
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    border-radius: 8px;
    outline: none;
  }

  .restore-btn {
    background-color: #0056b3;
    color: #ffffff;
    border-color: #0056b3;

    &:hover {
      background-color: #4c51bf;
    }
  }

  .cancel-btn {
    background-color: #ff0000;
    color: #ffffff;
    border-color: #ff0000;

    &:hover {
      background-color: #DC3545;
    }
  }
}
</style>

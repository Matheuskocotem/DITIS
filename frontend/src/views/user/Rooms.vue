<template>
  <div class="min-h-screen bg-gray-100 flex">
    <SideBar class="sidebar" />

    <div class="content">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Salas de Reunião</h1>

      <RoomList 
        :rooms="rooms" 
        @open-reservation="openReservationModal"
      />

      <ReservationModal 
        v-if="showReservationModal"
        :room="selectedRoom"
        @close="closeReservationModal"
        @submit="submitReservation"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RoomList from './components/RoomList.vue';
import ReservationModal from './components/ReservationModal.vue';
import SideBar from '@/components/Sidebar.vue';
import { apiCreateMeeting, apiGetMeetingRooms, apiGetAllMeetings } from '@/http'; // Importa a função para obter as reuniões
import { toast } from 'vue3-toastify';

const rooms = ref([]);
const showReservationModal = ref(false);
const selectedRoom = ref(null);
const loading = ref(false); // Estado para o carregamento das salas

// Função para carregar as salas de reunião
const fetchRooms = async () => {
  loading.value = true; // Ativa o carregamento
  try {
    const data = await apiGetMeetingRooms();     
    rooms.value = data;
  } catch (error) {
    toast.error(
      'Erro ao carregar as salas: ' + (error.response?.data?.message || 'Erro desconhecido.'),
      { autoClose: 5000 }
    );
  } finally {
    loading.value = false; // Desativa o carregamento
  }
};

// Abre o modal de reserva e define a sala selecionada
const openReservationModal = (room) => {
  selectedRoom.value = room;
  showReservationModal.value = true;
};

// Fecha o modal de reserva
const closeReservationModal = () => {
  showReservationModal.value = false;
  selectedRoom.value = null;
};

// Função para submeter a reserva
const submitReservation = async (value) => {
  // Validação simples para garantir que todos os campos necessários estão preenchidos
  if (!value.title || !value.description || !value.date || !value.startTime || !value.endTime) {
    toast.error('Preencha todos os campos obrigatórios.', { autoClose: 5000 });
    return;
  }

  // Verifica se já existe uma reunião na mesma sala e horário
  const allMeetings = await apiGetAllMeetings(); // Obtem todas as reuniões
  const isRoomAvailable = !allMeetings.some((meeting) => {
    // Verifica se a sala e o horário coincidem
    return (
      meeting.room_id === value.roomId &&
      ((meeting.start_time >= value.startTime && meeting.start_time < value.endTime) || 
      (meeting.end_time > value.startTime && meeting.end_time <= value.endTime))
    );
  });

  if (!isRoomAvailable) {
    toast.error('A sala já está reservada para esse horário.', { autoClose: 5000 });
    return; // Não submete a reserva se a sala estiver ocupada
  }

  const payload = {
    room_id: value.roomId,
    title: value.title,
    description: value.description,
    date: value.date,
    start_time: value.startTime,
    end_time: value.endTime,
  };

  try {
    await apiCreateMeeting(payload); // Chama a API para criar a reunião
    toast.success('Reserva submetida', { autoClose: 5000 });
    closeReservationModal(); // Fecha o modal após sucesso
  } catch (error) {
    toast.error(`Erro ao submeter reserva: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
  }
};

// Chama a função para buscar as salas ao montar o componente
onMounted(fetchRooms);
</script>

<style scoped>
.min-h-screen {
  background-color: #f7fafc;
  display: flex;
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
  flex: 1;
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4c51bf;
  color: #ffffff;
}

button:hover {
  background-color: #434190;
}
</style>

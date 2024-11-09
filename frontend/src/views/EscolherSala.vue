  <template>
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Sidebar fixa à esquerda -->
      <SideBar class="sidebar" />

      <!-- Conteúdo principal -->
      <div class="content">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Salas de Reunião</h1>

        <!-- Lista de Salas -->
        <RoomList 
          :rooms="filteredRooms" 
          @open-reservation="openReservationModal"
        />

        <!-- Modal de Reserva -->
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
  import { ref, computed, onMounted } from 'vue';
  import RoomList from '../components/RoomList.vue';
  import ReservationModal from '../components/ReservationModalSalas.vue';
  import SideBar from '../components/Sidebar.vue';
  import api from '../lib/axios.js';

  const rooms = ref([]);
  const filteredRooms = computed(() => rooms.value);

  const showReservationModal = ref(false);
  const selectedRoom = ref(null);

  const selectedStartTime = ref(null)
  const selectedEndTime = ref(null)

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  // Função para buscar as salas da API
  const fetchRooms = async () => {
    if (!isAuthenticated()) {
      console.error('Usuário não autenticado');
      // Redirecionamento para login, se necessário
      return;
    }
    
    try {
      const response = await api.get('http://localhost:8000/api/meeting-rooms/');
      rooms.value = response.data; // Atribuir resposta ao array rooms
    } catch (error) {
      console.error('Erro ao buscar salas:', error.response?.data || error.message);
    }
  };

  // Funções para abrir e fechar o modal de reserva
  const openReservationModal = (room) => {
    selectedRoom.value = room;
    showReservationModal.value = true;
  };

  const closeReservationModal = () => {
    showReservationModal.value = false;
    selectedRoom.value = null;
  };

  // Função para submeter a reserva
  const submitReservation = async () => {
    if (!selectedRoom.value || !selectedStartTime.value || !selectedEndTime.value) {
      console.error('Por favor, preencha todos os campos!');
      return;
    }

    const reservationData = {
      room_id: selectedRoom.value.id,        // ID da sala
      start_time: selectedStartTime.value,   // Horário de início
      end_time: selectedEndTime.value,       // Horário de término
      title: 'Título da Reserva',            // Título da reserva (aqui você pode pegar dinamicamente, se necessário)
    };

    try {
      const response = await api.post('/api/meetings', reservationData); 
      console.log('Reserva submetida:', response.data);
      closeReservationModal();
    } catch (error) {
      console.error('Erro ao submeter reserva:', error.response?.data || error.message);
    }
  };


  // Chama a função fetchRooms ao montar o componente
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

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
  import { apiCreateMeeting, apiGetMeetingRooms } from '@/http';
  import { toast } from 'vue3-toastify';

  const rooms = ref([]);

  const showReservationModal = ref(false);
  const selectedRoom = ref(null);

  const fetchRooms = async () => {
    try {
      const data = await apiGetMeetingRooms();     
      rooms.value = data;
    } catch (error) {
      toast.error(
        'Erro ao registrar: ' + (error.response?.data?.message || 'Erro desconhecido.'),
        { autoClose: 5000 }
      );
    }
  };

  const openReservationModal = (room) => {
    selectedRoom.value = room;
    showReservationModal.value = true;
  };

  const closeReservationModal = () => {
    showReservationModal.value = false;
    selectedRoom.value = null;
  };

  const submitReservation = async (value) => {
    const payload = {
      room_id: value.roomId,
      title: value.title,
      description: value.descriotion,
      date: value.date,
      start_time: value.startTime,
      end_time: value.endTime,
    };

    try {
      await apiCreateMeeting(payload) 
      toast.success('Reserva submetida', { autoClose: 5000 });
      closeReservationModal();
    } catch (error) {
      toast.error(`Erro ao submeter reserva: ${error.response?.data.message || error.message}`);
    }
  };

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

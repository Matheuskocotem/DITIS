<template>
  <div class="rooms">
    <AdminSidebar />
    <div class="d-flex justify-content-between">
      <h2>Gerenciar Salas</h2>
      <button class="btn btn-primary" @click="openModal('add')">
        Adicionar Nova Sala
      </button>
    </div>
    <table class="rooms-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Capacidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.nome }}</td>
          <td>{{ room.capacidade }}</td>
          <td>
            <button class="btn btn-edit" @click="openModal('edit', room)">Editar</button>
            <button class="btn btn-delete" @click="deleteRoom(room.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ModalComponent
      :showModal="showModal"
      @close="closeModal"
      :title="modalType === 'add' ? 'Adicionar Nova Sala' : 'Editar Sala'"
    >
      <template #modal-body>
        <form @submit.prevent="handleSubmit" id="roomForm">
          <div class="form-group">
            <label for="roomName">Nome da Sala:</label>
            <input type="text" class="form-control" id="roomName" v-model="currentRoom.nome" required>
          </div>

          <div class="form-group">
            <label for="roomLocation">Localização:</label>
            <input type="text" id="roomLocation" class="form-control" v-model="currentRoom.localizacao" required>
          </div>

          <div class="form-group">
            <label for="roomCapacity">Capacidade:</label>
            <input type="number" class="form-control" id="roomCapacity" v-model="currentRoom.capacidade" required min="1">
          </div>

          <div class="form-group">
            <label for="roomResources">Recursos:</label>
            <input type="text" class="form-control" id="roomResources" v-model="currentRoom.recursos">
          </div>
          
          <div class="form-group">
            <label for="roomDescription">Descrição:</label>
            <textarea id="roomDescription" class="form-control" v-model="currentRoom.descricao"></textarea>
          </div>
        </form>
      </template>
      <template #modal-footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeModal"
        >
          Cancelar
        </button>

        <button
          type="submit"
          form="roomForm"
          class="btn btn-primary"
        >
          {{ modalType === 'add' ? 'Adicionar' : 'Atualizar' }}
        </button>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import ModalComponent from '@/components/Modal.vue'
import { apiAddRoom, apiDeleteRoom, apiGetMeetingRooms, apiUpdateRoom } from '@/http';
import { toast } from 'vue3-toastify';

const rooms = ref([]);
const showModal = ref(false);
const editRoomId = ref(null)
const modalType = ref(null);
const currentRoom = ref({
  nome: '',
  capacidade: null,
  localizacao: '',
  recursos: '',
  descricao: ''
});

const openModal = (type, room = null) => {
  modalType.value = type;
  showModal.value = true;

  if (type === 'edit' && room) {
    editRoomId.value = room.id

    currentRoom.value = {
      nome: room.nome,
      capacidade: room.capacidade,
      localizacao: room.localizacao,
      recursos: room.recursos.join(', '),
      descricao: room.descricao,
    }
  }
}

const closeModal = () => {
  showModal.value = false
  editRoomId.value = null
  currentRoom.value = {
    nome: '',
    capacidade: null,
    localizacao: '',
    recursos: '',
    descricao: ''
  }
}

const formatPayload = () => {
  return {
    ...currentRoom.value,
    recursos: currentRoom.value.recursos.split(/,\s*/),
  }
}

const addRoom = async () => {
  try {
    const payload = formatPayload()

    const room = await apiAddRoom(payload);
    rooms.value.push(room);
    
    closeModal();
    toast.success("Sala criada com sucesso!", { autoClose: 5000 });
  } catch (error) {
    toast.error("Erro ao adicionar sala", { autoClose: 5000 });
  }
};

const updateRoom = async () => {
  try {
    const payload = formatPayload()

    const updatedRoom = await apiUpdateRoom(editRoomId.value, payload)

    rooms.value = rooms.value.map((room) => {
      if (room.id === updatedRoom.id) {
        return updatedRoom;
      }

      return room;
    })

    closeModal();
    toast.success("Sala atualizada com sucesso!", { autoClose: 5000 });
  } catch (error) {
    toast.error("Erro ao atualizar sala", { autoClose: 5000 });
  }
};

const deleteRoom = async (id) => {
  try {
    await apiDeleteRoom(id);

    toast.success("Sala removida com sucesso!", { autoClose: 5000 });

    rooms.value = rooms.value.filter((room) => room.id !== id);
  } catch (error) {
    toast.error("Erro ao excluir sala", { autoClose: 5000 });
  }
};

const handleSubmit = () => {
  modalType.value === 'add' ? addRoom() : updateRoom()
}

onMounted(async () => {
  try {
    const data = await apiGetMeetingRooms();
    rooms.value = data;
  } catch (error) {
    toast.error(`Erro ao carregar salas: ${error}`, { autoClose: 5000 });
  }
});
</script>


<style scoped>
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

.rooms {
  font-family: Inter;
  margin-left: 250px;
  padding: 1rem; 
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.rooms-table th,
.rooms-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.rooms-table th {
  background-color: #f3f4f6;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3b82f6;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #9ca3af;
  color: #fff;
  border: none;
}

.btn-secondary:hover {
  background-color: #6b7280;
}

.btn-edit {
  background-color: #10b981;
  color: #fff;
  border: none;
  margin-right: 0.5rem;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
  color: #fff;
  border: none;
}

.btn-delete:hover {
  background-color: #dc2626;
}

/* Estilo do modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal-content {
  background: #ffffff;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>

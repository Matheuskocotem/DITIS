<template>
  <div class="rooms">
    <AdminSidebar />
    
    <div class="content-wrapper">
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="fas fa-building"></i> Gerenciar Salas
          </h1>
          <p class="page-description">Cadastre, edite e gerencie as salas de reunião</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-primary" @click="openModal('add')">
            <i class="fas fa-plus"></i>
            Adicionar Nova Sala
          </button>
        </div>
      </header>

      <main class="page-content">
        <div class="card">
          <DataTable
            :columns="tableColumns"
            :items="rooms"
            :loading="isLoading"
            :pagination="true"
            :initialItemsPerPage="10"
            :hasActions="true"
            searchPlaceholder="Buscar por nome ou localização..."
          >
            <!-- Slot para ações na linha da tabela -->
            <template #row-actions="{ item }">
              <button 
                class="action-btn edit-btn" 
                @click="openModal('edit', item)"
                title="Editar"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="action-btn delete-btn" 
                @click="deleteRoom(item.id)"
                title="Excluir"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </template>
            
            <!-- Formatação personalizada para recursos -->
            <template #recursos="{ value }">
              <div class="resource-tags">
                <span v-for="(recurso, index) in value" :key="index" class="resource-tag">
                  {{ recurso }}
                </span>
              </div>
            </template>
          </DataTable>
        </div>
      </main>
    </div>

    <!-- Modal para adicionar/editar sala -->
    <Modal 
      :show="showModal" 
      :title="modalType === 'add' ? 'Adicionar Nova Sala' : 'Editar Sala'"
      :max-width="'650px'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="room-form">
        <FormInput
          v-model="currentRoom.nome"
          label="Nome da Sala"
          placeholder="Digite o nome da sala"
          icon="fas fa-door-open"
          :validator="validateRoomName"
          required
        />

        <FormInput
          v-model="currentRoom.localizacao"
          label="Localização"
          placeholder="Digite a localização da sala"
          icon="fas fa-map-marker-alt"
          required
        />

        <div class="form-row">
          <FormInput
            v-model="currentRoom.capacidade"
            label="Capacidade"
            placeholder="Digite a capacidade da sala"
            icon="fas fa-users"
            type="number"
            min="1"
            required
          />
          
          <FormInput
            v-model="currentRoom.recursos"
            label="Recursos"
            placeholder="Ex: Projetor, Wi-fi, Quadro"
            icon="fas fa-toolbox"
            helper="Separe os recursos por vírgulas"
          />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <div class="textarea-wrapper">
            <i class="fas fa-align-left icon"></i>
            <textarea 
              v-model="currentRoom.descricao" 
              placeholder="Descreva detalhes sobre a sala"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <i v-if="isSubmitting" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ modalType === 'add' ? 'Adicionar' : 'Atualizar' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import Modal from '@/components/Modal.vue';
import DataTable from '@/components/DataTable.vue';
import FormInput from '@/components/FormInput.vue';
import { apiAddRoom, apiDeleteRoom, apiGetMeetingRooms, apiUpdateRoom } from '@/http';
import { toast } from 'vue3-toastify';

const rooms = ref([]);
const showModal = ref(false);
const editRoomId = ref(null);
const modalType = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const currentRoom = ref({
  nome: '',
  capacidade: null,
  localizacao: '',
  recursos: '',
  descricao: ''
});

const tableColumns = [
  { key: 'nome', label: 'Nome da Sala', sortable: true },
  { key: 'capacidade', label: 'Capacidade', sortable: true },
  { key: 'localizacao', label: 'Localização', sortable: true },
  { key: 'recursos', label: 'Recursos', sortable: false, slot: 'recursos' },
];

const validateRoomName = (value) => {
  if (!value || value.trim().length < 3) {
    return 'O nome da sala deve ter pelo menos 3 caracteres';
  }
  return null;
};

const openModal = (type, room = null) => {
  modalType.value = type;
  showModal.value = true;

  if (type === 'edit' && room) {
    editRoomId.value = room.id;

    currentRoom.value = {
      nome: room.nome,
      capacidade: room.capacidade,
      localizacao: room.localizacao,
      recursos: Array.isArray(room.recursos) ? room.recursos.join(', ') : room.recursos,
      descricao: room.descricao || '',
    };
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
  isSubmitting.value = true;
  try {
    console.log('Starting addRoom process');
    const payload = formatPayload();
    console.log('Formatted payload:', payload);

    const response = await apiAddRoom(payload);
    console.log('Response received:', response);
    
    // Extract room data from the nested response
    const roomData = response.room;
    
    // Check if room data has the expected structure before adding to the list
    if (roomData && typeof roomData === 'object') {
      rooms.value.push(roomData);
      closeModal();
      toast.success(response.message || "Sala criada com sucesso!");
    } else {
      console.error('Invalid room data returned:', response);
      toast.error("Formato de resposta inválido do servidor");
    }
  } catch (error) {
    console.error('Error in addRoom:', error);
    const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido";
    console.error('Error message:', errorMsg);
    toast.error(`Erro ao adicionar sala: ${errorMsg}`);
  } finally {
    isSubmitting.value = false;
  }
};

const updateRoom = async () => {
  isSubmitting.value = true;
  try {
    const payload = formatPayload();

    const response = await apiUpdateRoom(editRoomId.value, payload);
    console.log('Update response:', response);
    
    // Extract room data from the nested response
    const updatedRoom = response.room || response;

    if (updatedRoom && typeof updatedRoom === 'object') {
      rooms.value = rooms.value.map((room) => {
        if (room.id === updatedRoom.id) {
          return updatedRoom;
        }
        return room;
      });

      closeModal();
      toast.success(response.message || "Sala atualizada com sucesso!");
    } else {
      console.error('Invalid room data returned:', response);
      toast.error("Formato de resposta inválido do servidor");
    }
  } catch (error) {
    console.error('Error in updateRoom:', error);
    const errorMsg = error.response?.data?.message || error.message || "Erro desconhecido";
    toast.error(`Erro ao atualizar sala: ${errorMsg}`);
  } finally {
    isSubmitting.value = false;
  }
};

const deleteRoom = async (id) => {
  if (!confirm("Tem certeza que deseja excluir esta sala?")) return;
  
  isLoading.value = true;
  try {
    await apiDeleteRoom(id);
    toast.success("Sala removida com sucesso!");
    rooms.value = rooms.value.filter((room) => room.id !== id);
  } catch (error) {
    toast.error(`Erro ao excluir sala: ${error.response?.data?.message || "Erro desconhecido"}`);
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  modalType.value === 'add' ? addRoom() : updateRoom()
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await apiGetMeetingRooms();
    rooms.value = data;
  } catch (error) {
    toast.error(`Erro ao carregar salas: ${error.response?.data?.message || "Erro desconhecido"}`);
  } finally {
    isLoading.value = false;
  }
});
</script>


<style scoped>
.rooms {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-light);
}

.content-wrapper {
  flex: 1;
  margin-left: 250px;
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.page-title i {
  margin-right: 0.5rem;
  color: var(--primary);
}

.page-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

/* Formatação de tabela e ações */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 2px;
}

.action-btn:hover {
  background-color: var(--bg-light);
}

.edit-btn {
  color: var(--primary);
}

.delete-btn {
  color: var(--danger);
}

/* Estilos para formulário de sala */
.room-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.textarea-wrapper {
  position: relative;
}

.textarea-wrapper .icon {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: var(--text-muted);
}

.textarea-wrapper textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.textarea-wrapper textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.resource-tag {
  display: inline-block;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    margin-top: 1rem;
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

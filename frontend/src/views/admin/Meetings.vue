<template>
  <div class="meetings">
    <AdminSidebar />
    
    <div class="content-wrapper">
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <i class="fas fa-calendar-alt"></i> Gerenciar Reuniões
          </h1>
          <p class="page-description">Agende, edite e monitore reuniões no sistema</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-primary" @click="openModal('add')">
            <i class="fas fa-plus"></i>
            Adicionar Nova Reunião
          </button>
        </div>
      </header>

      <main class="page-content">
        <div class="card">
          <DataTable
            :columns="tableColumns"
            :items="upcomingMeetings"
            :loading="isLoading"
            :pagination="true"
            :initialItemsPerPage="10"
            :hasActions="true"
            searchPlaceholder="Buscar por título ou responsável..."
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
                @click="deleteMeeting(item.id)"
                title="Cancelar"
              >
                <i class="fas fa-times-circle"></i>
              </button>
            </template>
            
            <!-- Formatação personalizada para status -->
            <template #status="{ value }">
              <span :class="getStatusBadgeClass(value)">
                {{ getStatusLabel(value) }}
              </span>
            </template>
          </DataTable>
        </div>
      </main>
    </div>

    <!-- Modal para adicionar/editar reunião -->
    <Modal 
      :show="showModal" 
      :title="modalType === 'add' ? 'Adicionar Nova Reunião' : 'Editar Reunião'"
      :max-width="'700px'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="meeting-form">
        <div class="form-row">
          <FormInput
            v-model="newMeeting.title"
            label="Título da Reunião"
            placeholder="Digite o título da reunião"
            icon="fas fa-heading"
            :validator="validateTitle"
            required
          />
          
          <FormInput
            v-model="newMeeting.room_id"
            label="Sala"
            placeholder="Selecione a sala"
            icon="fas fa-door-open"
            type="select"
            :options="roomOptions"
            required
          />
        </div>

        <div class="form-row">
          <FormInput
            v-model="newMeeting.user_id"
            label="Responsável"
            placeholder="Selecione o responsável"
            icon="fas fa-user"
            type="select"
            :options="userOptions"
            required
          />
          
          <FormInput
            v-model="newMeeting.status"
            label="Status"
            placeholder="Selecione o status"
            icon="fas fa-info-circle"
            type="select"
            :options="statusOptions"
            required
          />
        </div>

        <div class="form-row">
          <FormInput
            v-model="newMeeting.date"
            label="Data"
            placeholder="Selecione a data"
            icon="fas fa-calendar"
            type="date"
            required
          />
        </div>

        <div class="form-row">
          <FormInput
            v-model="newMeeting.start_time"
            label="Horário de Início"
            placeholder="Digite o horário de início"
            icon="fas fa-clock"
            type="time"
            required
          />
          
          <FormInput
            v-model="newMeeting.end_time"
            label="Horário de Término"
            placeholder="Digite o horário de término"
            icon="fas fa-clock"
            type="time"
            required
          />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <div class="textarea-wrapper">
            <i class="fas fa-align-left icon"></i>
            <textarea 
              v-model="newMeeting.description" 
              placeholder="Descreva detalhes sobre a reunião"
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
import Modal from '@/components/Modal.vue';
import { ref, onMounted, computed } from 'vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import DataTable from '@/components/DataTable.vue';
import FormInput from '@/components/FormInput.vue';
import { apiCreateMeeting, apiGetAllMeetings, apiUpdateMeeting, apiDeleteMeeting, apiGetUserOptions, apiGetRoomOptions, apiGetMeetingStatusOptions } from '@/http';
import { toast } from 'vue3-toastify';

// Não precisamos do useConfirm, usaremos o confirm nativo do navegador
const isLoading = ref(false);
const isSubmitting = ref(false);
const upcomingMeetings = ref([]);
const showModal = ref(false);
const modalType = ref(null);
const editMeetingId = ref(null);
const rooms = ref([]);
const users = ref([]);

// Opções de status já virão formatadas da API
const statusOptions = ref([]);

// Computed property para gerar as opções de usuários para select
const userOptions = computed(() => {
  console.log('Processando user options a partir de:', users.value);
  return users.value || [];
});

// Computed property para gerar as opções de salas para select
const roomOptions = computed(() => {
  console.log('Processando room options a partir de:', rooms.value);
  // Verificar se os valores estão vindo corretamente
  if (rooms.value && rooms.value.length > 0) {
    console.log('Primeiro item da sala:', rooms.value[0]);
  }
  return rooms.value || [];
});

// Função para buscar opções de status
async function fetchStatusOptions() {
  try {
    const options = await apiGetMeetingStatusOptions();
    console.log('Opções de status carregadas:', options);
    statusOptions.value = options;
  } catch (error) {
    console.error('Erro ao buscar opções de status:', error);
    // Fallback para opções padrão
    statusOptions.value = [
      { value: 'confirmed', label: 'Confirmada' },
      { value: 'canceled', label: 'Cancelada' }
    ];
  }
}

// Configuração da tabela
const tableColumns = [
  { key: 'room', label: 'Sala', sortable: true },
  { key: 'title', label: 'Título', sortable: true },
  { key: 'date', label: 'Data', sortable: true },
  { key: 'time', label: 'Horário', sortable: true },
  { key: 'organizer', label: 'Responsável', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
];

const newMeeting = ref({
  room_id: '',
  user_id: '',
  title: '',
  description: '',
  date: '',
  start_time: '',
  end_time: '',
  status: 'confirmed',
});

// Validadores para o formulário
const validateTitle = (value) => {
  if (!value.trim()) return 'O título é obrigatório';
  if (value.length < 3) return 'O título deve ter pelo menos 3 caracteres';
  if (value.length > 100) return 'O título deve ter no máximo 100 caracteres';
  return true;
};

// Formatação do status
const getStatusBadgeClass = (status) => {
  return {
    'status-badge': true,
    'status-confirmed': status === 'confirmed',
    'status-canceled': status === 'canceled'
  };
};

const getStatusLabel = (status) => {
  const statusMap = {
    'confirmed': 'Confirmada',
    'canceled': 'Cancelada'
  };
  return statusMap[status] || status;
};

function openModal(type, meeting) {
  modalType.value = type;
  showModal.value = true;

  // Reset form
  resetMeetingForm();
  
  if (type === 'edit' && meeting) {
    editMeetingId.value = meeting.id;
    
    // Preencher o formulário com os dados da reunião selecionada
    newMeeting.value = {
      room_id: meeting.room_id,
      user_id: meeting.user_id || '',
      title: meeting.title,
      description: meeting.description || '',
      date: meeting.date,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      status: meeting.status || 'confirmed',
    };
  } else if (type === 'add') {
    // Para nova reunião, pré-seleciona a primeira sala disponível (se houver)
    if (rooms.value.length > 0) {
      newMeeting.value.room_id = rooms.value[0].id;
    }
  }
}

function resetMeetingForm() {
  newMeeting.value = {
    room_id: rooms.value.length > 0 ? rooms.value[0].id : '',
    user_id: '',
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'confirmed',
  };
}

function closeModal() {
  showModal.value = false;
  modalType.value = null;
  editMeetingId.value = null;
}

function formatFetchedMeeting(meeting) {
  try {
    return {
      ...meeting,
      time: `${meeting.start_time || ''} - ${meeting.end_time || ''}`,
      organizer: meeting.organizer_name || meeting.user?.name || 'Não especificado',
      room: meeting.room?.nome || meeting.room?.name || 'Não especificado'
    }
  } catch (error) {
    console.error('Erro ao formatar reunião:', error, meeting);
    return {
      ...meeting,
      time: 'Horário não definido',
      organizer: 'Não especificado',
      room: 'Não especificado'
    };
  }
}

async function fetchMeetings() {
  try {
    isLoading.value = true;
    const response = await apiGetAllMeetings();
    // Verifica se a resposta tem o formato esperado
    const meetings = response.data || response;
    if (Array.isArray(meetings)) {
      upcomingMeetings.value = meetings.map((meeting) => {
        return formatFetchedMeeting(meeting);
      });
    } else {
      console.error('Formato de resposta inesperado:', meetings);
      upcomingMeetings.value = [];
    }
  } catch (error) {
    console.error('Erro ao buscar reuniões:', error);
    toast.error(error.response?.data?.message || 'Erro ao carregar reuniões', { autoClose: 5000 });
    upcomingMeetings.value = [];
  } finally {
    isLoading.value = false;
  }
};

function formatPayload() {
  return {
    ...newMeeting.value,
    date: new Date(newMeeting.value.date).toISOString().split('T')[0], 
  };
}

function increaseMeetings(type, meeting) {
  if (type === 'add') {
    upcomingMeetings.value = [
      ...upcomingMeetings.value,
      {...formatFetchedMeeting(meeting)}
    ]
  } else {
    upcomingMeetings.value = upcomingMeetings.value.map((currentMeeting) => {
      if (currentMeeting.id === meeting.id) {
        return {...formatFetchedMeeting(meeting)};
      }

      return currentMeeting;
    })
  }
}

async function addMeeting() {
  try {
    isSubmitting.value = true;
    const payload = formatPayload();
    const response = await apiCreateMeeting(payload);
    
    upcomingMeetings.value = [formatFetchedMeeting(response.data), ...upcomingMeetings.value];
    toast.success('Reunião criada com sucesso!', { autoClose: 3000 });
    closeModal();
  } catch (error) {
    console.error('Erro ao criar reunião:', error);
    toast.error(error.response?.data?.message || 'Erro ao criar reunião', { autoClose: 5000 });
  } finally {
    isSubmitting.value = false;
  }
}

async function updateMeeting() {
  try {
    isSubmitting.value = true;
    const payload = formatPayload();
    const response = await apiUpdateMeeting(editMeetingId.value, payload);
    
    // Atualizar reunião na lista
    const index = upcomingMeetings.value.findIndex(m => m.id === editMeetingId.value);
    if (index !== -1) {
      upcomingMeetings.value[index] = formatFetchedMeeting(response.data);
    }
    
    toast.success('Reunião atualizada com sucesso!', { autoClose: 3000 });
    closeModal();
  } catch (error) {
    console.error('Erro ao atualizar reunião:', error);
    toast.error(error.response?.data?.message || 'Erro ao atualizar reunião', { autoClose: 5000 });
  } finally {
    isSubmitting.value = false;
  }
}

// Função para excluir reunião
async function deleteMeeting(id) {
  try {
    // Usando o confirm nativo do navegador
    if (!confirm('Tem certeza que deseja cancelar esta reunião? Esta ação não pode ser desfeita.')) return;
    
    isLoading.value = true;
    await apiDeleteMeeting(id);
    
    // Remover da lista
    upcomingMeetings.value = upcomingMeetings.value.filter(meeting => meeting.id !== id);
    toast.success('Reunião cancelada com sucesso!', { autoClose: 3000 });
  } catch (error) {
    console.error('Erro ao cancelar reunião:', error);
    toast.error(error.response?.data?.message || 'Erro ao cancelar reunião', { autoClose: 5000 });
  } finally {
    isLoading.value = false;
  }
}

// Função para lidar com a submissão do formulário
function handleSubmit() {
  modalType.value === 'add' ? addMeeting() : updateMeeting();
}

// Função para buscar opções de salas diretamente formatadas para o select
async function fetchRooms() {
  try {
    const roomOptions = await apiGetRoomOptions();
    console.log('Opções de salas carregadas:', roomOptions);
    
    if (Array.isArray(roomOptions)) {
      // Atribuir diretamente as opções formatadas
      rooms.value = roomOptions;
      
      // Se temos salas, pré-selecionar a primeira sala
      if (roomOptions.length > 0 && !newMeeting.value.room_id) {
        newMeeting.value.room_id = roomOptions[0].value;
      }
    } else {
      console.error('Formato de resposta inesperado para opções de salas:', roomOptions);
      rooms.value = [];
    }
  } catch (error) {
    console.error('Erro ao buscar opções de salas:', error);
    toast.error('Erro ao carregar salas. Por favor, tente novamente.', { autoClose: 5000 });
    rooms.value = [];
  }
}

// Função para buscar opções de usuários diretamente formatadas para o select
async function fetchUsers() {
  try {
    const userOptions = await apiGetUserOptions();
    console.log('Opções de usuários carregadas:', userOptions);
    
    if (Array.isArray(userOptions)) {
      // Atribuir diretamente as opções formatadas
      users.value = userOptions;
      
      // Se temos usuários, pré-selecionar o primeiro usuário
      if (userOptions.length > 0 && !newMeeting.value.user_id) {
        newMeeting.value.user_id = userOptions[0].value;
      }
    } else {
      console.error('Formato de resposta inesperado para opções de usuários:', userOptions);
      users.value = [];
    }
  } catch (error) {
    console.error('Erro ao buscar opções de usuários:', error);
    toast.error('Erro ao carregar usuários. Por favor, tente novamente.', { autoClose: 5000 });
    users.value = [];
  }
}

// Inicializar dados
onMounted(() => {
  // Buscar reuniões, salas, usuários e opções de status
  fetchMeetings();
  fetchRooms();
  fetchUsers();
  fetchStatusOptions();
});
</script>


<style scoped>
.meetings {
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

/* Estilos para formulário de reunião */
.meeting-form {
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

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-confirmed {
  background-color: var(--success-light);
  color: var(--success);
}

.status-canceled {
  background-color: var(--danger-light);
  color: var(--danger);
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

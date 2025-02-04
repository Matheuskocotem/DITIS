<template>
  <div class="meetings">
    <AdminSidebar />

    <h2>Próximas Reuniões</h2>
    <button class="btn btn-primary" @click="openModal('add')">
      Adicionar Nova Reunião
    </button>
    <table class="meetings-table">
      <thead>
        <tr>
          <th>Sala</th>
          <th>Titulo</th>
          <th>Horário</th>
          <th>Responsável</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="meeting in upcomingMeetings" :key="meeting.id">
          <td>{{ meeting.Date }}</td>
          <td>{{ meeting.room }}</td>
          <td>{{ meeting.title }}</td>
          <td>{{ meeting.time }}</td>
          <td>{{ meeting.organizer }}</td>
          <td>
            <button class="btn btn-edit" @click="openModal('edit', meeting)">Editar</button>
            <button class="btn btn-delete" @click="deleteMeeting(meeting.id)">Cancelar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal :show-modal="showModal" @close="closeModal" title="Adicionar Nova Reunião">
      <template #modal-body>
        <form @submit.prevent="handleSubmit" id="addMeeting">
          <div class="form-group">
            <label for="meetingRoom">Sala:</label>
            <input type="number" id="meetingRoom" v-model="newMeeting.room_id" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingUser">Responsável (ID do usuário):</label>
            <input type="number" id="meetingUser" v-model="newMeeting.user_id" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingTitle">Título da Reunião:</label>
            <input type="text" id="meetingTitle" v-model="newMeeting.title" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingDescription">Descrição:</label>
            <textarea id="meetingDescription" v-model="newMeeting.description" class="form-input"></textarea>
          </div>
          <div class="form-group">
            <label for="meetingDate">Data:</label>
            <input type="date" id="meetingDate" v-model="newMeeting.date" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingStartTime">Horário de Início:</label>
            <input id="meetingStartTime" v-model="newMeeting.start_time" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingEndTime">Horário de Término:</label>
            <input id="meetingEndTime" v-model="newMeeting.end_time" required class="form-input">
          </div>
          <div class="form-group">
            <label for="meetingStatus">Status:</label>
            <select id="meetingStatus" v-model="newMeeting.status" required class="form-input">
              <option value="confirmed">Confirmada</option>
              <option value="canceled">Cancelada</option>
            </select>
          </div>
        </form>
      </template>
      <template #modal-footer>
        <button
          type="submit"
          form="addMeeting"
          class="btn btn-primary"
        >
            Adicionar
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="closeModal"
        >
          Cancelar
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import Modal from '@/components/Modal.vue';
import { ref, onMounted } from 'vue';
import AdminSidebar from '@/components/AdminSidebar.vue';
import { apiCreateMeeting, apiGetAllMeetings, apiUpdateMeeting } from '@/http';
import { toast } from 'vue3-toastify';

const upcomingMeetings = ref([]);
const showModal = ref(false);
const modalType = ref(null);
const editMeetingId = ref(null)
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

function openModal(type, meeting) {
  modalType.value = type
  showModal.value = true;

  if (type === 'edit' && meeting) {
    editMeetingId.value = meeting.id

    newMeeting.value = {...meeting}
  }
}

function resetMeetingForm() {
  newMeeting.value = {
    room_id: '',
    user_id: '',
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'pending',
  };
}

function closeModal() {
  showModal.value = false;
  modalType.value = null;
  editMeetingId.value = null;
}

function formatFetchedMeeting(meeting) {
  return {
    ...meeting,
    time: `${meeting.start_time} - ${meeting.end_time}`,
    organizer: meeting.user.name,
    room: meeting.room.nome
  }
}

const fetchMeetings = async () => {
  try {
    const meetings = await apiGetAllMeetings();

    upcomingMeetings.value = meetings.map(meeting => (({
      ...formatFetchedMeeting(meeting)
    })));
  } catch (error) {
    toast.error(error, { autoClose: 5000 });
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

const addMeeting = async () => {
  try {
    const payload = formatPayload();

    const createdMeeting = await apiCreateMeeting(payload);

    closeModal();
    increaseMeetings('add', createdMeeting);
    resetMeetingForm();
    toast.success('Reunião criada com sucesso!', { autoClose: 5000 });
  } catch (error) {
    toast.error(error.response.data.message, { autoClose: 5000 });
  }
};

async function updateMeeting() {
  try {
    const payload = formatPayload();

    const createdMeeting = await apiUpdateMeeting(editMeetingId, payload);

    closeModal()
    increaseMeetings('edit', createdMeeting);
    resetMeetingForm();
    toast.success('Reunião criada com sucesso!', { autoClose: 5000 });
  } catch (error) {
    toast.error(error.response.data.message, { autoClose: 5000 });
  }
}

function handleSubmit() {
  modalType.value === 'add' ? addMeeting() : updateMeeting();
}

onMounted(fetchMeetings);
</script>


<style scoped>
/* Sidebar */
.sidebar {
  position: fixed;
  /* Fixa a barra lateral */
  left: 0;
  top: 0;
  height: 100vh;
  /* Altura total da tela */
  width: 250px;
  /* Largura da sidebar */
  background-color: #ffffff;
  /* Cor de fundo da sidebar */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
  z-index: 10;
  /* Coloca a sidebar acima do conteúdo */
}

/* Main Content */
.meetings {
  padding: 20px;
  margin-left: 250px;
  /* Adiciona margem à esquerda igual à largura da sidebar */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 100vh;
  /* Garante que a altura do container seja 100% da viewport */
  overflow-y: auto;
  /* Permite rolagem se o conteúdo for maior que a tela */
}

.meetings-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* Button Styles */
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  /* Adiciona espaço entre os botões */
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-edit {
  background-color: #10b981;
  color: #fff;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
  color: #fff;
}

.btn-delete:hover {
  background-color: #dc2626;
}

/* Table Styles */
.meetings-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.meetings-table th,
.meetings-table td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.meetings-table th {
  background-color: #f3f4f6;
  color: #333;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  /* Fundo escuro translúcido */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  /* Coloca o modal acima de outros elementos */
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Sombra */
  position: relative;
  animation: fadeIn 0.3s ease;
  /* Animação de aparecimento */
}

/* Modal Actions */
.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

/* Form Group */
.form-group {
  margin-bottom: 1rem;
}

/* Input Style */
.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.form-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

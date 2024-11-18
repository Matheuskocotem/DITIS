<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  date: String,
  availableTimes: Array,
  rooms: Array // Propriedade para salas disponíveis
})

const emit = defineEmits(['close', 'save'])

const meetingName = ref('')
const startTime = ref('')
const endTime = ref('')
const selectedRoom = ref('') // Variável para armazenar a sala selecionada

const save = () => {
  emit('save', {
    name: meetingName.value,
    date: props.date,
    startTime: startTime.value,
    endTime: endTime.value,
    room: selectedRoom.value // Incluindo a sala selecionada nos dados a serem emitidos
  })
  resetForm()
}

const resetForm = () => {
  meetingName.value = ''
  startTime.value = ''
  endTime.value = ''
  selectedRoom.value = '' // Resetando a sala selecionada
}

// Função para formatar a data no formato brasileiro (DD/MM/AAAA)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

</script>

<template>
  <div v-show="show" class="modal-overlay">
    <div class="modal">
      <h2>Reservar Sala</h2>
      <p><strong>Data da Reunião:</strong> {{ formatDate(props.date) }}</p>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="meetingName">Nome da Reunião:</label>
          <input id="meetingName" v-model="meetingName" required>
        </div>
        <div class="form-group">
          <label for="room">Sala:</label>
          <select id="room" v-model="selectedRoom" required>
            <option value="" disabled selected>Selecione uma sala</option>
            <option v-for="room in props.rooms" :key="room.id" :value="room.id">{{ room.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="startTime">Horário de Início:</label>
          <select id="startTime" v-model="startTime" required>
            <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="endTime">Horário de Término:</label>
          <select id="endTime" v-model="endTime" required>
            <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>
        <div class="button-group">
          <button type="submit">Salvar</button>
          <button type="button" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}
</style>

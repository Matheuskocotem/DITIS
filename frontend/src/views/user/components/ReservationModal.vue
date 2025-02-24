<template>
  <Transition appear name="modal">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 v-if="room">Nova reunião</h3>
          <button class="close-button" @click="$emit('close')">×</button>
        </div>
        <form @submit.prevent="submitReservation">
          <div class="modal-body">
            <label for="startTime">Título</label>
            <input id="startTime" v-model="reservation.title" required />

            <label for="startTime">Descrição</label>
            <input id="startTime" v-model="reservation.description" required />

            <label for="date">Data</label>
            <input type="date" id="date" v-model="reservation.date" @input="checkWeekend" required />
            
            <label for="startTime">Horário de Início</label>
            <select id="startTime" v-model="reservation.startTime" required>
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>

            <label for="endTime">Horário de Término</label>
            <select id="endTime" v-model="reservation.endTime" required>
              <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="submit" class="submit-button">Confirmar Reserva</button>
            <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify';

const props = defineProps({ room: Object })
const emit = defineEmits(['close', 'submit'])

const reservation = ref({
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
})

const generateAvailableTimes = () => {
  const times = []
  for (let hour = 8; hour <= 17; hour++) {
    const formattedHour = hour.toString().padStart(2, '0') + ':00'
    times.push(formattedHour)
  }
  return times
}

const availableTimes = generateAvailableTimes()

const submitReservation = () => {
  if (reservation.value.endTime <= reservation.value.startTime) {
    toast.error('O horário de término deve ser posterior ao horário de início.')
    return
  }

  emit('submit', { ...reservation.value, roomId: props.room.id })
}

const checkWeekend = () =>{
  const selectedDate = new Date(reservation.value.date)
  const dayOfWeek = selectedDate.getDay();

  if (dayOfWeek == 5 || dayOfWeek == 6){
    toast.warning('Você selecionou um fim de semana, verifique se é isso mesmo')
  }
}


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 1rem;
}

.modal-body label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal-body input,
.modal-body select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}

.submit-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #4c51bf;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #434190;
}

.cancel-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #e2e8f0;
  color: #4a5568;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #edf2f7;
}
</style>

<template>
  <div class="calendar-wrapper">
    <!-- Passando eventos diretamente como prop -->
    <ScheduleXCalendar :calendar-app="calendarApp" :events="events" />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import axios from 'axios'
import { apiGetAllMeetings } from '@/http'

const today = new Date().toISOString().split('T')[0]


const events = ref([])

const calendarApp = createCalendar({
  selectedDate: today, 
  views: [
    createViewDay(),
    createViewWeek(),
    createViewMonthGrid(),
    createViewMonthAgenda(),
  ],
  events: events.value,
})

const fetchMeetings = async () => {
  try {
    const response = await apiGetAllMeetings()
    console.log('Reuniões recebidas:', response.data)
    if (response.data && Array.isArray(response.data)) {
      events.value = response.data.map(meeting => ({
          id: meeting.id,
          title: meeting.title,
          start: meeting.start_time,
          end: meeting.end_time,
          user: meeting.user ? meeting.user.name : 'Usuário Desconhecido',
          room: meeting.room ? meeting.room.name : 'Sala Desconhecida',
}))
    }
  } catch (error) {
    console.error('Erro ao buscar reuniões:', error)
  }
}

const addMeeting = async (newEvent) => {
  try {
    const response = await axios.post('http://localhost:8000/api/meetings', newEvent) 
    fetchMeetings() 
  } catch (error) {
    console.error('Erro ao adicionar reunião:', error)
  }
}

onMounted(() => {
  fetchMeetings()
})
</script>


<style lang="scss" scoped>
.calendar-wrapper {
  width: 100%;
  max-width: 100vw;
  height: 800px;
  max-height: 90vh;
  overflow-x: auto;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .schedule-x-event {
    background-color: #4caf50 !important;
    border: none !important;
    border-radius: 5px !important;
    color: white !important;
    font-weight: bold !important;
    padding: 5px !important;
  }

  .schedule-x-day-header {
    background-color: #3f51b5;
    color: white;
    padding: 10px;
    font-weight: bold;
  }

  .schedule-x-time-header {
    background-color: #3f51b5;
    color: white;
    padding: 10px;
  }

  .schedule-x-cell {
    border: 1px solid #ddd;
  }

  .schedule-x-grid {
    background-color: #fff;
  }

  .schedule-x-selected {
    border: 2px solid #ff9800 !important;
  }
}

@media (max-width: 768px) {
  .calendar-wrapper {
    height: 100%;
    max-height: 75vh;
  }
}
</style>

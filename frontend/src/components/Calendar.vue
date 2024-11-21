<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import { apiGetAllMeetings, apiGetUserMeetings } from '@/http'
import { toast } from 'vue3-toastify'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: ptLocale,
        initialView: 'dayGridWeek',
        events: []
      }
    }
  },
  methods: {
    alterarVisualizacao(view) {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.changeView(view)
    },
    async fetchMeetings() {
      const userRole = localStorage.getItem('role');

      try {
        const data = userRole === 'admin' ? await apiGetAllMeetings() : await apiGetUserMeetings();
        
        const formattedEvents = data.map((event) => ({
          title: event.title,
          start: `${event.date}T${event.start_time}`,
          end: `${event.date}T${event.end_time}`
        }));
        
        this.calendarOptions.events = formattedEvents;
      } catch (error) {
        toast.error('Erro ao buscar eventos:', error.response.data.message);
      }
    }
  },
  async mounted() {
    await this.fetchMeetings();
  }
}
</script>

<template>
  <div>
    <div class="change-period">
      <button @click="alterarVisualizacao('dayGridWeek')" class="change-period-btn">Semana</button>
      <button @click="alterarVisualizacao('timeGridDay')" class="change-period-btn">Dia</button>
      <button @click="alterarVisualizacao('listWeek')" class="change-period-btn">Lista Semanal</button>
    </div>

    <FullCalendar 
      :options="calendarOptions" 
      ref="fullCalendar"
    />
  </div>
</template>

<style lang="scss" scoped>
  .change-period {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .change-period-btn {
    background-color: #666;
    color: #fff;
    font-weight: 500;
    padding: 0.5rem 2rem;
    border-radius: 8px;
    border: none;
    outline: none;

    &:hover {
      background-color: #4a5568;
    }
  }
</style>
<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt-br'
import { apiGetAllMeetings } from '@/http'
import { toast } from 'vue3-toastify'
import { apiActiveMeetings } from '@/http/get-active-meetings'


const roomColors = {
    'Sala de Reuniões 3º Andar':'#2E64FE',
    'Sala de Reuniões CEO Piso superior':'#21610B'
  };


export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: ptLocale,
        initialView: 'listWeek',
        events: [],
        eventClick: this.handleEventClick,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: /*dayGridWeek,*/'timeGridDay,listWeek'
        },
        /*localeText: {
          weekText: 'Semana',
          dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sexta', 'sáb'],
          dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
        },*/
      },
      showEventModal: false,
      selectedEventDetails: null,
    };
  },
  methods: {
    alterarVisualizacao(view) {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.changeView(view);
    },
  
    async fetchMeetings() {
      try {
        const data = await apiActiveMeetings(); 
        const formattedEvents = data.map((event) => {
          const roomColor = roomColors[event.room?.nome] || '#CCCCCC'

          return{
          title: event.title,
          start: `${event.date}T${event.start_time}`,
          end: `${event.date}T${event.end_time}`,
          extendedProps: {  
            date: event.date,
            title: event.title,
            description: event.description,  
            user: event.user, 
            room: event.room,
            },
            backgroundColor: roomColor,
            borderColor: roomColor,
           
          };
        });
        this.calendarOptions.events = formattedEvents;
      } catch (error) {
        toast.error('Erro ao buscar eventos:', error.response?.data?.message || error.message);
      }
    },

    handleEventClick(info) {
      const eventDetails = info.event.extendedProps;
      this.openModalWithEventDetails(eventDetails);
    },

    openModalWithEventDetails(eventDetails) {
      this.selectedEventDetails = eventDetails;
      this.showEventModal = true;
    },

    closeEventModal() {
      this.showEventModal = false;
      this.selectedEventDetails = null;
    },

    formatDate(dateString) {
      const date = new Date(dateString + 'T00:00:00Z'); 
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    },

    formatTime(timeString) {
      const date = new Date(`1970-01-01T${timeString}:00Z`);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
  },

  async mounted() {
    await this.fetchMeetings();
    const calendarApi = this.$refs.fullCalendar.getApi();
    calendarApi.on('eventClick', this.handleEventClick);
  },
}
</script>

<template>
  <div>
    <div class="change-period">
      <!--<button @click="alterarVisualizacao('dayGridWeek')" class="change-period-btn">Semana</button>-->
      <button @click="alterarVisualizacao('timeGridDay')" class="change-period-btn">Dia</button>
      <button @click="alterarVisualizacao('listWeek')" class="change-period-btn">Lista Semanal</button>
    </div>

    <FullCalendar 
      :options="calendarOptions" 
      ref="fullCalendar"
    />

    <div v-if="showEventModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedEventDetails?.title }}</h2>
        <p><strong>Data:</strong> {{ formatDate(selectedEventDetails?.date) }}</p>
        <p><strong>Organizador:</strong> {{ selectedEventDetails?.user?.name }}</p>
        <p><strong>Descrição:</strong> {{ selectedEventDetails?.description || 'Sem descrição' }}</p>
        <p><strong>Sala:</strong> {{ selectedEventDetails?.room?.nome }} - {{ selectedEventDetails?.room?.localizacao }}</p>
        <button @click="closeEventModal" class="change-period-btn">Fechar</button>
      </div>
    </div>
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
    position: relative;
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 100%; 
    max-width: 600px;
    height: auto;
    max-height: 80vh;
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
    justify-content:center; 
    -webkit-animation: scale-in-center 0.7s;
    animation: scale-in-center 0.7s;
  }

  @-webkit-keyframes scale-in-center {
    0% {
      -webkit-transform: scale(0);
              transform: scale(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1);
              transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes scale-in-center {
    0% {
      -webkit-transform: scale(0);
              transform: scale(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1);
              transform: scale(1);
      opacity: 1;
    }
  }

  button {
    margin-top: 20px; 
    width: 100%;
    max-width: 250px;
  }
</style>

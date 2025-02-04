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
        localeText: {
          weekText: 'Semana',
          // Customizando as abreviações dos dias da semana
          dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex.', 'sáb'],  // Correção aqui
        },
        initialView: 'dayGridWeek',
        events: [],
        eventClick: this.handleEventClick,
      },
      showEventModal: false,
      selectedEventDetails: null,
    }
  },
  methods: {
    alterarVisualizacao(view) {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.changeView(view)
    },

    async fetchMeetings() {
      try {
        const data = await apiGetAllMeetings();  // Chama a função que retorna todas as reuniões
        //console.log('Dados das reuniões:', data);

        const formattedEvents = data.map((event) => ({
          title: event.title,
          start: `${event.date}T${event.start_time}`,
          end: `${event.date}T${event.end_time}`,
          extendedProps: {  // As propriedades estendidas para passar mais dados ao clicar no evento
            date: event.date,
            title: event.title,
            description: event.description,  // Adiciona a descrição
            user: event.user, // Adiciona o organizador
            room: event.room, // Adiciona a sala
          },
        }));

        this.calendarOptions.events = formattedEvents;
      } catch (error) {
        toast.error('Erro ao buscar eventos:', error.response?.data?.message || error.message);
      }
    },

    // Função que será chamada ao clicar no evento
    handleEventClick(info) {
      //console.log('Evento clicado:', info);
      const eventDetails = info.event.extendedProps; // Pega as propriedades estendidas do evento
      this.openModalWithEventDetails(eventDetails);
    },

    // Abre o modal com as informações do evento
    openModalWithEventDetails(eventDetails) {
      this.selectedEventDetails = eventDetails;
      this.showEventModal = true;
    },

    // Fecha o modal de eventos
    closeEventModal() {
      this.showEventModal = false;
      this.selectedEventDetails = null;
    },

    // Função para formatar a data no formato brasileiro (DD/MM/AAAA)
    formatDate(dateString) {
      const date = new Date(dateString + 'T00:00:00Z'); // Força a data para UTC
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Janeiro é 0
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    },
  },

  async mounted() {
    await this.fetchMeetings();

    // Registra manualmente o evento caso o evento click não esteja sendo detectado
    const calendarApi = this.$refs.fullCalendar.getApi();
    calendarApi.on('eventClick', this.handleEventClick);
  },
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

    <!-- Modal para exibir detalhes do evento -->
    <div v-if="showEventModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedEventDetails?.title }}</h2>
        <p><strong>Data:</strong> {{ formatDate(selectedEventDetails?.date) }}</p>
        <p><strong>Organizador:</strong> {{ selectedEventDetails?.user?.name }}</p>
        <p><strong>Descrição:</strong> {{ selectedEventDetails?.description || 'Sem descrição' }}</p>
        <p><strong>Sala:</strong> {{ selectedEventDetails?.room?.nome }} - {{ selectedEventDetails?.room?.localizacao }}</p>
        <button @click="closeEventModal">Fechar</button>
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

  /* Estilos para o modal */
  .modal-overlay {
    position: fixed; /* Usar fixed para garantir que a sobreposição cubra toda a tela */
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
  }

  button {
    margin-top: 20px; 
    width: 100%;
    max-width: 250px;
  }
</style>

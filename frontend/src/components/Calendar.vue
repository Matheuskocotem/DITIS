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
      activeView: 'dayGridWeek',
      isLoading: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: ptLocale,
        initialView: 'dayGridWeek',
        headerToolbar: {
          left: '',
          center: 'title',
          right: '',
        },
        height: 'auto',
        aspectRatio: 1.8,
        dayMaxEvents: true,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        },
        events: [],
        eventDisplay: 'block',
        eventBackgroundColor: '#2B73B4',
        eventBorderColor: '#1e5b8e',
        eventTextColor: '#ffffff',
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        allDaySlot: false,
        slotEventOverlap: false,
        nowIndicator: true,
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00',
        },
        slotLabelClassNames: 'slot-label',
        dayHeaderClassNames: 'day-header',
        eventClassNames: 'calendar-event',
        eventClick: this.handleEventClick
      }
    }
  },
  methods: {
    alterarVisualizacao(view) {
      this.activeView = view;
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.changeView(view);
    },
    async fetchMeetings() {
      this.isLoading = true;
      const userRole = localStorage.getItem('role');

      try {
        const data = userRole === 'admin' ? await apiGetAllMeetings() : await apiGetUserMeetings();
        
        // Registrar no console para debug
        console.log('Dados da API:', data);
        
        // Atribuir cores diferentes para tipos diferentes de reuniões
        const formattedEvents = data.map((event, index) => {
          console.log('Processando evento:', event);
          
          // Obter o ID da sala do relacionamento do room, se existir
          const roomId = (event.room && event.room.id) || (event.meeting_room_id) || (index % 5);
          
          const colors = [
            { bg: '#4C51BF', border: '#3C3F99' }, // Azul escuro
            { bg: '#2B6CB0', border: '#1E5188' }, // Azul
            { bg: '#38A169', border: '#2C7F52' }, // Verde
            { bg: '#E53E3E', border: '#C33232' }, // Vermelho
            { bg: '#DD6B20', border: '#B35617' }  // Laranja
          ];
          
          // Definir a função para sanitizar texto e lidar com valores nulos ou indefinidos
          const sanitizeText = (text) => {
            if (text === null || text === undefined) return '';
            return String(text).replace(/\s+/g, ' ').trim();
          };
          
          // Extrair e sanitizar todos os campos necessários
          const title = sanitizeText(event.title) || 'Evento sem título';
          
          // Informações da sala - verifica o objeto aninhado primeiro
          let roomName = 'Sala não especificada';
          if (event.room && event.room.name) {
            roomName = sanitizeText(event.room.name);
          } else if (event.meeting_room && event.meeting_room.name) {
            roomName = sanitizeText(event.meeting_room.name);
          } else if (event.meeting_room_name) {
            roomName = sanitizeText(event.meeting_room_name);
          }
          
          // Informações do organizador - verifica o objeto aninhado primeiro
          let organizerName = 'Organizador não especificado';
          if (event.user && event.user.name) {
            organizerName = sanitizeText(event.user.name);
          } else if (event.organizer && event.organizer.name) {
            organizerName = sanitizeText(event.organizer.name);
          } else if (event.organizer_name) {
            organizerName = sanitizeText(event.organizer_name);
          }
          
          // Descrição do evento
          const description = sanitizeText(event.description) || 'Sem descrição';
          
          // Selecionar cor com base no ID da sala
          const colorIndex = (roomId % colors.length);
          
          // Dados processados para debug
          console.log('Dados formatados:', {
            id: event.id,
            title: title,
            roomName: roomName,
            organizerName: organizerName,
            description: description
          });
          
          // Retornar objeto formatado para o FullCalendar
          return {
            id: event.id,
            title: title,
            start: `${event.date}T${event.start_time}`,
            end: `${event.date}T${event.end_time}`,
            backgroundColor: colors[colorIndex].bg,
            borderColor: colors[colorIndex].border,
            extendedProps: {
              room: roomName,
              organizer: organizerName,
              description: description
            }
          };
        });
        
        this.calendarOptions.events = formattedEvents;
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        toast.error('Erro ao buscar eventos do calendário');
      } finally {
        this.isLoading = false;
      }
    },
    handleEventClick(info) {
      const event = info.event;
      console.log('Evento clicado:', event);
      console.log('Propriedades extendidas:', event.extendedProps);
      
      // Criar formatador de texto para remover quebras e múltiplos espaços
      const formatText = (text) => {
        if (!text) return '';
        // Converter para string, remover quebras de linha e espaços múltiplos
        return String(text)
          .replace(/\r?\n|\r/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      };
      
      // Obter e sanitizar cada dado individualmente
      const title = formatText(event.title) || 'Evento sem título';
      const room = formatText(event.extendedProps?.room) || 'Sala não especificada';
      const organizer = formatText(event.extendedProps?.organizer) || 'Organizador não especificado';
      const description = formatText(event.extendedProps?.description) || 'Sem descrição';
      
      // Registrar os dados formatados
      console.log('Dados formatados:', { title, room, organizer, description });
      
      // Criar HTML do popup de forma direta e sem espaçamentos indesejados
      const popupHtml = `
        <div class="toast-event-popup">
          <h3>${title}</h3>
          <div class="event-info">
            <p><strong>Sala:</strong> ${room}</p>
            <p><strong>Organizador:</strong> ${organizer}</p>
            <p><strong>Descrição:</strong> ${description}</p>
          </div>
        </div>
      `.trim();
      
      toast.info(popupHtml, {
        dangerouslyHTMLString: true,
        autoClose: 5000,
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: false,
        className: 'custom-toast',
        style: {
          backgroundColor: '#fff',
          color: '#333',
          maxWidth: '300px',
          minWidth: '250px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '0'  // Remove padding para usar nosso próprio padding no CSS
        }
      });
    }
  },
  async mounted() {
    await this.fetchMeetings();
  }
}
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <h2 class="calendar-title">Agenda de Reuniões</h2>
      <div class="view-selector">
        <button 
          class="view-btn" 
          :class="{ active: activeView === 'dayGridMonth' }" 
          @click="alterarVisualizacao('dayGridMonth')"
        >
          <i class="far fa-calendar-alt"></i> Mês
        </button>
        <button 
          class="view-btn" 
          :class="{ active: activeView === 'timeGridWeek' }" 
          @click="alterarVisualizacao('timeGridWeek')"
        >
          <i class="far fa-calendar-week"></i> Semana
        </button>
        <button 
          class="view-btn" 
          :class="{ active: activeView === 'timeGridDay' }" 
          @click="alterarVisualizacao('timeGridDay')"
        >
          <i class="far fa-calendar-day"></i> Dia
        </button>
        <button 
          class="view-btn" 
          :class="{ active: activeView === 'listWeek' }" 
          @click="alterarVisualizacao('listWeek')"
        >
          <i class="far fa-list-alt"></i> Lista
        </button>
      </div>
    </div>
    
    <div class="calendar-container">
      <div v-if="isLoading" class="loading-overlay">
        <i class="fas fa-circle-notch fa-spin spinner"></i>
      </div>
      <FullCalendar 
        ref="fullCalendar" 
        :options="calendarOptions" 
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-wrapper {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.calendar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.view-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.view-btn {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #edf2f7;
  }

  &.active {
    background-color: #2B73B4;
    color: white;
    border-color: #2B73B4;
  }

  i {
    font-size: 0.875rem;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

.spinner {
  color: #2B73B4;
  font-size: 2rem;
}

.calendar-container {
  min-height: 600px;
  max-height: 800px;
  border-radius: 8px;
  overflow: hidden;
}

// Estilos específicos para o FullCalendar
:deep(.fc) {
  font-family: 'Inter', sans-serif;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #2c3e50 !important;
  text-transform: capitalize !important;
}

:deep(.fc-col-header-cell) {
  background-color: #f8f9fa !important;
  padding: 10px 0 !important;
}

:deep(.fc-col-header-cell-cushion) {
  font-weight: 600 !important;
  color: #4a5568 !important;
  text-decoration: none !important;
  padding: 8px !important;
  text-transform: uppercase !important;
  font-size: 0.875rem !important;
}

:deep(.fc-day) {
  transition: background-color 0.2s !important;
}

:deep(.fc-day-today) {
  background-color: rgba(43, 115, 180, 0.05) !important;
}

:deep(.fc-daygrid-day-number) {
  font-weight: 500 !important;
  color: #2d3748 !important;
  text-decoration: none !important;
  padding: 8px !important;
}

:deep(.fc-event) {
  border-radius: 4px !important;
  border: none !important;
  font-size: 0.875rem !important;
  padding: 3px 5px !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  margin: 1px 2px !important;
  cursor: pointer !important;
  transition: transform 0.2s, box-shadow 0.2s !important;

  &:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15) !important;
    z-index: 5 !important;
  }
}

:deep(.fc-list-event) {
  cursor: pointer !important;
  padding: 6px 0 !important;

  &:hover {
    background-color: rgba(43, 115, 180, 0.05) !important;
  }
}

:deep(.fc-list-event-title) {
  font-weight: 500 !important;
}

:deep(.fc-list-day-cushion) {
  background-color: #f8f9fa !important;
  padding: 10px 14px !important;
}

// Customizações para o modo de semana e dia
:deep(.fc-timegrid-slot) {
  height: 3em !important;
}

:deep(.fc-timegrid-axis) {
  font-weight: 500 !important;
  color: #4a5568 !important;
  font-size: 0.8rem !important;
}

:deep(.fc-timegrid-slot-label-cushion) {
  font-weight: 500 !important;
  color: #4a5568 !important;
  font-size: 0.8rem !important;
}

:deep(.fc-timegrid-now-indicator-line) {
  border-color: #e53e3e !important;
  z-index: 4 !important;
}

:deep(.fc-timegrid-now-indicator-arrow) {
  border-color: #e53e3e !important;
  color: #e53e3e !important;
}

:deep(.fc-button-primary) {
  display: none !important;
}

// Estilos globais para o toast (será aplicado mesmo com escopo)
:global(.custom-toast) {
  border-radius: 8px !important;
  overflow: hidden !important;

  .Toastify__toast-body {
    padding: 0 !important;
    margin: 0 !important;
  }
}

:global(.toast-event-popup) {
  padding: 16px !important;
  width: 100% !important;
  
  h3 {
    margin-top: 0 !important;
    font-size: 1.1rem !important;
    color: #2c3e50 !important;
    border-bottom: 1px solid #edf2f7 !important;
    padding-bottom: 8px !important;
    margin-bottom: 12px !important;
    font-weight: 600 !important;
    white-space: normal !important;
  }
  
  .event-info {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  p {
    margin: 8px 0 !important;
    font-size: 0.9rem !important;
    line-height: 1.4 !important;
    white-space: normal !important;
    
    strong {
      font-weight: 600 !important;
      color: #4a5568 !important;
      margin-right: 4px !important;
    }
  }
}

// Destaque para células não-business
:deep(.fc-non-business) {
  background: rgba(0, 0, 0, 0.02) !important;
}

// Estilos responsivos
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .view-selector {
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
  }
  
  :deep(.fc-toolbar-title) {
    font-size: 1.1rem !important;
  }
  
  :deep(.fc-toolbar) {
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
}
</style>
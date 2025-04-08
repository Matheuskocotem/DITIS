<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="handleBackdropClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Passamos o conteúdo principal através do slot padrão -->
          <slot></slot>
        </div>
        
        <div v-if="hasFooterSlot" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Modal'
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    maxWidth: {
      type: String,
      default: '500px'
    }
  },
  emits: ['close'],
  computed: {
    hasFooterSlot() {
      return !!this.$slots.footer;
    }
  },
  watch: {
    show(value) {
      if (value) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.closeModal();
      }
    },
    handleEscape(e) {
      if (e.key === 'Escape' && this.show) {
        this.closeModal();
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = '';
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  max-width: v-bind(maxWidth);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-in 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--bg-light);
  color: var(--danger);
}

.modal-body {
  padding: 1.5rem 1rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Animações da modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-body {
    max-height: calc(100vh - 130px);
  }
  
  .modal-overlay {
    padding: 0;
  }
}
</style>
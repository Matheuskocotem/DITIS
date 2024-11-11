<template>
  <div class="modal fade" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div
      class="modal-dialog modal-dialog-centered"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="modal-body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="modal-footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  name: 'ModalComponent',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  data() {
    return {
      modal: null,
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);

    this.$refs.modal.addEventListener('hidden.bs.modal', () => {
      this.closeModal()
    })
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.modal.show();
      } else {
        this.modal.hide();
      }
    },
  }
}
</script>
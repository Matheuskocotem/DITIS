<script setup>
import { ref, watch } from 'vue';

const { status } = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const badgeText = ref('');
const badgeStyles = ref({});

const updateBadge = (newStatus) => {
  const statusMapper = {
    confirmed: 'Confirmado',
    canceled: 'Cancelado',
  };

  const colorMapper = {
    confirmed: {
      backgroundColor: '#D4F4DD',
      color: '#28A745',
      borderColor: '#28A745',
    },
    canceled: {
      backgroundColor: '#F8D7DA',
      color: '#DC3545',
      borderColor: '#DC3545',
    },
  };

  badgeText.value = statusMapper[newStatus?.trim()] || 'Sem status';
  badgeStyles.value = colorMapper[newStatus?.trim()] || {
    backgroundColor: '#E2E3E5',
    color: '#6C757D',
    borderColor: '#6C757D',
  };
};

updateBadge(status);

watch(() => status, (newStatus) => {
  console.log(newStatus);
  updateBadge(newStatus);
});
</script>

<template>
  <div
    class="badge"
    :style="{
      backgroundColor: badgeStyles.backgroundColor,
      borderColor: badgeStyles.borderColor,
      color: badgeStyles.color,
    }"
  >
    {{ badgeText }}
  </div>
</template>

<style lang="scss" scoped>
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid;
  font-weight: bold;
  text-transform: capitalize;
}
</style>

<template>
  <div class="filters-wrapper">
    <ion-segment
      :model-value="filterStatus"
      class="movie-filters"
      @ion-change="updateFilter"
    >
      <ion-segment-button value="All">
        <ion-label>All ({{ total }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="Not Watched">
        <ion-label>Up Next ({{ pending }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="Watched">
        <ion-label>Watched ({{ watched }})</ion-label>
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/vue';
import type { MovieStatus } from '@/types/movie';

defineProps<{
  filterStatus: 'All' | MovieStatus;
  total: number;
  watched: number;
  pending: number;
}>();

const emit = defineEmits<{
  'update:filterStatus': [value: 'All' | MovieStatus];
}>();

const updateFilter = (event: CustomEvent) => {
  const value = event.detail.value as 'All' | MovieStatus | undefined;
  if (value) emit('update:filterStatus', value);
};
</script>

<style scoped>
.filters-wrapper {
  margin: 0 4px 22px;
  padding: 6px;
  border-radius: 22px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset);
  border: var(--neu-border);
}

.movie-filters {
  --background: transparent;
  background: transparent;
}

.movie-filters ion-segment-button {
  --color: var(--neu-text-sub);
  --color-checked: var(--neu-text-main);
  --indicator-color: var(--neu-bg);
  --indicator-box-shadow: var(--neu-raised-sm);
  min-height: 42px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
  transition: all 200ms ease;
}

.movie-filters ion-segment-button ion-label {
  color: var(--neu-text-sub);
  font-weight: 700;
  transition: color 200ms ease;
}

.movie-filters ion-segment-button.segment-button-checked ion-label {
  color: var(--neu-text-main) !important;
  font-weight: 800;
}

@media (max-width: 520px) {
  .movie-filters ion-segment-button {
    font-size: 0.72rem;
    min-height: 40px;
  }
}
</style>

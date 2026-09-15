<template>
  <ion-segment
    :model-value="filterStatus"
    class="movie-filters ion-margin-bottom"
    @ion-change="updateFilter"
  >
    <ion-segment-button value="All">
      <ion-label>All ({{ total }})</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Not Watched">
      <ion-label>Not Watched ({{ pending }})</ion-label>
    </ion-segment-button>
    <ion-segment-button value="Watched">
      <ion-label>Watched ({{ watched }})</ion-label>
    </ion-segment-button>
  </ion-segment>
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
.movie-filters {
  --background: #273b4b;
  margin: 0 4px 20px;
  padding: 5px;
  border-radius: 13px;
  box-shadow: 0 6px 14px rgba(31, 41, 51, 0.1);
}

.movie-filters ion-segment-button {
  --color: #f4f7f6;
  --color-checked: #ffffff;
  --indicator-color: #168f82;
  --indicator-box-shadow: 0 3px 10px rgba(31, 41, 51, 0.1);
  min-height: 42px;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.15;
  white-space: normal;
  text-transform: none;
}

.movie-filters ion-segment-button ion-label {
  display: block;
  color: #ffffff !important;
  font-size: inherit;
  font-weight: 800;
  line-height: 1.2;
  opacity: 1 !important;
  text-align: center;
  white-space: normal;
}

.movie-filters ion-segment-button.segment-button-checked ion-label {
  color: #ffffff !important;
}

.movie-filters ion-segment-button.segment-button-checked {
  --color-checked: #ffffff;
}

@media (max-width: 520px) {
  .movie-filters {
    margin-right: 4px;
    margin-left: 4px;
  }

  .movie-filters ion-segment-button {
    min-height: 46px;
    padding: 0 2px;
    font-size: 0.7rem;
  }
}
</style>

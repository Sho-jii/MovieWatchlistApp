<template>
  <ion-card class="neu-empty-card">
    <ion-card-content class="empty-content">
      <div class="empty-icon-well">
        <ion-icon :icon="filmOutline" class="empty-icon" />
      </div>
      <ion-card-title class="empty-title">No Movies Found</ion-card-title>
      <p v-if="searchQuery" class="empty-text">
        No movies match "{{ searchQuery }}".
      </p>
      <p v-else-if="filterStatus !== 'All'" class="empty-text">
        No movies found in "{{ filterStatus }}" filter.
      </p>
      <p v-else class="empty-text">
        Your collection is empty. Add your first movie to get started!
      </p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon,
} from '@ionic/vue';
import { filmOutline } from 'ionicons/icons';
import type { MovieStatus } from '@/types/movie';

defineProps<{
  filterStatus: 'All' | MovieStatus;
  searchQuery: string;
}>();
</script>

<style scoped>
.neu-empty-card {
  margin: 16px 4px 24px;
  border-radius: 26px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset);
  border: var(--neu-border);
  text-align: center;
  --background: var(--neu-bg);
  --color: inherit;
}

.empty-content {
  padding: 44px 20px 38px;
}

.empty-icon-well {
  display: grid;
  width: 68px;
  height: 68px;
  margin: 0 auto 16px;
  place-items: center;
  border-radius: 50%;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised-sm);
  border: var(--neu-border);
}

.empty-icon {
  font-size: 2rem;
  color: #F36423;
}

.empty-title {
  margin: 0 0 6px;
  color: var(--neu-text-main);
  font-size: 1.2rem;
  font-weight: 800;
}

.empty-text {
  margin: 0 auto;
  max-width: 280px;
  color: var(--neu-text-sub);
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>

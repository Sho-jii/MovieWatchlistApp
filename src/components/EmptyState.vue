<template>
  <div class="empty-state">
    <ion-icon :icon="filmOutline" class="empty-icon" />
    <h3>No Movies Found</h3>
    <p v-if="searchQuery">
      No movies match "{{ searchQuery }}".
    </p>
    <p v-else-if="filterStatus !== 'All'">
      No movies in "{{ filterStatus }}" category.
    </p>
    <p v-else>
      Your watchlist is empty. Add your first movie above!
    </p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { filmOutline } from 'ionicons/icons';
import type { MovieStatus } from '@/types/movie';

defineProps<{
  filterStatus: 'All' | MovieStatus;
  searchQuery: string;
}>();
</script>

<style scoped>
.empty-state {
  margin: 12px 4px;
  padding: 46px 20px;
  border: 1px dashed rgba(22, 143, 130, 0.32);
  border-radius: 16px;
  background: linear-gradient(145deg, #f1f4f2, #fffefa);
  color: #7a8589;
  text-align: center;
}

.empty-icon {
  width: 52px;
  height: 52px;
  padding: 12px;
  border-radius: 50%;
  background: #273b4b;
  color: #f6c85f;
  font-size: 28px;
  margin-bottom: 8px;
}

.empty-state h3 {
  margin: 6px 0;
  color: #1f2933;
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.88rem;
}
</style>

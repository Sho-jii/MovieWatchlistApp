<template>
  <ion-searchbar
    :model-value="modelValue"
    class="movie-search"
    placeholder="Search movies, genres, or years"
    :clear-input="true"
    :debounce="150"
    @ion-input="updateSearch"
  />
</template>

<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const updateSearch = (event: CustomEvent) => {
  emit('update:modelValue', event.detail.value ?? '');
};
</script>

<style scoped>
.movie-search {
  --background: #f1f4f2;
  --border-radius: 13px;
  --box-shadow: inset 0 0 0 1px rgba(31, 41, 51, 0.06), 0 6px 16px rgba(31, 41, 51, 0.05);
  --color: #1f2933;
  --icon-color: #168f82;
  --placeholder-color: #899397;
  --placeholder-opacity: 1;
  margin: 0 4px 12px;
  padding: 0;
}
</style>

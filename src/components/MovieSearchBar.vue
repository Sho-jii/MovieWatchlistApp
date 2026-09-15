<template>
  <div class="search-groove">
    <ion-searchbar
      :value="modelValue"
      class="neu-searchbar"
      placeholder="Search movies, genres, or years..."
      :debounce="150"
      show-clear-button="focus"
      @ion-input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { IonSearchbar } from '@ionic/vue';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const onInput = (event: CustomEvent) => {
  emit('update:modelValue', event.detail.value ?? '');
};
</script>

<style scoped>
.search-groove {
  margin: 0 4px 16px;
  border-radius: 26px;
  background: var(--neu-bg);
  box-shadow: inset 4px 4px 8px rgba(166, 180, 200, 0.65), inset -4px -4px 8px #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.85);
  transition: all 0.25s ease;
  overflow: hidden;
}

.search-groove:focus-within {
  box-shadow: inset 5px 5px 9px rgba(166, 180, 200, 0.75), inset -5px -5px 9px #FFFFFF, 0 0 0 2px rgba(243, 100, 35, 0.35);
}

.neu-searchbar {
  --background: transparent;
  --box-shadow: none;
  --color: var(--neu-text-main);
  --icon-color: #F36423;
  --clear-button-color: #8B9BAA;
  --placeholder-color: #8B9BAA;
  --placeholder-opacity: 0.95;
  padding: 0 6px;
  min-height: 50px;
  font-weight: 500;
}

/* Eliminate any Material Design shadow DOM white container */
.neu-searchbar::part(container) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.neu-searchbar::part(input) {
  background: transparent !important;
  font-family: inherit;
  font-size: 15px;
}
</style>

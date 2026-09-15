<template>
  <ion-card class="neu-form-card" :class="{ 'is-editing': isEditing }">
    <ion-card-header class="form-header">
      <div class="form-title-group">
        <div class="form-icon-squircle">
          <ion-icon :icon="isEditing ? createOutline : addOutline" />
        </div>
        <div>
          <ion-card-subtitle class="form-kicker">
            {{ isEditing ? 'UPDATE MOVIE' : 'ADD NEW ENTRY' }}
          </ion-card-subtitle>
          <ion-card-title class="form-title">
            {{ isEditing ? 'Edit Movie Details' : 'Add to Watchlist' }}
          </ion-card-title>
        </div>
      </div>
      <ion-badge class="mode-badge" :class="isEditing ? 'badge-editing' : 'badge-new'">
        {{ isEditing ? 'Editing' : 'New' }}
      </ion-badge>
    </ion-card-header>

    <ion-card-content class="form-content">
      <form @submit.prevent="submitForm">
        <!-- Section 1: Title -->
        <div class="input-groove ion-margin-bottom">
          <ion-input
            v-model="form.title"
            label="Movie Title *"
            label-placement="floating"
            placeholder="e.g. Inception"
            required
          />
        </div>

        <!-- Section 2: Genre & Year -->
        <ion-row>
          <ion-col size="12" size-sm="6">
            <div class="input-groove ion-margin-bottom">
              <ion-input
                v-model="form.genre"
                label="Genre *"
                label-placement="floating"
                placeholder="e.g. Sci-Fi, Action"
                required
              />
            </div>
          </ion-col>

          <ion-col size="12" size-sm="6">
            <div class="input-groove ion-margin-bottom">
              <ion-input
                v-model.number="form.year"
                type="number"
                label="Release Year *"
                label-placement="floating"
                placeholder="e.g. 2010"
                min="1888"
                max="2099"
                required
              />
            </div>
          </ion-col>
        </ion-row>

        <!-- Section 3: Rating & Status -->
        <ion-row>
          <ion-col size="12" size-sm="6">
            <div class="input-groove ion-margin-bottom">
              <ion-select
                v-model.number="form.rating"
                label="Rating (1 - 5 Stars)"
                label-placement="floating"
              >
                <ion-select-option :value="1">⭐ 1 Star</ion-select-option>
                <ion-select-option :value="2">⭐⭐ 2 Stars</ion-select-option>
                <ion-select-option :value="3">⭐⭐⭐ 3 Stars</ion-select-option>
                <ion-select-option :value="4">⭐⭐⭐⭐ 4 Stars</ion-select-option>
                <ion-select-option :value="5">⭐⭐⭐⭐⭐ 5 Stars</ion-select-option>
              </ion-select>
            </div>
          </ion-col>

          <ion-col size="12" size-sm="6">
            <div class="input-groove ion-margin-bottom">
              <ion-select
                v-model="form.status"
                label="Watch Status"
                label-placement="floating"
              >
                <ion-select-option value="Not Watched">Not Watched</ion-select-option>
                <ion-select-option value="Watched">Watched</ion-select-option>
              </ion-select>
            </div>
          </ion-col>
        </ion-row>

        <!-- Form Actions -->
        <div class="form-actions">
          <ion-button
            type="submit"
            class="neu-primary-btn"
            :class="{ 'btn-editing': isEditing }"
            fill="clear"
          >
            <ion-icon slot="start" :icon="isEditing ? checkmarkOutline : addOutline" />
            <span>{{ isEditing ? 'Save Changes' : 'Add to Watchlist' }}</span>
          </ion-button>

          <ion-button
            v-if="isEditing"
            type="button"
            class="neu-cancel-btn"
            fill="clear"
            @click="$emit('cancel')"
          >
            <ion-icon slot="start" :icon="closeOutline" />
            <span>Cancel</span>
          </ion-button>
        </div>
      </form>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonCol,
  IonIcon,
  IonInput,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { addOutline, checkmarkOutline, closeOutline, createOutline } from 'ionicons/icons';
import type { MovieFormData } from '@/types/movie';

const props = defineProps<{
  modelValue: MovieFormData;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  submit: [form: MovieFormData];
  cancel: [];
}>();

const form = reactive<MovieFormData>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => Object.assign(form, value),
  { deep: true }
);

const submitForm = () => emit('submit', { ...form });
</script>

<style scoped>
.neu-form-card {
  margin: 0 4px 26px;
  border-radius: 28px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised);
  border: var(--neu-border);
  transition: all 220ms ease;
  --background: var(--neu-bg);
  --color: inherit;
  overflow: visible;
}

.neu-form-card::part(native) {
  border-radius: 28px;
}

.form-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px 10px;
}

.form-content {
  padding: 0 20px 22px;
}

.form-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-icon-squircle {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 14px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised-sm);
  border: var(--neu-border);
  color: #F36423;
  font-size: 1.25rem;
}

.is-editing .form-icon-squircle {
  color: var(--neu-mint);
}

.form-kicker {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--neu-text-sub);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 2px;
}

.form-title {
  margin: 0;
  color: var(--neu-text-main);
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.mode-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  box-shadow: var(--neu-inset-sm);
  background: var(--neu-bg);
}

.badge-new {
  color: #F36423;
  border: 1px solid rgba(243, 100, 35, 0.25);
}

.badge-editing {
  color: var(--neu-mint);
  border: 1px solid rgba(32, 176, 136, 0.25);
}

/* Sunken Inset Input Grooves */
.input-groove {
  border-radius: 18px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset);
  border: var(--neu-border);
  padding: 2px 14px;
  transition: all 180ms ease;
}

.input-groove:focus-within {
  box-shadow: inset 4px 4px 8px rgba(166, 180, 200, 0.7), inset -4px -4px 8px #FFFFFF, 0 0 0 2px rgba(243, 100, 35, 0.35);
}

.is-editing .input-groove:focus-within {
  box-shadow: inset 4px 4px 8px rgba(166, 180, 200, 0.7), inset -4px -4px 8px #FFFFFF, 0 0 0 2px rgba(32, 176, 136, 0.35);
}

ion-input,
ion-select {
  --color: var(--neu-text-main);
  --placeholder-color: #8B9BAA;
  --placeholder-opacity: 0.8;
  font-weight: 600;
  font-size: 0.95rem;
}

ion-input::part(label),
ion-select::part(label) {
  color: var(--neu-text-sub);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}

.neu-primary-btn {
  --background: var(--neu-orange-grad);
  --color: #ffffff;
  --box-shadow: var(--neu-orange-glow);
  --border-radius: 999px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --padding-start: 24px;
  --padding-end: 24px;
  height: 48px;
  margin: 0;
  font-size: 0.92rem;
  font-weight: 800;
  text-transform: none;
  transition: all 180ms ease;
  flex: 1;
}

.neu-primary-btn:hover {
  transform: translateY(-1px);
}

.btn-editing {
  --background: linear-gradient(135deg, #20B088 0%, #167f78 100%);
  --box-shadow: var(--neu-mint-glow);
}

.neu-cancel-btn {
  --background: var(--neu-bg);
  --color: var(--neu-text-sub);
  --box-shadow: var(--neu-raised-sm);
  --border-radius: 999px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --padding-start: 20px;
  --padding-end: 20px;
  height: 48px;
  margin: 0;
  border: var(--neu-border);
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: none;
  transition: all 180ms ease;
}

.neu-cancel-btn:hover {
  --color: #334454;
  transform: translateY(-1px);
}

.neu-cancel-btn:active {
  box-shadow: var(--neu-inset-sm);
  transform: translateY(1px);
}

@media (max-width: 480px) {
  .neu-form-card {
    border-radius: 24px;
  }

  .form-header {
    padding: 20px 16px 8px;
  }

  .form-content {
    padding: 0 16px 18px;
  }

  .form-title {
    font-size: 1.15rem;
  }
}
</style>

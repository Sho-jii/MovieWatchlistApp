<template>
  <ion-card class="form-card" :class="{ 'is-editing': isEditing }">
    <div class="form-card-accent" aria-hidden="true" />
    <ion-card-header>
      <div class="form-heading-row">
        <div class="form-heading-icon" aria-hidden="true">
          <ion-icon :icon="isEditing ? createOutline : addOutline" />
        </div>
        <div class="form-heading-copy">
          <p class="form-kicker">{{ isEditing ? 'UPDATE YOUR LIST' : 'ADD TO YOUR LIST' }}</p>
          <ion-card-title>
            {{ isEditing ? 'Edit Movie Details' : 'Add New Movie' }}
          </ion-card-title>
        </div>
      </div>
      <p class="form-description">
        {{ isEditing ? 'Refresh the details and keep your watchlist current.' : 'Save a title now so movie night never starts with a blank screen.' }}
      </p>
      <div class="form-mode-chip">
        <span class="mode-dot" />
        {{ isEditing ? 'Editing saved movie' : 'New watchlist entry' }}
      </div>
    </ion-card-header>

    <ion-card-content>
      <form @submit.prevent="submitForm">
        <div class="form-section-label">
          <span>01</span>
          <div>
            <strong>Movie details</strong>
            <small>Tell us what you are saving</small>
          </div>
        </div>

        <ion-item class="identity-item ion-margin-bottom" lines="inset">
          <ion-input
            v-model="form.title"
            label="Movie Title *"
            label-placement="floating"
            placeholder="e.g. Inception"
            required
          />
        </ion-item>

        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item class="identity-item ion-margin-bottom" lines="inset">
              <ion-input
                v-model="form.genre"
                label="Genre *"
                label-placement="floating"
                placeholder="e.g. Sci-Fi, Action"
                required
              />
            </ion-item>
          </ion-col>

          <ion-col size="12" size-sm="6">
            <ion-item class="identity-item ion-margin-bottom" lines="inset">
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
            </ion-item>
          </ion-col>
        </ion-row>

        <div class="form-section-label form-section-label-secondary">
          <span>02</span>
          <div>
            <strong>How you feel about it</strong>
            <small>Set a rating and watch status</small>
          </div>
        </div>

        <ion-row>
          <ion-col size="12" size-sm="6">
            <ion-item class="preference-item ion-margin-bottom" lines="inset">
              <ion-select
                v-model.number="form.rating"
                label="Rating (1 - 5 Stars)"
                label-placement="floating"
              >
                <ion-select-option :value="1">⭐ 1 Star (Poor)</ion-select-option>
                <ion-select-option :value="2">⭐⭐ 2 Stars (Fair)</ion-select-option>
                <ion-select-option :value="3">⭐⭐⭐ 3 Stars (Good)</ion-select-option>
                <ion-select-option :value="4">⭐⭐⭐⭐ 4 Stars (Great)</ion-select-option>
                <ion-select-option :value="5">⭐⭐⭐⭐⭐ 5 Stars (Masterpiece)</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>

          <ion-col size="12" size-sm="6">
            <ion-item class="preference-item ion-margin-bottom" lines="inset">
              <ion-select
                v-model="form.status"
                label="Watch Status"
                label-placement="floating"
              >
                <ion-select-option value="Not Watched">Not Watched</ion-select-option>
                <ion-select-option value="Watched">Watched</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>
        </ion-row>

        <div class="form-actions">
          <ion-button
            type="submit"
            class="submit-button"
            expand="block"
            :color="isEditing ? 'success' : 'primary'"
          >
            <ion-icon slot="start" :icon="isEditing ? checkmarkOutline : addOutline" />
            {{ isEditing ? 'Save Changes' : 'Add to Watchlist' }}
          </ion-button>

          <ion-button
            v-if="isEditing"
            expand="block"
            fill="outline"
            color="medium"
            class="cancel-button ion-margin-top"
            @click="$emit('cancel')"
          >
            <ion-icon slot="start" :icon="closeOutline" />
            Cancel Edit
          </ion-button>
        </div>
      </form>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonIcon,
  IonInput,
  IonItem,
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
.form-card {
  position: relative;
  margin: 0 4px 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: #1f2933;
  box-shadow: 0 14px 32px rgba(31, 41, 51, 0.18);
}

.form-card-accent {
  height: 7px;
  background: linear-gradient(90deg, #273b4b, #e4573d 52%, #f6c85f);
}

.form-card.is-editing .form-card-accent {
  background: linear-gradient(90deg, #115d67, #168f82 52%, #8de0d3);
}

.form-card ion-card-header {
  padding: 22px 24px 16px;
  background: #273b4b;
}

.form-card ion-card-content {
  padding: 10px 24px 24px;
  background: #1f2933;
}

.form-card.is-editing ion-card-header,
.form-card.is-editing ion-card-content {
  background: #115d67;
}

.form-kicker {
  margin: 0 0 5px;
  color: #f6c85f;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.form-card ion-card-title {
  color: #fffefa;
  font-size: 1.35rem;
  font-weight: 800;
}

.form-heading-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-heading-icon {
  display: grid;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: #f6c85f;
  font-size: 1.2rem;
}

.form-heading-copy {
  min-width: 0;
}

.form-description {
  max-width: 510px;
  margin: 14px 0 0 54px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.86rem;
  line-height: 1.5;
}

.form-mode-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 15px 0 0 54px;
  padding: 6px 9px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.66rem;
  font-weight: 700;
}

.mode-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e4573d;
  box-shadow: 0 0 0 3px rgba(228, 87, 61, 0.12);
}

.is-editing .mode-dot {
  background: #8de0d3;
  box-shadow: 0 0 0 3px rgba(141, 224, 211, 0.12);
}

.form-card ion-item {
  --background: rgba(255, 255, 255, 0.1);
  --border-color: rgba(255, 255, 255, 0.12);
  --color: #fffefa;
  --highlight-color: #f6c85f;
  --placeholder-color: rgba(255, 255, 255, 0.5);
  --placeholder-opacity: 1;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  border: 1px solid transparent;
  border-left: 4px solid #e4573d;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.form-card.is-editing ion-item,
.form-card .preference-item {
  border-left-color: #168f82;
}

.form-card ion-item:focus-within,
.form-card .identity-item:focus-within {
  border-color: #f6c85f;
  box-shadow: 0 0 0 3px rgba(246, 200, 95, 0.12);
}

.form-card .preference-item:focus-within {
  border-color: #8de0d3;
  box-shadow: 0 0 0 3px rgba(141, 224, 211, 0.12);
}

.form-section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0 12px;
}

.form-section-label > span {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 8px;
  background: rgba(246, 200, 95, 0.18);
  color: #f6c85f;
  font-size: 0.67rem;
  font-weight: 900;
}

.form-section-label strong,
.form-section-label small {
  display: block;
}

.form-section-label strong {
  color: #fffefa;
  font-size: 0.8rem;
  font-weight: 800;
}

.form-section-label small {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.68rem;
}

.form-section-label-secondary {
  margin-top: 6px;
}

.form-section-label-secondary > span {
  background: rgba(141, 224, 211, 0.18);
  color: #8de0d3;
}

.form-card ion-row {
  margin: 0 -6px;
}

.form-card ion-col {
  padding: 0 6px;
}

.form-actions {
  display: grid;
  gap: 8px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.form-actions ion-button {
  --border-radius: 10px;
  min-height: 48px;
  font-weight: 800;
  letter-spacing: 0;
}

.form-actions .submit-button {
  --background: #e4573d;
  --background-activated: #c94d36;
  --background-hover: #e76851;
  --box-shadow: 0 9px 18px rgba(228, 87, 61, 0.22);
  --color: #fffefa;
}

.form-card.is-editing .form-actions .submit-button {
  --background: #168f82;
  --background-activated: #115d67;
  --background-hover: #2aa698;
  --box-shadow: 0 9px 18px rgba(22, 143, 130, 0.22);
}

.form-actions .cancel-button {
  --border-color: rgba(255, 255, 255, 0.5);
  --border-width: 1px;
  --color: #fffefa;
  --color-activated: #f6c85f;
}

@media (max-width: 600px) {
  .form-card ion-card-header {
    padding: 20px 18px 12px;
  }

  .form-card ion-card-content {
    padding: 8px 18px 18px;
  }

  .form-heading-icon {
    flex-basis: 38px;
    width: 38px;
    height: 38px;
  }

  .form-description,
  .form-mode-chip {
    margin-left: 50px;
  }

  .form-description {
    font-size: 0.8rem;
  }

  .form-section-label {
    margin-top: 2px;
  }

  .form-card ion-row {
    margin: 0;
  }

  .form-card ion-col {
    padding: 0;
  }
}

@media (min-width: 601px) {
  .form-card ion-col[size-sm='6'] {
    flex: 0 0 50%;
    width: 50%;
    max-width: 50%;
  }
}
</style>

<template>
  <ion-card class="neu-card" :class="{ 'is-watched': movie.status === 'Watched' }">
    <ion-card-content class="neu-card-content">
      <div class="card-main-row">
        <!-- Molded Poster / Mark Frame -->
        <div class="poster-frame">
          <span class="poster-letter">{{ movie.title.charAt(0).toUpperCase() }}</span>
        </div>

        <!-- Movie Details -->
        <div class="movie-info">
          <ion-card-title class="movie-title">{{ movie.title }}</ion-card-title>
          <div class="movie-meta-row">
            <span class="movie-rating">
              <span class="rating-star">★</span> {{ movie.rating }}.0
            </span>
            <span class="meta-dot">·</span>
            <span class="movie-year">{{ movie.year }}</span>
            <span class="meta-dot">·</span>
            <span class="movie-genre">{{ movie.genre }}</span>
          </div>
        </div>

        <!-- Circular Play / Toggle Status Button -->
        <ion-button
          class="neu-circle-btn"
          :class="{ 'watched-btn': movie.status === 'Watched' }"
          :title="movie.status === 'Watched' ? 'Mark as Not Watched' : 'Mark as Watched'"
          fill="clear"
          @click="$emit('toggle-status', movie)"
        >
          <ion-icon :icon="movie.status === 'Watched' ? checkmarkOutline : play" />
        </ion-button>
      </div>

      <!-- Bottom Actions Row -->
      <div class="card-footer-row">
        <ion-badge
          class="status-pill"
          :class="movie.status === 'Watched' ? 'pill-watched' : 'pill-pending'"
        >
          <span class="pill-dot" />
          {{ movie.status }}
        </ion-badge>

        <div class="btn-actions">
          <!-- Edit Button -->
          <ion-button
            class="neu-action-btn edit-btn"
            title="Edit Movie"
            fill="clear"
            @click="$emit('edit', movie)"
          >
            <ion-icon slot="start" :icon="createOutline" />
            <span>Edit</span>
          </ion-button>

          <!-- Delete Button -->
          <ion-button
            class="neu-action-btn delete-btn"
            title="Delete Movie"
            fill="clear"
            @click="$emit('delete', movie)"
          >
            <ion-icon slot="start" :icon="trashOutline" />
            <span>Delete</span>
          </ion-button>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonBadge,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import {
  createOutline,
  trashOutline,
  play,
  checkmarkOutline,
} from 'ionicons/icons';
import type { Movie } from '@/types/movie';

defineProps<{
  movie: Movie;
}>();

defineEmits<{
  'toggle-status': [movie: Movie];
  edit: [movie: Movie];
  delete: [movie: Movie];
}>();
</script>

<style scoped>
.neu-card {
  position: relative;
  margin: 0 4px 18px;
  border-radius: 24px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised);
  border: var(--neu-border);
  transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
  --background: var(--neu-bg);
  --color: inherit;
  overflow: visible;
}

.neu-card::part(native) {
  border-radius: 24px;
}

.neu-card:hover {
  transform: translateY(-2px);
  box-shadow: 10px 10px 22px rgba(166, 180, 200, 0.75), -10px -10px 22px #FFFFFF;
}

.neu-card-content {
  padding: 18px 18px 14px;
}

.card-main-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Molded Poster Frame */
.poster-frame {
  display: grid;
  flex: 0 0 48px;
  width: 48px;
  height: 56px;
  place-items: center;
  border-radius: 16px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset-sm);
  border: var(--neu-border);
}

.poster-letter {
  font-size: 1.35rem;
  font-weight: 900;
  background: var(--neu-orange-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.is-watched .poster-letter {
  background: linear-gradient(135deg, #20B088 0%, #167f78 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Movie Info */
.movie-info {
  flex: 1;
  min-width: 0;
}

.movie-title {
  margin: 0 0 4px;
  color: var(--neu-text-main);
  font-size: 1.12rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 0.82rem;
  color: var(--neu-text-sub);
}

.movie-rating {
  font-weight: 800;
  color: #F36423;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.rating-star {
  font-size: 0.85rem;
}

.meta-dot {
  color: #B2C0CE;
  font-weight: 900;
}

.movie-year {
  color: var(--neu-text-sub);
  font-weight: 600;
}

.movie-genre {
  color: var(--neu-text-sub);
  font-weight: 600;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Circular Action / Play Button */
.neu-circle-btn {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: 50%;
  --box-shadow: var(--neu-orange-glow);
  --background: var(--neu-orange-grad);
  --color: #ffffff;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  margin: 0;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 180ms ease;
}

.neu-circle-btn ion-icon {
  margin-left: 2px;
  font-size: 1.2rem;
}

.neu-circle-btn.watched-btn {
  --background: linear-gradient(135deg, #20B088 0%, #167f78 100%);
  --box-shadow: var(--neu-mint-glow);
}

.neu-circle-btn.watched-btn ion-icon {
  margin-left: 0;
}

.neu-circle-btn:hover {
  transform: scale(1.06);
}

.neu-circle-btn:active {
  transform: scale(0.95);
}

/* Footer Row */
.card-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(166, 180, 200, 0.22);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  box-shadow: var(--neu-inset-sm);
  background: var(--neu-bg);
  border: 1px solid rgba(255, 255, 255, 0.7);
  text-transform: none;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.pill-watched {
  color: var(--neu-mint);
}

.pill-watched .pill-dot {
  background: var(--neu-mint);
  box-shadow: 0 0 6px rgba(32, 176, 136, 0.6);
}

.pill-pending {
  color: #F36423;
}

.pill-pending .pill-dot {
  background: #F36423;
  box-shadow: 0 0 6px rgba(243, 100, 35, 0.6);
}

/* Edit & Delete Action Buttons */
.btn-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.neu-action-btn {
  --background: var(--neu-bg);
  --color: var(--neu-text-sub);
  --box-shadow: var(--neu-raised-sm);
  --border-radius: 14px;
  --padding-start: 10px;
  --padding-end: 10px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  height: 32px;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: none;
  border: var(--neu-border);
  border-radius: 14px;
  transition: all 160ms ease;
}

.neu-action-btn:hover {
  transform: translateY(-1px);
}

.neu-action-btn:active {
  transform: translateY(1px);
  box-shadow: var(--neu-inset-sm);
}

.edit-btn:hover {
  --color: #334454;
}

.delete-btn:hover {
  --color: var(--ion-color-danger, #eb445a);
}

@media (max-width: 480px) {
  .neu-card-content {
    padding: 14px 14px 12px;
  }

  .neu-card {
    border-radius: 20px;
  }

  .poster-frame {
    width: 42px;
    height: 50px;
    border-radius: 13px;
  }

  .movie-title {
    font-size: 1.02rem;
  }

  .neu-circle-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>

<template>
  <ion-card class="movie-card" :class="{ 'is-watched': movie.status === 'Watched' }">
    <div class="movie-card-glow" aria-hidden="true" />
    <ion-card-header>
      <div class="movie-card-header">
        <div class="movie-heading">
          <div class="movie-poster-mark" aria-hidden="true">
            {{ movie.title.charAt(0).toUpperCase() }}
          </div>
          <div class="movie-heading-copy">
          <p class="movie-kicker">{{ movie.status === 'Watched' ? 'COMPLETED WATCH' : 'UP NEXT' }}</p>
          <ion-card-title class="movie-title">{{ movie.title }}</ion-card-title>
          </div>
        </div>

        <span class="status-pill" :class="movie.status === 'Watched' ? 'status-pill-watched' : 'status-pill-pending'">
          <span class="status-dot" />
          {{ movie.status }}
        </span>
      </div>
      <ion-card-subtitle class="movie-subtitle">
        <span class="metadata-chip">{{ movie.genre }}</span>
        <span class="metadata-divider">/</span>
        <span>{{ movie.year }}</span>
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div class="rating-display">
        <div class="rating-copy">
          <span class="rating-label">COMMUNITY RATING</span>
          <span class="rating-text">{{ movie.rating }}.0 <small>/ 5</small></span>
        </div>
        <span class="rating-stars">{{ '★'.repeat(movie.rating || 1) }}</span>
      </div>

      <div class="card-buttons ion-margin-top">
        <ion-button
          size="small"
          fill="outline"
          :color="movie.status === 'Watched' ? 'warning' : 'success'"
          @click="$emit('toggle-status', movie)"
        >
          <ion-icon
            slot="start"
            :icon="movie.status === 'Watched' ? eyeOffOutline : eyeOutline"
          />
          Mark as {{ movie.status === 'Watched' ? 'Not Watched' : 'Watched' }}
        </ion-button>

        <ion-button
          size="small"
          fill="outline"
          color="primary"
          @click="$emit('edit', movie)"
        >
          <ion-icon slot="start" :icon="createOutline" />
          Edit
        </ion-button>

        <ion-button
          size="small"
          fill="outline"
          color="danger"
          @click="$emit('delete', movie)"
        >
          <ion-icon slot="start" :icon="trashOutline" />
          Delete
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/vue';
import {
  createOutline,
  eyeOffOutline,
  eyeOutline,
  trashOutline,
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
.movie-card {
  position: relative;
  overflow: hidden;
  margin: 12px 4px;
  border: 1px solid rgba(31, 41, 51, 0.1);
  border-radius: 20px;
  background: #1f2933;
  box-shadow: 0 10px 25px rgba(31, 41, 51, 0.07);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.movie-card::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 6px;
  background: linear-gradient(180deg, #f0a13c, #d37523);
  content: '';
}

.movie-card.is-watched::before {
  background: linear-gradient(180deg, #37b8a4, #168f82);
}

.movie-card-glow {
  position: absolute;
  top: -72px;
  right: -45px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(246, 200, 95, 0.16);
  filter: blur(2px);
  pointer-events: none;
}

.is-watched .movie-card-glow {
  background: rgba(141, 224, 211, 0.18);
}

.movie-card:hover {
  border-color: rgba(228, 87, 61, 0.28);
  box-shadow: 0 18px 34px rgba(31, 41, 51, 0.13);
  transform: translateY(-4px);
}

.movie-card ion-card-header {
  position: relative;
  z-index: 1;
  padding: 20px 20px 12px 26px;
  background: linear-gradient(135deg, #273b4b, #1f2933);
  color: #fffefa;
}

.is-watched ion-card-header {
  background: linear-gradient(135deg, #115d67, #167f78);
}

.movie-card ion-card-content {
  position: relative;
  z-index: 1;
  padding: 10px 20px 20px 26px;
  background: #1f2933;
}

.is-watched ion-card-content {
  background: #115d67;
}

.movie-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.movie-heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.movie-heading-copy {
  min-width: 0;
}

.movie-poster-mark {
  display: grid;
  flex: 0 0 42px;
  width: 42px;
  height: 54px;
  place-items: center;
  border: 1px solid rgba(228, 87, 61, 0.18);
  border-radius: 9px;
  background: linear-gradient(145deg, #fce7df, #f5c5ae);
  color: #c94d36;
  font-size: 1.25rem;
  font-weight: 900;
  box-shadow: inset 0 -9px 0 rgba(255, 254, 250, 0.35);
}

.is-watched .movie-poster-mark {
  border-color: rgba(22, 143, 130, 0.2);
  background: linear-gradient(145deg, #dff2ee, #a9ded5);
  color: #137e73;
}

.movie-kicker {
  margin: 0 0 4px;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.movie-title {
  overflow: hidden;
  color: #fffefa;
  font-size: 1.22rem;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-subtitle {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 10px 0 0 54px;
  color: #c6d0cf;
  font-size: 0.9rem;
}

.metadata-chip {
  max-width: 70%;
  overflow: hidden;
  color: #dce6e3;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metadata-divider {
  color: #f6c85f;
  font-weight: 800;
}

.status-pill {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 800;
  white-space: nowrap;
}

.status-pill-pending {
  background: #f6c85f;
  color: #273b4b;
}

.status-pill-watched {
  background: #8de0d3;
  color: #115d67;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 5px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

.rating-stars {
  color: #e7a91f;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 5px rgba(211, 138, 47, 0.2);
}

.rating-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rating-label {
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.rating-text {
  color: #fffefa;
  font-size: 0.92rem;
  font-weight: 800;
}

.rating-text small {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.7rem;
  font-weight: 600;
}

.card-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-buttons ion-button {
  --border-color: rgba(255, 255, 255, 0.35);
  --color: #fffefa;
  --color-activated: #fffefa;
  --border-radius: 10px;
  min-height: 40px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0;
  transition: transform 160ms ease;
}

.card-buttons ion-button[color='success'] {
  --border-color: #8de0d3;
  --color: #8de0d3;
}

.card-buttons ion-button[color='warning'] {
  --border-color: #f6c85f;
  --color: #f6c85f;
}

.card-buttons ion-button[color='primary'] {
  --border-color: #f6c85f;
  --color: #f6c85f;
}

.card-buttons ion-button[color='danger'] {
  --border-color: #f28a78;
  --color: #f28a78;
}

.card-buttons ion-button:active {
  transform: scale(0.98);
}

@media (max-width: 600px) {
  .movie-card-header {
    gap: 8px;
  }

  .movie-card ion-card-header {
    padding: 18px 16px 10px 22px;
  }

  .movie-card ion-card-content {
    padding: 8px 16px 16px 22px;
  }

  .movie-poster-mark {
    flex-basis: 38px;
    width: 38px;
    height: 48px;
    font-size: 1.05rem;
  }

  .movie-title {
    font-size: 1.08rem;
  }

  .movie-subtitle {
    margin-left: 50px;
    font-size: 0.78rem;
  }

  .status-pill {
    padding: 5px 7px;
    font-size: 0.56rem;
  }

  .card-buttons ion-button {
    flex: 1 1 100%;
    margin: 0;
  }
}
</style>

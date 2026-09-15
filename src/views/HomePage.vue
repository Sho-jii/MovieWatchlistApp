<template>
  <ion-page>
    <!-- Skeuomorphic Loading / Splash Screen with App Icon -->
    <AppSplashScreen :is-visible="showSplash" />

    <!-- Neumorphic Header -->
    <ion-header class="app-header" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button class="neu-icon-btn" title="Home" fill="clear" @click="selectFilter('All')">
            <ion-icon slot="icon-only" :icon="filmOutline" />
          </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center">
          <div class="brand-title-group">
            <h1 class="brand-title">Ranking</h1>
            <span class="brand-subtitle">Movie Watchlist</span>
          </div>
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            class="neu-icon-btn"
            title="Surprise Movie Picker"
            fill="clear"
            :disabled="movies.length === 0"
            @click="openSurprisePicker"
          >
            <ion-icon slot="icon-only" :icon="shuffleOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="watchlist-content">
      <div class="content-container">

        <!-- Neumorphic Hero Panel -->
        <ion-card class="intro-panel">
          <ion-card-content class="intro-panel-content">
            <div class="intro-text">
              <ion-card-subtitle class="eyebrow">PERSONAL CINEMA DESK</ion-card-subtitle>
              <ion-card-title class="intro-heading">Keep every story in sight.</ion-card-title>
              <p class="intro-copy">
                Log titles, track ratings, and pick what to watch next with tactile ease.
              </p>
              <ion-button
                class="neu-cta-btn"
                fill="clear"
                :disabled="movies.length === 0"
                @click="openSurprisePicker"
              >
                <ion-icon slot="start" :icon="shuffleOutline" />
                <span>Surprise Me</span>
              </ion-button>
            </div>
            <div class="intro-icon-badge" aria-hidden="true">
              <img src="/app_icon.jpg" alt="App Icon" class="intro-badge-img" />
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Neumorphic Stats Tiles -->
        <div class="section-title-row">
          <div>
            <span class="section-kicker">COLLECTION METRICS</span>
            <h3 class="section-heading">Overview</h3>
          </div>
        </div>

        <MovieStats
          :total="movies.length"
          :watched="watchedCount"
          :pending="notWatchedCount"
          :filter-status="filterStatus"
          @select-filter="selectFilter"
        />

        <!-- Add / Edit Movie Form -->
        <div ref="movieFormSection" class="movie-form-anchor">
          <MovieForm
            :model-value="movieForm"
            :is-editing="isEditing"
            @submit="saveMovie"
            @cancel="cancelEdit"
          />
        </div>

        <!-- Browse & Search Section -->
        <div class="section-title-row">
          <div>
            <span class="section-kicker">CURATED SELECTION</span>
            <h3 class="section-heading">Watchlist</h3>
          </div>
          <ion-badge class="count-badge">{{ filteredMovies.length }} {{ filteredMovies.length === 1 ? 'title' : 'titles' }}</ion-badge>
        </div>

        <!-- Search Bar with Sunken Inset Physics -->
        <MovieSearchBar v-model="searchQuery" />

        <!-- Segment Filters with Sunken Track & Raised Active Pill -->
        <MovieFilters
          v-model:filter-status="filterStatus"
          :total="movies.length"
          :watched="watchedCount"
          :pending="notWatchedCount"
        />

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <ion-spinner name="crescent" />
          <p>Syncing collection from Firebase...</p>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else-if="filteredMovies.length === 0"
          :filter-status="filterStatus"
          :search-query="searchQuery"
        />

        <!-- Movie Cards List -->
        <div v-else class="movie-list">
          <MovieCard
            v-for="movie in filteredMovies"
            :key="movie.id"
            :movie="movie"
            @toggle-status="toggleStatus"
            @edit="startEdit"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Delete Confirmation Alert -->
      <ion-alert
        :is-open="isAlertOpen"
        header="Confirm Delete"
        :message="`Are you sure you want to delete '${movieToDelete?.title}' from your watchlist?`"
        :buttons="alertButtons"
        @didDismiss="isAlertOpen = false"
      />

      <!-- Surprise Pick Modal (Modeled after Reference Left Screen) -->
      <ion-modal
        :is-open="isSurpriseOpen"
        :initial-breakpoint="0.75"
        :breakpoints="[0, 0.75, 0.95]"
        @did-dismiss="isSurpriseOpen = false"
      >
        <ion-content class="surprise-modal-content">
          <ion-card v-if="surpriseMovie" class="surprise-modal-card">
            <!-- Modal Header -->
            <ion-card-header class="modal-topline">
              <ion-card-subtitle class="eyebrow">FEATURED PICK</ion-card-subtitle>
              <ion-button
                class="neu-icon-btn close-btn"
                fill="clear"
                aria-label="Close"
                @click="isSurpriseOpen = false"
              >
                <ion-icon slot="icon-only" :icon="closeOutline" />
              </ion-button>
            </ion-card-header>

            <ion-card-content class="modal-body-content">
              <!-- Molded Poster Frame -->
              <div class="surprise-poster-frame">
                <span class="poster-hero-letter">{{ surpriseMovie.title.charAt(0).toUpperCase() }}</span>
              </div>

              <!-- Title & Metadata -->
              <ion-card-title class="surprise-title">{{ surpriseMovie.title }}</ion-card-title>
              <p class="surprise-genre">{{ surpriseMovie.genre }}</p>

              <!-- Metadata Metrics -->
              <div class="surprise-meta-dock">
                <div class="meta-item">
                  <span class="meta-label">YEAR</span>
                  <span class="meta-val">{{ surpriseMovie.year }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">RATING</span>
                  <span class="meta-val highlight-val">{{ surpriseMovie.rating }}.0</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">STATUS</span>
                  <span
                    class="meta-val"
                    :style="{ color: surpriseMovie.status === 'Watched' ? '#20B088' : '#F36423' }"
                  >
                    {{ surpriseMovie.status }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="surprise-actions">
                <ion-button class="hero-play-btn" fill="clear" title="Pick Another" @click="openSurprisePicker">
                  <ion-icon slot="icon-only" :icon="shuffleOutline" />
                </ion-button>

                <ion-button class="neu-view-btn" fill="clear" @click="focusSurpriseMovie">
                  <span>View in Watchlist</span>
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-content>
      </ion-modal>

      <!-- User Feedback Toast Notification -->
      <ion-toast
        :is-open="isToastOpen"
        :message="toastMessage"
        :color="toastColor"
        :duration="2200"
        position="bottom"
        @didDismiss="isToastOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSpinner,
  IonAlert,
  IonIcon,
  IonModal,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
} from '@ionic/vue';
import {
  closeOutline,
  shuffleOutline,
  filmOutline,
} from 'ionicons/icons';
import MovieStats from '@/components/MovieStats.vue';
import MovieForm from '@/components/MovieForm.vue';
import MovieFilters from '@/components/MovieFilters.vue';
import MovieCard from '@/components/MovieCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import MovieSearchBar from '@/components/MovieSearchBar.vue';
import AppSplashScreen from '@/components/AppSplashScreen.vue';
import type { Movie, MovieFormData } from '@/types/movie';

// Import Firebase Realtime Database reference from our configuration
import { db } from '@/firebase';
import {
  ref as dbRef,
  push,
  set,
  onValue,
  update,
  remove,
} from 'firebase/database';

// Component state
const movies = ref<Movie[]>([]);
const loading = ref(true);
const showSplash = ref(true);
const searchQuery = ref('');
const filterStatus = ref<'All' | 'Watched' | 'Not Watched'>('All');
const movieFormSection = ref<HTMLElement | null>(null);
const isSurpriseOpen = ref(false);
const surpriseMovie = ref<Movie | null>(null);

// Form state for creating or editing
const movieForm = ref<MovieFormData>({
  title: '',
  genre: '',
  year: new Date().getFullYear(),
  rating: 5,
  status: 'Not Watched',
});

// Edit mode tracking
const isEditing = ref(false);
const editingId = ref<string | null>(null);

// Delete confirmation alert state
const isAlertOpen = ref(false);
const movieToDelete = ref<Movie | null>(null);

// Toast feedback state
const isToastOpen = ref(false);
const toastMessage = ref('');
const toastColor = ref<'success' | 'danger' | 'warning'>('success');

const showToast = (message: string, color: 'success' | 'danger' | 'warning' = 'success') => {
  toastMessage.value = message;
  toastColor.value = color;
  isToastOpen.value = true;
};

// Computed properties for counters and search filtering
const watchedCount = computed(() =>
  movies.value.filter((m) => m.status === 'Watched').length
);

const notWatchedCount = computed(() =>
  movies.value.filter((m) => m.status === 'Not Watched').length
);

const filteredMovies = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return movies.value.filter((movie) => {
    const matchesStatus =
      filterStatus.value === 'All' || movie.status === filterStatus.value;
    const matchesSearch =
      !query ||
      (movie.title || '').toLowerCase().includes(query) ||
      (movie.genre || '').toLowerCase().includes(query) ||
      String(movie.year).includes(query);

    return matchesStatus && matchesSearch;
  });
});

const selectFilter = (value: 'All' | 'Watched' | 'Not Watched') => {
  filterStatus.value = value;
  searchQuery.value = '';
};

const openSurprisePicker = () => {
  if (!movies.value.length) return;

  const candidates = movies.value.filter((movie) => movie.status !== 'Watched');
  const pool = candidates.length ? candidates : movies.value;
  surpriseMovie.value = pool[Math.floor(Math.random() * pool.length)];
  isSurpriseOpen.value = true;
};

const focusSurpriseMovie = () => {
  if (!surpriseMovie.value) return;

  isSurpriseOpen.value = false;
  searchQuery.value = surpriseMovie.value.title;
  filterStatus.value = 'All';
  nextTick(() => {
    document.querySelector('.movie-list')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
};

// READ: Listen for real-time updates from Firebase Realtime Database
onMounted(() => {
  const minSplashTimer = new Promise((resolve) => setTimeout(resolve, 1100));
  const moviesNodeRef = dbRef(db, 'movies');

  onValue(
    moviesNodeRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object map to an Array of Movies
        const loadedMovies: Movie[] = Object.entries(data).map(
          ([key, value]: [string, any]) => ({
            id: key,
            title: value.title || '',
            genre: value.genre || '',
            year: Number(value.year) || new Date().getFullYear(),
            rating: Number(value.rating) || 5,
            status: value.status === 'Watched' ? 'Watched' : 'Not Watched',
            createdAt: value.createdAt || 0,
          })
        );

        // Sort by newest created first
        loadedMovies.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        movies.value = loadedMovies;
      } else {
        movies.value = [];
      }
      loading.value = false;
      minSplashTimer.then(() => {
        showSplash.value = false;
      });
    },
    (error) => {
      console.error('Firebase read error:', error);
      loading.value = false;
      showSplash.value = false;
      showToast('Firebase read error: Please check database rules or connection.', 'danger');
    }
  );
});

// CREATE & UPDATE: Save new movie or update existing entry
const saveMovie = async (form: MovieFormData) => {
  const cleanTitle = form.title.trim();
  const cleanGenre = form.genre.trim();
  const cleanYear = Number(form.year) || new Date().getFullYear();
  const cleanRating = Number(form.rating) || 5;

  if (!cleanTitle || !cleanGenre) {
    showToast('Please provide both movie title and genre.', 'warning');
    return;
  }

  movieForm.value = {
    title: cleanTitle,
    genre: cleanGenre,
    year: cleanYear,
    rating: cleanRating,
    status: form.status,
  };

  try {
    if (isEditing.value && editingId.value) {
      // UPDATE existing movie in Firebase
      const targetRef = dbRef(db, `movies/${editingId.value}`);
      await update(targetRef, {
        title: cleanTitle,
        genre: cleanGenre,
        year: cleanYear,
        rating: cleanRating,
        status: form.status,
      });

      showToast(`Updated "${cleanTitle}"`, 'success');
      cancelEdit();
    } else {
      // CREATE new movie in Firebase
      const moviesNodeRef = dbRef(db, 'movies');
      const newMovieRef = push(moviesNodeRef);

      await set(newMovieRef, {
        title: cleanTitle,
        genre: cleanGenre,
        year: cleanYear,
        rating: cleanRating,
        status: form.status,
        createdAt: Date.now(),
      });

      showToast(`Added "${cleanTitle}" to watchlist`, 'success');
      resetForm();
    }
  } catch (err) {
    console.error('Error saving movie:', err);
    showToast('Failed to save to Firebase. Check database rules.', 'danger');
  }
};

// Form helper functions
const resetForm = () => {
  movieForm.value = {
    title: '',
    genre: '',
    year: new Date().getFullYear(),
    rating: 5,
    status: 'Not Watched',
  };
};

const startEdit = (movie: Movie) => {
  isEditing.value = true;
  editingId.value = movie.id || null;
  movieForm.value = {
    title: movie.title,
    genre: movie.genre,
    year: movie.year,
    rating: movie.rating,
    status: movie.status,
  };
  nextTick(() => {
    movieFormSection.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
};

// UPDATE: Quick toggle between Watched and Not Watched
const toggleStatus = async (movie: Movie) => {
  if (!movie.id) return;
  const newStatus = movie.status === 'Watched' ? 'Not Watched' : 'Watched';

  try {
    const targetRef = dbRef(db, `movies/${movie.id}`);
    await update(targetRef, { status: newStatus });
    showToast(`Marked "${movie.title}" as ${newStatus}`, 'success');
  } catch (err) {
    console.error('Error updating status:', err);
    showToast('Failed to update status in Firebase.', 'danger');
  }
};

// DELETE: Remove movie from Firebase after user confirmation
const confirmDelete = (movie: Movie) => {
  movieToDelete.value = movie;
  isAlertOpen.value = true;
};

const alertButtons = [
  {
    text: 'Cancel',
    role: 'cancel',
  },
  {
    text: 'Delete',
    role: 'destructive',
    handler: async () => {
      if (movieToDelete.value?.id) {
        const deletedTitle = movieToDelete.value.title;
        try {
          const targetRef = dbRef(db, `movies/${movieToDelete.value.id}`);
          await remove(targetRef);
          showToast(`Removed "${deletedTitle}" from watchlist`, 'warning');
          // If we were currently editing this movie, cancel edit
          if (editingId.value === movieToDelete.value.id) {
            cancelEdit();
          }
        } catch (err) {
          console.error('Error deleting movie:', err);
          showToast('Failed to delete movie from Firebase.', 'danger');
        }
      }
      movieToDelete.value = null;
    },
  },
];
</script>

<style scoped>
.watchlist-content {
  --background: var(--neu-bg);
}

.content-container {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 16px 16px 60px;
}

.movie-form-anchor {
  scroll-margin-top: 84px;
}

/* Header */
.app-header {
  --background: var(--neu-bg);
  --border-width: 0;
  box-shadow: 0 4px 16px rgba(166, 180, 200, 0.4);
}

.app-header ion-toolbar {
  --background: var(--neu-bg);
  --min-height: 72px;
}

.toolbar-inner {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-title-group {
  text-align: center;
}

.brand-title {
  margin: 0;
  color: var(--neu-text-main);
  font-size: 1.65rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  color: var(--neu-text-sub);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Squircle Neumorphic Button (Reference Top Buttons) */
.neu-icon-btn {
  --background: var(--neu-bg);
  --color: var(--neu-text-main);
  --box-shadow: var(--neu-raised-sm);
  --border-radius: 14px;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  width: 44px;
  height: 44px;
  margin: 0;
  border: var(--neu-border);
  border-radius: 14px;
  font-size: 1.2rem;
  transition: all 160ms ease;
}

.neu-icon-btn:hover {
  transform: translateY(-1px);
}

.neu-icon-btn:active {
  transform: translateY(1px);
  box-shadow: var(--neu-inset-sm);
}

.neu-icon-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

/* Intro Panel */
.intro-panel {
  margin: 12px 4px 26px;
  border-radius: 28px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised);
  border: var(--neu-border);
  --background: var(--neu-bg);
  --color: inherit;
  overflow: visible;
}

.intro-panel-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 24px;
}

.eyebrow {
  display: block;
  margin: 0 0 6px;
  color: #F36423;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.intro-heading {
  margin: 0 0 6px;
  color: var(--neu-text-main);
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.15;
}

.intro-copy {
  margin: 0 0 16px;
  color: var(--neu-text-sub);
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 440px;
}

.neu-cta-btn {
  --background: var(--neu-orange-grad);
  --color: #ffffff;
  --box-shadow: var(--neu-orange-glow);
  --border-radius: 999px;
  --padding-start: 22px;
  --padding-end: 22px;
  --padding-top: 10px;
  --padding-bottom: 10px;
  height: 42px;
  margin: 0;
  font-size: 0.88rem;
  font-weight: 800;
  text-transform: none;
  transition: all 180ms ease;
}

.neu-cta-btn:hover {
  transform: translateY(-2px);
}

.neu-cta-btn:active {
  transform: translateY(1px);
}

.neu-cta-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.intro-icon-badge {
  flex: 0 0 74px;
  width: 74px;
  height: 74px;
  border-radius: 22px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised-sm);
  border: var(--neu-border);
  margin-left: 16px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.intro-icon-badge:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 14px rgba(166, 180, 200, 0.7), -6px -6px 14px #FFFFFF, 0 0 16px rgba(243, 100, 35, 0.25);
}

.intro-badge-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 17px;
  display: block;
}

/* Section Headings */
.section-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 0 6px 14px;
}

.section-kicker {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--neu-text-sub);
}

.section-heading {
  margin: 2px 0 0;
  color: var(--neu-text-main);
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.count-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--neu-text-sub);
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset-sm);
  border: 1px solid rgba(255, 255, 255, 0.7);
  text-transform: none;
}

/* Loading State */
.loading-state {
  display: grid;
  min-height: 180px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: var(--neu-text-sub);
  text-align: center;
  font-weight: 600;
}

.loading-state ion-spinner {
  color: #F36423;
}

/* Surprise Modal (Left Screen Reference) */
.surprise-modal-content {
  --background: var(--neu-bg);
}

.surprise-modal-card {
  margin: 0;
  border-radius: 28px;
  background: var(--neu-bg);
  box-shadow: none;
  --background: var(--neu-bg);
  --color: inherit;
  text-align: center;
}

.modal-body-content {
  padding: 0 20px 32px;
  text-align: center;
}

.modal-topline {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 10px;
}

.close-btn {
  width: 38px;
  height: 38px;
}

.surprise-poster-frame {
  display: grid;
  width: 140px;
  height: 170px;
  margin: 0 auto 20px;
  place-items: center;
  border-radius: 26px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset);
  border: var(--neu-border);
}

.poster-hero-letter {
  font-size: 4rem;
  font-weight: 900;
  background: var(--neu-orange-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.surprise-title {
  margin: 0 0 6px;
  color: var(--neu-text-main);
  font-size: 1.6rem;
  font-weight: 900;
}

.surprise-genre {
  margin: 0 0 16px;
  color: var(--neu-text-sub);
  font-size: 0.92rem;
  font-weight: 600;
}

.surprise-meta-dock {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 16px auto 26px;
  padding: 12px 16px;
  border-radius: 20px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised-sm);
  border: var(--neu-border);
  max-width: 340px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: center;
}

.meta-label {
  font-size: 0.62rem;
  font-weight: 800;
  color: var(--neu-text-sub);
  letter-spacing: 0.08em;
}

.meta-val {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--neu-text-main);
}

.highlight-val {
  color: #F36423;
}

.surprise-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.hero-play-btn {
  --background: var(--neu-orange-grad);
  --color: #ffffff;
  --box-shadow: var(--neu-orange-glow);
  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;
  width: 54px;
  height: 54px;
  margin: 0;
  flex: 0 0 54px;
  font-size: 1.4rem;
  transition: all 180ms ease;
}

.hero-play-btn:hover {
  transform: scale(1.08);
}

.hero-play-btn:active {
  transform: scale(0.95);
}

.neu-view-btn {
  --background: var(--neu-bg);
  --color: var(--neu-text-main);
  --box-shadow: var(--neu-raised-sm);
  --border-radius: 999px;
  --padding-start: 26px;
  --padding-end: 26px;
  height: 50px;
  margin: 0;
  border: var(--neu-border);
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: none;
  transition: all 160ms ease;
  flex: 1;
}

.neu-view-btn:hover {
  transform: translateY(-1px);
}

.neu-view-btn:active {
  transform: translateY(1px);
  box-shadow: var(--neu-inset-sm);
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.4rem;
  }

  .intro-panel {
    padding: 22px 18px;
    border-radius: 24px;
  }

  .intro-heading {
    font-size: 1.3rem;
  }

  .intro-orb {
    display: none;
  }
}
</style>

<template>
  <ion-page>
    <ion-header class="app-header" :translucent="true">
      <ion-toolbar>
        <div class="toolbar-inner">
          <div class="brand-lockup">
            <span class="brand-mark">MW</span>
            <span class="brand-name">Movie Watchlist</span>
          </div>
          <span class="toolbar-note">Your next great watch</span>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="watchlist-content">
      <div class="content-container">
        <section class="intro-panel">
          <div>
            <p class="eyebrow">PERSONAL CINEMA DESK</p>
            <h1>Keep every good story in sight.</h1>
            <p class="intro-copy">
              Capture what you want to watch, mark the ones you loved, and make
              your next movie night effortless.
            </p>
            <ion-button class="surprise-button" fill="solid" @click="openSurprisePicker">
              <ion-icon slot="start" :icon="shuffleOutline" />
              Surprise me
            </ion-button>
          </div>
          <div class="intro-spark" aria-hidden="true">✦</div>
        </section>

        <div class="section-heading">
          <div>
            <p class="eyebrow">YOUR LIBRARY</p>
            <h2>Watchlist overview</h2>
          </div>
          <span class="library-status">Live collection</span>
        </div>

        <MovieStats
          :total="movies.length"
          :watched="watchedCount"
          :pending="notWatchedCount"
          :filter-status="filterStatus"
          @select-filter="selectFilter"
        />

        <div ref="movieFormSection" class="movie-form-anchor">
          <MovieForm
            :model-value="movieForm"
            :is-editing="isEditing"
            @submit="saveMovie"
            @cancel="cancelEdit"
          />
        </div>

        <div class="section-heading section-heading-compact">
          <div>
            <p class="eyebrow">FIND A FILM</p>
            <h2>Browse your list</h2>
          </div>
        </div>

        <section class="browse-panel">
          <div class="browse-panel-heading">
            <span class="browse-live-dot" />
            <span>{{ filteredMovies.length }} {{ filteredMovies.length === 1 ? 'movie' : 'movies' }} showing</span>
          </div>

          <MovieSearchBar v-model="searchQuery" />

          <MovieFilters
            v-model:filter-status="filterStatus"
            :total="movies.length"
            :watched="watchedCount"
            :pending="notWatchedCount"
          />

          <div v-if="loading" class="loading-state">
            <ion-spinner name="crescent" />
            <p>Syncing your collection...</p>
          </div>

          <EmptyState
            v-else-if="filteredMovies.length === 0"
            :filter-status="filterStatus"
            :search-query="searchQuery"
          />

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
        </section>
      </div>

      <ion-alert
        :is-open="isAlertOpen"
        header="Confirm Delete"
        :message="`Are you sure you want to delete '${movieToDelete?.title}' from your watchlist?`"
        :buttons="alertButtons"
        @didDismiss="isAlertOpen = false"
      />

      <ion-modal
        :is-open="isSurpriseOpen"
        :initial-breakpoint="0.72"
        :breakpoints="[0, 0.72, 0.96]"
        @did-dismiss="isSurpriseOpen = false"
      >
        <ion-content class="surprise-modal-content">
          <div v-if="surpriseMovie" class="surprise-card">
            <div class="surprise-card-topline">
              <span class="eyebrow">TODAY'S PICK</span>
              <ion-button
                class="modal-close"
                fill="clear"
                aria-label="Close surprise picker"
                @click="isSurpriseOpen = false"
              >
                <ion-icon :icon="closeOutline" />
              </ion-button>
            </div>
            <div class="surprise-icon" aria-hidden="true">✦</div>
            <p class="surprise-label">Your watchlist has chosen</p>
            <h2>{{ surpriseMovie.title }}</h2>
            <p class="surprise-meta">{{ surpriseMovie.genre }} · {{ surpriseMovie.year }}</p>
            <div class="surprise-rating">
              <span>{{ '⭐'.repeat(surpriseMovie.rating || 1) }}</span>
              <small>{{ surpriseMovie.rating }}/5 rating</small>
            </div>
            <div class="surprise-actions">
              <ion-button expand="block" fill="outline" @click="openSurprisePicker">
                <ion-icon slot="start" :icon="shuffleOutline" />
                Pick again
              </ion-button>
              <ion-button expand="block" @click="focusSurpriseMovie">
                View in watchlist
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSpinner,
  IonAlert,
  IonButton,
  IonIcon,
  IonModal,
} from '@ionic/vue';
import { closeOutline, shuffleOutline } from 'ionicons/icons';
import MovieStats from '@/components/MovieStats.vue';
import MovieForm from '@/components/MovieForm.vue';
import MovieFilters from '@/components/MovieFilters.vue';
import MovieCard from '@/components/MovieCard.vue';
import EmptyState from '@/components/EmptyState.vue';
import MovieSearchBar from '@/components/MovieSearchBar.vue';
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

/*
|--------------------------------------------------------------------------
| Reactive Component State
|--------------------------------------------------------------------------
*/
const movies = ref<Movie[]>([]);
const loading = ref(true);
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

/*
|--------------------------------------------------------------------------
| Computed Properties
|--------------------------------------------------------------------------
*/
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
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
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

/*
|--------------------------------------------------------------------------
| 1. READ: Listen to Firebase Realtime Database
|--------------------------------------------------------------------------
| onValue listens for real-time updates from Firebase.
| Whenever a movie is added, modified, or removed, Firebase notifies
| this callback automatically and updates movies.value.
*/
onMounted(() => {
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
    },
    (error) => {
      console.error('Firebase read error:', error);
      loading.value = false;
    }
  );
});

/*
|--------------------------------------------------------------------------
| 2. CREATE & UPDATE (Save Form)
|--------------------------------------------------------------------------
| If isEditing is true, we call Firebase update() with the editingId.
| If isEditing is false, we push() a new key and set() the movie.
*/
const saveMovie = async (form: MovieFormData) => {
  if (!form.title.trim() || !form.genre.trim()) {
    return;
  }

  movieForm.value = form;

  try {
    if (isEditing.value && editingId.value) {
      // UPDATE existing movie in Firebase
      const targetRef = dbRef(db, `movies/${editingId.value}`);
      await update(targetRef, {
        title: movieForm.value.title.trim(),
        genre: movieForm.value.genre.trim(),
        year: Number(movieForm.value.year),
        rating: Number(movieForm.value.rating),
        status: movieForm.value.status,
      });

      cancelEdit();
    } else {
      // CREATE new movie in Firebase
      const moviesNodeRef = dbRef(db, 'movies');
      const newMovieRef = push(moviesNodeRef);

      await set(newMovieRef, {
        title: movieForm.value.title.trim(),
        genre: movieForm.value.genre.trim(),
        year: Number(movieForm.value.year),
        rating: Number(movieForm.value.rating),
        status: movieForm.value.status,
        createdAt: Date.now(),
      });

      resetForm();
    }
  } catch (err) {
    console.error('Error saving movie:', err);
  }
};

/*
|--------------------------------------------------------------------------
| Form Helper Functions
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| 3. UPDATE: Quick Status Toggle
|--------------------------------------------------------------------------
| Toggles a movie between "Watched" and "Not Watched" with one click.
*/
const toggleStatus = async (movie: Movie) => {
  if (!movie.id) return;
  const newStatus = movie.status === 'Watched' ? 'Not Watched' : 'Watched';

  try {
    const targetRef = dbRef(db, `movies/${movie.id}`);
    await update(targetRef, { status: newStatus });
  } catch (err) {
    console.error('Error updating status:', err);
  }
};

/*
|--------------------------------------------------------------------------
| 4. DELETE: Remove Movie from Firebase
|--------------------------------------------------------------------------
| Prompts user for confirmation, then calls Firebase remove().
*/
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
        try {
          const targetRef = dbRef(db, `movies/${movieToDelete.value.id}`);
          await remove(targetRef);
          // If we were currently editing this movie, cancel edit
          if (editingId.value === movieToDelete.value.id) {
            cancelEdit();
          }
        } catch (err) {
          console.error('Error deleting movie:', err);
        }
      }
      movieToDelete.value = null;
    },
  },
];
</script>

<style scoped>
.content-container {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 28px 20px 56px;
}

.movie-form-anchor {
  scroll-margin-top: 88px;
}

.browse-panel {
  margin: 0 0 20px;
  padding: 18px 16px 14px;
  border: 1px solid rgba(31, 41, 51, 0.08);
  border-radius: 20px;
  background: rgba(255, 254, 250, 0.66);
  box-shadow: 0 12px 28px rgba(31, 41, 51, 0.05);
}

.browse-panel-heading {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 4px 10px;
  color: #6f7b83;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.browse-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #168f82;
  box-shadow: 0 0 0 4px rgba(22, 143, 130, 0.11);
}

.loading-state {
  display: grid;
  min-height: 190px;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: #6f7b83;
  text-align: center;
}

.loading-state ion-spinner {
  color: #e4573d;
}

.loading-state p {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
}

.watchlist-content {
  --background: #f6f4ef;
}

.app-header {
  --background: rgba(246, 244, 239, 0.9);
  --border-width: 0;
  backdrop-filter: blur(14px);
}

.app-header ion-toolbar {
  --background: transparent;
  --min-height: 72px;
}

.toolbar-inner {
  width: min(100%, 980px);
  min-height: 72px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-lockup,
.section-heading,
.library-status {
  display: flex;
  align-items: center;
}

.brand-lockup {
  gap: 10px;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
  background: #1f2933;
  color: #f6c85f;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.brand-name {
  color: #1f2933;
  font-size: 1rem;
  font-weight: 800;
}

.toolbar-note,
.library-status {
  color: #7a8589;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.intro-panel {
  position: relative;
  display: flex;
  min-height: 220px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 30px;
  padding: 36px 40px;
  border-radius: 24px;
  background: linear-gradient(120deg, #1f2933 0%, #2f4c4d 100%);
  color: #fffefa;
  box-shadow: 0 20px 45px rgba(31, 41, 51, 0.16);
}

.intro-panel::after {
  position: absolute;
  right: -60px;
  bottom: -110px;
  width: 290px;
  height: 290px;
  border: 1px solid rgba(246, 200, 95, 0.25);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(246, 200, 95, 0.05), 0 0 0 56px rgba(246, 200, 95, 0.04);
  content: '';
}

.intro-panel .eyebrow {
  color: #f6c85f;
}

.eyebrow {
  margin: 0 0 7px;
  color: #e4573d;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1,
h2 {
  margin: 0;
  color: inherit;
  font-weight: 800;
  letter-spacing: 0;
}

h1 {
  max-width: 580px;
  font-size: clamp(2rem, 5vw, 3.65rem);
  line-height: 1.02;
}

.intro-copy {
  max-width: 520px;
  margin: 16px 0 0;
  color: rgba(255, 254, 250, 0.76);
  font-size: 0.98rem;
  line-height: 1.6;
}

.surprise-button {
  --background: #f6c85f;
  --background-hover: #ffd978;
  --border-radius: 10px;
  --color: #1f2933;
  margin-top: 20px;
  font-weight: 800;
  letter-spacing: 0;
}

.intro-spark {
  position: relative;
  z-index: 1;
  display: grid;
  width: 84px;
  height: 84px;
  place-items: center;
  border: 1px solid rgba(246, 200, 95, 0.35);
  border-radius: 50%;
  color: #f6c85f;
  font-size: 2.4rem;
}

.section-heading {
  justify-content: space-between;
  margin: 0 4px 12px;
}

.section-heading-compact {
  margin-top: 30px;
}

.section-heading h2 {
  color: #1f2933;
  font-size: 1.2rem;
}

.library-status {
  gap: 6px;
}

.library-status::before {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #168f82;
  content: '';
}

.empty-state {
  display: grid;
  min-height: 220px;
  place-items: center;
  align-content: center;
  text-align: center;
}

.surprise-modal-content {
  --background: #1f2933;
}

.surprise-card {
  min-height: 100%;
  padding: 26px 24px 34px;
  background: linear-gradient(155deg, #273b4b 0%, #1f2933 72%);
  color: #fffefa;
  text-align: center;
}

.surprise-card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.surprise-card-topline .eyebrow {
  margin: 0;
}

.modal-close {
  --color: rgba(255, 255, 255, 0.7);
  margin: -8px -12px 0 0;
}

.surprise-icon {
  display: grid;
  width: 76px;
  height: 76px;
  margin: 16px auto 18px;
  place-items: center;
  border-radius: 24px;
  border: 1px solid rgba(246, 200, 95, 0.35);
  background: rgba(246, 200, 95, 0.14);
  color: #f6c85f;
  font-size: 2rem;
}

.surprise-label,
.surprise-meta {
  color: rgba(255, 255, 255, 0.68);
}

.surprise-label {
  margin: 0;
  font-size: 0.86rem;
}

.surprise-card h2 {
  margin: 8px 0 5px;
  color: #fffefa;
  font-size: clamp(1.7rem, 6vw, 2.4rem);
}

.surprise-meta {
  margin: 0;
  font-size: 0.9rem;
}

.surprise-rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.surprise-rating small {
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.76rem;
}

.surprise-actions {
  display: grid;
  gap: 9px;
  max-width: 360px;
  margin: 0 auto;
}

.surprise-actions ion-button {
  --border-color: #8de0d3;
  --color: #8de0d3;
  --border-radius: 10px;
  min-height: 46px;
  font-weight: 800;
}

.surprise-actions ion-button:last-child {
  --background: #168f82;
  --background-hover: #2aa698;
  --color: #fffefa;
}

@media (max-width: 600px) {
  .content-container {
    padding: 20px 12px 40px;
  }

  .browse-panel {
    padding: 15px 10px 10px;
    border-radius: 17px;
  }

  .toolbar-inner {
    padding: 0 14px;
  }

  .toolbar-note {
    display: none;
  }

  .intro-panel {
    align-items: flex-start;
    min-height: 260px;
    margin-bottom: 24px;
    padding: 28px 24px;
    border-radius: 20px;
  }

  .intro-spark {
    position: absolute;
    right: 20px;
    bottom: 18px;
    width: 54px;
    height: 54px;
    font-size: 1.6rem;
  }

  .intro-copy {
    max-width: calc(100% - 12px);
    font-size: 0.9rem;
  }

  .section-heading h2 {
    font-size: 1.05rem;
  }

  .section-heading {
    align-items: flex-end;
  }

  .library-status {
    font-size: 0.62rem;
  }
}
</style>

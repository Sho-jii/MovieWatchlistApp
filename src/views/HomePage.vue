<template>
  <ion-page>
    <!-- ============================================================ -->
    <!-- HEADER -->
    <!-- ============================================================ -->
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Movie Watchlist</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="content-container">

        <!-- ============================================================ -->
        <!-- 1. SUMMARY STATS (Quick overview of Watchlist) -->
        <!-- ============================================================ -->
        <ion-grid class="ion-no-padding stats-grid">
          <ion-row>
            <ion-col size="4">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-number">{{ movies.length }}</div>
                  <div class="stat-label">Total</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card class="stat-card stat-watched">
                <ion-card-content>
                  <div class="stat-number">{{ watchedCount }}</div>
                  <div class="stat-label">Watched</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card class="stat-card stat-not-watched">
                <ion-card-content>
                  <div class="stat-number">{{ notWatchedCount }}</div>
                  <div class="stat-label">Pending</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- ============================================================ -->
        <!-- 2. FORM: CREATE & UPDATE MOVIE -->
        <!-- ============================================================ -->
        <ion-card class="form-card">
          <ion-card-header>
            <ion-card-title>
              {{ isEditing ? 'Edit Movie Details' : 'Add New Movie' }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="saveMovie">
              <!-- Movie Title -->
              <ion-item class="ion-margin-bottom" lines="inset">
                <ion-input
                  v-model="movieForm.title"
                  label="Movie Title *"
                  label-placement="floating"
                  placeholder="e.g. Inception"
                  required
                />
              </ion-item>

              <!-- Genre & Year -->
              <ion-row>
                <ion-col size="12" size-sm="6">
                  <ion-item class="ion-margin-bottom" lines="inset">
                    <ion-input
                      v-model="movieForm.genre"
                      label="Genre *"
                      label-placement="floating"
                      placeholder="e.g. Sci-Fi, Action"
                      required
                    />
                  </ion-item>
                </ion-col>

                <ion-col size="12" size-sm="6">
                  <ion-item class="ion-margin-bottom" lines="inset">
                    <ion-input
                      v-model.number="movieForm.year"
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

              <!-- Rating & Status -->
              <ion-row>
                <ion-col size="12" size-sm="6">
                  <ion-item class="ion-margin-bottom" lines="inset">
                    <ion-select
                      v-model.number="movieForm.rating"
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
                  <ion-item class="ion-margin-bottom" lines="inset">
                    <ion-select
                      v-model="movieForm.status"
                      label="Watch Status"
                      label-placement="floating"
                    >
                      <ion-select-option value="Not Watched">Not Watched</ion-select-option>
                      <ion-select-option value="Watched">Watched</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>
              </ion-row>

              <!-- Form Buttons -->
              <div class="form-actions">
                <ion-button
                  type="submit"
                  expand="block"
                  :color="isEditing ? 'success' : 'primary'"
                >
                  <ion-icon
                    slot="start"
                    :icon="isEditing ? checkmarkOutline : addOutline"
                  />
                  {{ isEditing ? 'Save Changes' : 'Add to Watchlist' }}
                </ion-button>

                <ion-button
                  v-if="isEditing"
                  expand="block"
                  fill="outline"
                  color="medium"
                  class="ion-margin-top"
                  @click="cancelEdit"
                >
                  <ion-icon slot="start" :icon="closeOutline" />
                  Cancel Edit
                </ion-button>
              </div>
            </form>
          </ion-card-content>
        </ion-card>

        <!-- ============================================================ -->
        <!-- 3. FILTER SEGMENT (All / Watched / Not Watched) -->
        <!-- ============================================================ -->
        <ion-segment
          v-model="filterStatus"
          class="ion-margin-top ion-margin-bottom"
        >
          <ion-segment-button value="All">
            <ion-label>All ({{ movies.length }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Not Watched">
            <ion-label>Not Watched ({{ notWatchedCount }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="Watched">
            <ion-label>Watched ({{ watchedCount }})</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- ============================================================ -->
        <!-- 4. MOVIE LIST (READ & DISPLAY) -->
        <!-- ============================================================ -->
        <div v-if="loading" class="empty-state">
          <ion-spinner name="crescent" />
          <p>Connecting to Firebase Realtime Database...</p>
        </div>

        <div v-else-if="filteredMovies.length === 0" class="empty-state">
          <ion-icon :icon="filmOutline" class="empty-icon" />
          <h3>No Movies Found</h3>
          <p v-if="filterStatus !== 'All'">
            No movies in "{{ filterStatus }}" category.
          </p>
          <p v-else>
            Your watchlist is empty. Add your first movie above!
          </p>
        </div>

        <div v-else class="movie-list">
          <ion-card
            v-for="movie in filteredMovies"
            :key="movie.id"
            class="movie-card"
          >
            <ion-card-header>
              <div class="movie-card-header">
                <div>
                  <ion-card-title class="movie-title">
                    {{ movie.title }}
                  </ion-card-title>
                  <ion-card-subtitle class="movie-subtitle">
                    {{ movie.genre }} • {{ movie.year }}
                  </ion-card-subtitle>
                </div>

                <!-- Status Badge -->
                <ion-badge :color="movie.status === 'Watched' ? 'success' : 'warning'">
                  {{ movie.status }}
                </ion-badge>
              </div>
            </ion-card-header>

            <ion-card-content>
              <!-- Star Rating Display -->
              <div class="rating-display">
                <span class="rating-stars">
                  {{ '⭐'.repeat(movie.rating || 1) }}
                </span>
                <span class="rating-text">({{ movie.rating }}/5)</span>
              </div>

              <!-- Action Buttons -->
              <div class="card-buttons ion-margin-top">
                <!-- Fast Toggle Status (UPDATE) -->
                <ion-button
                  size="small"
                  fill="outline"
                  :color="movie.status === 'Watched' ? 'warning' : 'success'"
                  @click="toggleStatus(movie)"
                >
                  <ion-icon
                    slot="start"
                    :icon="movie.status === 'Watched' ? eyeOffOutline : eyeOutline"
                  />
                  Mark as {{ movie.status === 'Watched' ? 'Not Watched' : 'Watched' }}
                </ion-button>

                <!-- Edit Button (UPDATE) -->
                <ion-button
                  size="small"
                  fill="outline"
                  color="primary"
                  @click="startEdit(movie)"
                >
                  <ion-icon slot="start" :icon="createOutline" />
                  Edit
                </ion-button>

                <!-- Delete Button (DELETE) -->
                <ion-button
                  size="small"
                  fill="outline"
                  color="danger"
                  @click="confirmDelete(movie)"
                >
                  <ion-icon slot="start" :icon="trashOutline" />
                  Delete
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
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
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonAlert,
} from '@ionic/vue';
import {
  filmOutline,
  addOutline,
  checkmarkOutline,
  closeOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

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
| Data Model Interface
|--------------------------------------------------------------------------
*/
export interface Movie {
  id?: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  status: 'Watched' | 'Not Watched';
  createdAt?: number;
}

/*
|--------------------------------------------------------------------------
| Reactive Component State
|--------------------------------------------------------------------------
*/
const movies = ref<Movie[]>([]);
const loading = ref(true);
const filterStatus = ref<'All' | 'Watched' | 'Not Watched'>('All');

// Form state for creating or editing
const movieForm = ref<Omit<Movie, 'id'>>({
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
  if (filterStatus.value === 'All') {
    return movies.value;
  }
  return movies.value.filter((m) => m.status === filterStatus.value);
});

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
const saveMovie = async () => {
  if (!movieForm.value.title.trim() || !movieForm.value.genre.trim()) {
    return;
  }

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
  // Scroll to top to see form
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  max-width: 700px;
  margin: 0 auto;
}

/* Stats Cards */
.stats-grid {
  margin-bottom: 12px;
}

.stat-card {
  text-align: center;
  margin: 4px;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--ion-color-primary);
}

.stat-watched .stat-number {
  color: var(--ion-color-success);
}

.stat-not-watched .stat-number {
  color: var(--ion-color-warning);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  margin-top: 2px;
}

/* Form */
.form-card {
  margin: 8px 4px 16px 4px;
}

.form-actions {
  margin-top: 16px;
}

/* Movie Card */
.movie-card {
  margin: 12px 4px;
}

.movie-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.movie-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.movie-subtitle {
  margin-top: 4px;
  font-size: 0.9rem;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.rating-stars {
  font-size: 1.1rem;
}

.rating-text {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.card-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: var(--ion-color-medium);
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
  margin-bottom: 8px;
}
</style>

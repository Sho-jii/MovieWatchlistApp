export type MovieStatus = 'Watched' | 'Not Watched';

export interface Movie {
  id?: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  status: MovieStatus;
  createdAt?: number;
}

export type MovieFormData = Omit<Movie, 'id'>;

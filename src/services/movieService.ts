import axios from 'axios';
import type { Movie } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(query: string, page: number = 1) {
  const response = await axios.get<TMDBResponse>(`${API_URL}/search/movie`, {
    params: { query, language: 'en-US', include_adult: false, page },
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  return response.data;
}

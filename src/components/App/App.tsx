import SearchBar from '../SearchBar/SearchBar';
import css from './App.module.css';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid//MovieGrid';
import { fetchMovies } from '../../services/movieService';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ReactPaginate from 'react-paginate';
import type { TMDBResponse } from '../../services/movieService';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery<TMDBResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      <main className={css.main}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {isSuccess && data && data.results.length > 0 && (
          <>
            {data.total_pages > 1 && (
              <ReactPaginate
                pageCount={data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={data.results} onSelect={handleSelect} />
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

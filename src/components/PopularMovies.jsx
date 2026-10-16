
import { useEffect, useState } from 'react'
import {
  getPopularMovies,
  getMoviesByGenre,
  getSortedMovies,
} from '../services/movieApi'
import MovieCard from './MovieCard'

const genres = [
  { id: 'all', name: 'All Movies' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 16, name: 'Animation' },
  { id: 99, name: 'Documentary' },
]

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'primary_release_date.asc', label: 'Oldest Releases' },
]

function PopularMovies() {
  const [movies, setMovies] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [moreError, setMoreError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadMovies() {
      setLoading(true)
      setError('')
      setMoreError('')
      setPage(1)
      setMovies([])
      setTotalPages(1)

      try {
        let data

        if (selectedGenre === 'all' && sortBy === 'popularity.desc') {
          data = await getPopularMovies(1)
        } else if (selectedGenre !== 'all' && sortBy === 'popularity.desc') {
          data = await getMoviesByGenre(selectedGenre, 1)
        } else {
          data = await getSortedMovies(sortBy, selectedGenre, 1)
        }

        if (!cancelled) {
          setMovies(data.results)
          setPage(data.page)
          setTotalPages(data.totalPages)
        }
      } catch (err) {
        console.error('Could not load movies:', err)

        if (!cancelled) {
          setError(
            'We could not load the movies. Check your connection and try again.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMovies()

    return () => {
      cancelled = true
    }
  }, [selectedGenre, sortBy])

  async function handleLoadMore() {
    if (loadingMore || page >= totalPages) return

    const nextPage = page + 1

    setLoadingMore(true)
    setMoreError('')

    try {
      let data

      if (selectedGenre === 'all' && sortBy === 'popularity.desc') {
        data = await getPopularMovies(nextPage)
      } else if (selectedGenre !== 'all' && sortBy === 'popularity.desc') {
        data = await getMoviesByGenre(selectedGenre, nextPage)
      } else {
        data = await getSortedMovies(sortBy, selectedGenre, nextPage)
      }

      setMovies((currentMovies) => {
        const existingIds = new Set(currentMovies.map((movie) => movie.id))
        const newMovies = data.results.filter(
          (movie) => !existingIds.has(movie.id)
        )

        return [...currentMovies, ...newMovies]
      })

      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Could not load more movies:', err)
      setMoreError('Could not load more movies. Please try again.')
    } finally {
      setLoadingMore(false)
    }
  }

  function handleGenreChange(genreId) {
    setSelectedGenre(genreId)
  }

  function handleSortChange(event) {
    setSortBy(event.target.value)
  }

  const selectedGenreName =
    genres.find((genre) => String(genre.id) === String(selectedGenre))?.name ??
    'Movies'

  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ??
    'Most Popular'

  return (
    <section className="mt-20" aria-label="Discover movies">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Explore the collection
          </p>

          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {selectedGenre === 'all' ? 'Popular Movies' : selectedGenreName}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Browse movies by genre and sort them your way.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-56">
          <label
            htmlFor="movie-sort"
            className="text-sm font-medium text-gray-300"
          >
            Sort movies by
          </label>

          <select
            id="movie-sort"
            value={sortBy}
            onChange={handleSortChange}
            className="rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="mb-9 flex gap-2 overflow-x-auto pb-3"
        aria-label="Filter movies by genre"
      >
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => handleGenreChange(genre.id)}
            aria-pressed={String(selectedGenre) === String(genre.id)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
              String(selectedGenre) === String(genre.id)
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-white/10 bg-white/[0.04] text-gray-400 hover:border-white/25 hover:text-white'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {!loading && !error && movies.length > 0 && (
        <p className="mb-5 text-sm text-gray-500">
          Showing {movies.length} movies · {selectedSortLabel}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-white/10" />
              <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center"
          role="alert"
        >
          <p className="text-red-300">{error}</p>

          <button
            type="button"
            onClick={() => {
              setSortBy((current) => current)
              setSelectedGenre((current) => current)
            }}
            className="mt-4 rounded-lg border border-red-400/30 px-4 py-2 text-sm text-white transition hover:bg-red-500/20"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center">
          <p className="text-lg font-semibold text-white">No movies found</p>
          <p className="mt-2 text-sm text-gray-400">
            Try another genre or sorting option.
          </p>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <div className="mt-12 text-center">
            {moreError && (
              <p className="mb-4 text-sm text-red-300" role="alert">
                {moreError}
              </p>
            )}

            {page < totalPages ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-xl border border-white/15 bg-white/[0.05] px-8 py-3 font-semibold text-white transition hover:border-red-500 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? 'Loading movies...' : 'Load More Movies'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                You've reached the end of the available movies.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default PopularMovies


import { useState } from 'react'
import { searchMovies } from '../services/movieApi'
import MovieCard from './MovieCard'

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'primary_release_date.asc', label: 'Oldest Releases' },
]

function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedTerm, setSearchedTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [moreError, setMoreError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(event) {
    event?.preventDefault()

    const query = searchTerm.trim()

    if (!query || loading || loadingMore) return

    setLoading(true)
    setError('')
    setMoreError('')
    setMovies([])
    setPage(1)
    setTotalPages(1)
    setHasSearched(true)
    setSearchedTerm(query)

    try {
      const data = await searchMovies(query, 1)

      setMovies(data.results)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Movie search failed:', err)

      setError(
        'We could not load your movies. Check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSortChange(event) {
    setSortBy(event.target.value)
  }

  async function handleLoadMore() {
    if (loadingMore || loading || page >= totalPages) return

    const nextPage = page + 1

    setLoadingMore(true)
    setMoreError('')

    try {
      const data = await searchMovies(searchedTerm, nextPage)

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
      console.error('Could not load more search results:', err)
      setMoreError('Could not load more results. Please try again.')
    } finally {
      setLoadingMore(false)
    }
  }

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'vote_average.desc':
        return (
          (b.vote_average ?? 0) - (a.vote_average ?? 0) ||
          (b.vote_count ?? 0) - (a.vote_count ?? 0)
        )

      case 'primary_release_date.desc':
        return (b.release_date || '').localeCompare(a.release_date || '')

      case 'primary_release_date.asc':
        return (a.release_date || '').localeCompare(b.release_date || '')

      case 'popularity.desc':
      default:
        return (b.popularity ?? 0) - (a.popularity ?? 0)
    }
  })

  return (
    <section aria-label="Search for movies">
      <form
        onSubmit={handleSearch}
        className="mx-auto flex max-w-3xl flex-row gap-2 sm:gap-3"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 transition focus-within:border-red-500/70 focus-within:bg-white/[0.08]">
          <svg
            className="h-5 w-5 shrink-0 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="search"
            placeholder="Search movies, titles, and more..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search movies"
            aria-describedby="search-help"
            className="min-w-0 flex-1 bg-transparent py-4 text-white outline-none placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || loadingMore || !searchTerm.trim()}
          className="shrink-0 rounded-xl bg-red-600 px-4 py-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:px-7 sm:text-base"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <p id="search-help" className="sr-only">
        Enter a movie title and press Enter or select Search.
      </p>

      {loading && (
        <div
          className="mt-12 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-red-500" />
          <p className="mt-4 text-sm text-gray-400">
            Searching for "{searchedTerm}"...
          </p>
        </div>
      )}

      {error && (
        <div
          className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center"
          role="alert"
        >
          <p className="text-red-300">{error}</p>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || loadingMore || !searchTerm.trim()}
            className="mt-4 rounded-lg border border-red-400/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/20 disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="mt-14">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                Search results
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Results for "{searchedTerm}"
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Showing {movies.length} movies
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-56">
              <label
                htmlFor="search-sort"
                className="text-sm font-medium text-gray-300"
              >
                Sort results by
              </label>

              <select
                id="search-sort"
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

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {sortedMovies.map((movie) => (
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
                disabled={loadingMore || loading}
                className="rounded-xl border border-white/15 bg-white/[0.05] px-8 py-3 font-semibold text-white transition hover:border-red-500 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? 'Loading results...' : 'Load More Results'}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                You've reached the end of the search results.
              </p>
            )}
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && movies.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center">
          <div className="mb-4 text-4xl" aria-hidden="true">
            🎬
          </div>

          <h2 className="text-lg font-semibold text-white">
            No movies found for "{searchedTerm}"
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Check the spelling or try another movie title.
          </p>
        </div>
      )}
    </section>
  )
}

export default Search

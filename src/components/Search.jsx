
import { useState } from 'react'
import { searchMovies } from '../services/movieApi'
import MovieCard from './MovieCard'

function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError('')

    try {
      const results = await searchMovies(searchTerm)
      setMovies(results)
    } catch (error) {
      console.error(error)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mx-auto flex max-w-2xl gap-3">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSearch()
          }}
          className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <p className="mt-4 text-center text-gray-400">
        You searched for: {searchTerm}
      </p>

      {loading && (
        <p className="mt-6 text-center text-white">
          Searching for movies...
        </p>
      )}

      {error && (
        <p className="mt-6 text-center text-red-500">
          {error}
        </p>
      )}

      
{!loading && !error && movies.length > 0 && (
  <div className="mt-10">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">
        Search Results
      </h2>

      <p className="text-gray-400">
        {movies.length} movies found
      </p>
    </div>

    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </div>
)}


      {!loading && !error && searchTerm.trim() && movies.length === 0 && (
        <p className="mt-6 text-center text-gray-400">
          No movies found. Try another title.
        </p>
      )}
    </div>
  )
}

export default Search
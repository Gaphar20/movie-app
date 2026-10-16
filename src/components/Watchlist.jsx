
import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useWatchlist } from '../context/WatchlistContext'

function Watchlist() {
  const { watchlist, removeFromWatchlist } = useWatchlist()

  return (
    <main className="min-h-screen bg-[#09090b] px-6 py-12 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Home
        </Link>

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Your Collection
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            My Watchlist
          </h1>

          <p className="mt-3 text-zinc-400">
            {watchlist.length === 1
              ? '1 movie saved for later.'
              : `${watchlist.length} movies saved for later.`}
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mb-4 text-5xl" aria-hidden="true">
              🎬
            </div>

            <h2 className="text-2xl font-semibold">
              Your watchlist is empty
            </h2>

            <p className="mt-3 text-zinc-400">
              Find a movie you love and save it here to watch later.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-red-500 px-6 py-3 font-semibold transition hover:bg-red-600"
            >
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {watchlist.map((movie) => (
              <div key={movie.id} className="flex flex-col gap-3">
                <MovieCard movie={movie} />

                <button
                  type="button"
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="w-full rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Remove from Watchlist
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Watchlist

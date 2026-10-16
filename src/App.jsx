
import Search from './components/Search'
import PopularMovies from './components/PopularMovies'
import FeaturedMovie from './components/FeaturedMovie'
import MovieDetails from './components/MovieDetails'
import { Routes, Route, Link } from 'react-router-dom'
import Watchlist from './components/Watchlist'

function HomePage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#08090d]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="text-2xl font-black tracking-tight">
            cine<span className="text-red-500">scope</span>
            <span className="ml-2 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
              movies
            </span>
          </Link>

          <span className="hidden text-sm text-gray-400 sm:block">
            Your next favorite film starts here.
          </span>

          <div className="flex items-center gap-3">
            <Link
              to="/watchlist"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition hover:border-red-500 hover:bg-red-500/10"
            >
              ♡ Watchlist
            </Link>

            <a
              href="#discover"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium transition hover:border-red-500 hover:bg-red-500/10"
            >
              Discover
            </a>
          </div>
        </div>
      </nav>

      {/* Featured movie */}
      <FeaturedMovie />

      {/* Search and popular movies */}
      <section
        id="discover"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Find your next favorite
          </p>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Search the movie universe
          </h2>
        </div>

        <Search />
        <PopularMovies />
      </section>

      {/* Footer with developer credit */}
      <footer className="mt-10 border-t border-white/10 bg-[#0b0c12]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <p className="text-lg font-black tracking-tight">
              cine<span className="text-red-500">scope</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Discover something worth watching.
            </p>
          </div>

          <div className="text-sm text-gray-500 sm:text-right">
            <p>
              Built by{' '}
              <span className="font-semibold text-white">
                Abdulgafar
              </span>
            </p>
            <p className="mt-1">
              Movie data and posters provided by TMDB.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  )
}

export default App

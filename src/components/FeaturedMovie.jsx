
import { useEffect, useState } from 'react'
import { getPopularMovies } from '../services/movieApi'

function FeaturedMovie() {
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadFeaturedMovie() {
      try {
        const data = await getPopularMovies()

        if (!cancelled && data.results.length > 0) {
          setMovie(data.results[0])
        }
      } catch (error) {
        console.error('Could not load featured movie:', error)
      }
    }

    loadFeaturedMovie()

    return () => {
      cancelled = true
    }
  }, [])

  if (!movie) return null

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090d] via-[#08090d]/85 to-[#08090d]/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08090d] via-transparent to-black/20" />

      <div className="mx-auto flex min-h-[360px] max-w-7xl items-center px-5 py-10 sm:min-h-[520px] sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Featured movie
          </p>

          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-6xl">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-300">
            <span className="rounded-md bg-white/10 px-2.5 py-1">
              {movie.release_date
                ? movie.release_date.slice(0, 4)
                : 'Release date unknown'}
            </span>

            <span className="text-amber-400">
              ★ {movie.vote_average
                ? movie.vote_average.toFixed(1)
                : 'N/A'}
            </span>

            <span className="text-gray-400">TMDB Popular</span>
          </div>

          <p className="mt-5 line-clamp-4 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
            {movie.overview || 'Discover this movie on CineScope.'}
          </p>

          <a
            href="#discover"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white transition hover:bg-red-500"
          >
            Explore movies
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedMovie

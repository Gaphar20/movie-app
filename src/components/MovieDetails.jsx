import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_URL = 'https://api.themoviedb.org/3'

function MovieDetails() {
  const { id } = useParams()

  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  } = useWatchlist()

  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadMovie() {
      setLoading(true)
      setError('')
      setMovie(null)
      setCredits(null)
      setTrailer(null)

      try {
        if (!API_KEY) {
          throw new Error('TMDB API key is missing.')
        }

        const [movieResponse, creditsResponse, videosResponse] =
          await Promise.all([
            fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`, {
              signal: controller.signal,
            }),
            fetch(`${API_URL}/movie/${id}/credits?api_key=${API_KEY}`, {
              signal: controller.signal,
            }),
            fetch(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}`, {
              signal: controller.signal,
            }),
          ])

        if (!movieResponse.ok) {
          throw new Error('Movie details could not be found.')
        }

        const movieData = await movieResponse.json()
        setMovie(movieData)

        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json()
          setCredits(creditsData)
        }

        if (videosResponse.ok) {
          const videosData = await videosResponse.json()

          const trailerVideo =
            videosData.results?.find(
              (video) =>
                video.site === 'YouTube' &&
                video.type === 'Trailer' &&
                video.official
            ) ||
            videosData.results?.find(
              (video) =>
                video.site === 'YouTube' &&
                video.type === 'Trailer'
            )

          setTrailer(trailerVideo || null)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err)
          setError(err.message || 'Something went wrong.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMovie()

    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-5 text-white">
        <p className="animate-pulse text-gray-400" role="status">
          Loading movie details...
        </p>
      </main>
    )
  }

  if (error || !movie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#08090d] px-5 text-center text-white">
        <h1 className="text-2xl font-bold">
          Movie unavailable
        </h1>

        <p className="text-gray-400">
          {error || 'We could not find this movie.'}
        </p>

        <Link
          to="/"
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
        >
          Back to CineScope
        </Link>
      </main>
    )
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750/15151c/FFFFFF?text=Poster+Unavailable'

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Unknown'

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'Runtime unavailable'

  const cast = credits?.cast?.slice(0, 8) || []
  const saved = isInWatchlist(movie.id)

  function handleWatchlistClick() {
    if (saved) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      {/* Cinematic Hero */}
      <section className="relative isolate overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090d] via-[#08090d]/90 to-[#08090d]/45" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08090d] via-transparent to-black/30" />

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-gray-200 transition hover:border-red-400 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Back to CineScope
          </Link>

          <div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:py-16">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="w-44 rounded-2xl border border-white/10 shadow-2xl sm:w-64"
            />

            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                Movie details
              </p>

              <h1 className="text-3xl font-black leading-tight sm:text-5xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-3 italic text-gray-300">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <span>{releaseYear}</span>

                <span className="text-amber-400">
                  ★{' '}
                  {Number(movie.vote_average) > 0
                    ? movie.vote_average.toFixed(1)
                    : 'N/A'}
                </span>

                <span>{runtime}</span>

                {movie.adult && (
                  <span className="rounded border border-red-400/40 px-2 py-1 text-xs text-red-300">
                    Adult
                  </span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-gray-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h2 className="mt-8 text-xl font-bold">
                Overview
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
                {movie.overview ||
                  'No overview is available for this movie.'}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
                  >
                    <span aria-hidden="true">▶</span>
                    Watch Trailer
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleWatchlistClick}
                  aria-pressed={saved}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
                    saved
                      ? 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      : 'border-white/20 text-white hover:border-red-400 hover:bg-white/5'
                  }`}
                >
                  <span aria-hidden="true">
                    {saved ? '✓' : '+'}
                  </span>

                  {saved
                    ? 'Remove from Watchlist'
                    : 'Add to Watchlist'}
                </button>
              </div>

              {movie.status && (
                <p className="mt-5 text-sm text-gray-400">
                  Status:{' '}
                  <span className="text-gray-200">
                    {movie.status}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              The people behind the movie
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Top Cast
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {cast.map((person) => (
              <article
                key={person.cast_id ?? `${person.id}-${person.credit_id}`}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : 'https://placehold.co/300x450/15151c/FFFFFF?text=No+Photo'
                  }
                  alt={person.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />

                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {person.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                    {person.character || 'Cast member'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Production Information */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">
            Production Details
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Original title
              </p>

              <p className="mt-2 text-sm text-gray-200">
                {movie.original_title || movie.title}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Original language
              </p>

              <p className="mt-2 text-sm text-gray-200">
                {movie.original_language?.toUpperCase() || 'Unknown'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Production companies
              </p>

              <p className="mt-2 text-sm text-gray-200">
                {movie.production_companies?.length
                  ? movie.production_companies
                      .map((company) => company.name)
                      .join(', ')
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-sm text-gray-500">
        CineScope · Movie information provided by TMDB.
      </footer>
    </main>
  )
}

export default MovieDetails
import { Link } from 'react-router-dom'

function MovieCard({ movie }) {
  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'Release date unknown'

  const rating = Number(movie.vote_average)
  const hasRating = Number.isFinite(rating) && rating > 0

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      aria-label={`View details for ${movie.title}`}
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gray-900 shadow-lg shadow-black/20">
        <img
          className="aspect-[2/3] w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://placehold.co/500x750/15151c/FFFFFF?text=Poster+Unavailable'
          }
          alt={`${movie.title} poster`}
          loading="lazy"
        />

        {/* Dark Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-60 transition duration-300 group-hover:opacity-100" />

        {/* Movie Rating */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg border border-white/10 bg-black/70 px-2.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          <span className="text-amber-400">★</span>
          {hasRating ? rating.toFixed(1) : 'N/A'}
        </div>

        {/* Movie Overview on Hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-300">
            Movie overview
          </p>

          <p className="mt-2 line-clamp-4 text-sm leading-6 text-white">
            {movie.overview ||
              'No overview is available for this movie.'}
          </p>
        </div>
      </div>

      {/* Movie Information */}
      <div className="px-1 pt-4">
        <h3 className="line-clamp-2 font-semibold leading-6 text-gray-100 transition-colors group-hover:text-red-400">
          {movie.title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-gray-500">
          <span>{releaseYear}</span>

          <span className="shrink-0 rounded-md border border-white/10 px-2 py-1">
            TMDB
          </span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
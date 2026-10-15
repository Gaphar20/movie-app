
function MovieCard({ movie }) {
  const releaseYear = movie.release_date
    ? movie.release_date.split('-')[0]
    : 'N/A'

  return (
    <article className="overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        className="h-80 w-full object-cover"
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/500x750/111827/FFFFFF?text=No+Poster'
        }
        alt={`${movie.title} poster`}
        loading="lazy"
      />

      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-bold text-white">
          {movie.title}
        </h3>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
          <span>{releaseYear}</span>

          <span>
            ⭐ {movie.vote_average
              ? movie.vote_average.toFixed(1)
              : 'N/A'}
          </span>
        </div>
      </div>
    </article>
  )
}

export default MovieCard

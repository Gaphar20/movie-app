
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_URL = 'https://api.themoviedb.org/3'

async function fetchMovies(endpoint) {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key is missing. Check your .env.local file.'
    )
  }

  const separator = endpoint.includes('?') ? '&' : '?'

  const response = await fetch(
    `${API_URL}${endpoint}${separator}api_key=${API_KEY}`
  )

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`)
  }

  const data = await response.json()

  return {
    results: data.results ?? [],
    page: data.page ?? 1,
    totalPages: data.total_pages ?? 1,
    totalResults: data.total_results ?? 0,
  }
}

export async function searchMovies(query, page = 1) {
  return fetchMovies(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}`
  )
}

export async function getPopularMovies(page = 1) {
  return fetchMovies(`/movie/popular?page=${page}`)
}

export async function getMoviesByGenre(genreId, page = 1) {
  return fetchMovies(
    `/discover/movie?with_genres=${encodeURIComponent(genreId)}&sort_by=popularity.desc&page=${page}`
  )
}

export async function getSortedMovies(
  sortBy,
  genreId = 'all',
  page = 1
) {
  const validSortOptions = [
    'popularity.desc',
    'vote_average.desc',
    'primary_release_date.desc',
    'primary_release_date.asc',
  ]

  if (!validSortOptions.includes(sortBy)) {
    throw new Error('Invalid movie sorting option.')
  }

  const params = new URLSearchParams({
    sort_by: sortBy,
    page: String(page),
    'vote_count.gte': '50',
  })

  if (genreId !== 'all') {
    params.set('with_genres', String(genreId))
  }

  return fetchMovies(`/discover/movie?${params.toString()}`)
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_URL = 'https://api.themoviedb.org/3'

export async function searchMovies(query) {
  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch movies')
  }

  const data = await response.json()

  return data.results
}

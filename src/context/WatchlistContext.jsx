import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const WatchlistContext = createContext(null)

const STORAGE_KEY = 'cinescope-watchlist'

function getSavedMovies() {
  try {
    const savedMovies = localStorage.getItem(STORAGE_KEY)

    if (!savedMovies) {
      return []
    }

    const parsedMovies = JSON.parse(savedMovies)

    return Array.isArray(parsedMovies) ? parsedMovies : []
  } catch (error) {
    console.error('Could not load the watchlist:', error)
    return []
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(getSavedMovies)

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(watchlist)
      )
    } catch (error) {
      console.error('Could not save the watchlist:', error)
    }
  }, [watchlist])

  const addToWatchlist = useCallback((movie) => {
    setWatchlist((currentMovies) => {
      const alreadySaved = currentMovies.some(
        (savedMovie) => savedMovie.id === movie.id
      )

      if (alreadySaved) {
        return currentMovies
      }

      return [...currentMovies, movie]
    })
  }, [])

  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((currentMovies) =>
      currentMovies.filter(
        (movie) => movie.id !== movieId
      )
    )
  }, [])

  const isInWatchlist = useCallback(
    (movieId) =>
      watchlist.some((movie) => movie.id === movieId),
    [watchlist]
  )

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)

  if (!context) {
    throw new Error(
      'useWatchlist must be used inside a WatchlistProvider'
    )
  }

  return context
}
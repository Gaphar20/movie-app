
import Search from './components/Search'

function App() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Movie App
          </h1>

          <p className="text-gray-400">
            Discover and search for your favorite movies
          </p>
        </header>

        <Search />
      </div>
    </main>
  )
}

export default App

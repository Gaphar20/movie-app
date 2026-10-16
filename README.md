# 🎬 CineScope

**Discover your next favourite movie.**

CineScope is a movie discovery web application that helps users explore popular films, search for movies, view movie details, and save favourites to a personal watchlist.

🌐 **Live Demo:** https://my-cinescope-app.netlify.app/

## ✨ Features

- **Discover Movies** — Browse popular movies and explore available titles.
- **Movie Search** — Search for movies by title.
- **Movie Details** — Open individual movie pages to view available information.
- **Featured Movie** — Explore a highlighted movie on the homepage.
- **Sorting and Genre Filtering** — Organise movie results using available sorting and genre options.
- **Pagination** — Load additional results as you explore.
- **Personal Watchlist** — Add movies to your watchlist and manage your saved selections.
- **Persistent Storage** — Watchlist selections are saved in the browser using local storage.
- **Responsive Interface** — A dark, cinema-inspired design built for a modern browsing experience.

## 🛠️ Built With

- **React** — Building the user interface.
- **Vite** — Development server and production build tooling.
- **Tailwind CSS** — Styling and responsive layouts.
- **React Router** — Client-side navigation and movie detail routes.
- **TMDB API** — Movie information and poster data.
- **JavaScript** — Application logic and API integration.
- **Netlify** — Deployment and hosting.
- **Git and GitHub** — Version control and source code hosting.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- A TMDB API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Gaphar20/movie-app.git
   ```

2. Enter the project directory:

   ```bash
   cd movie-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and add your TMDB API key:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

   Replace `your_tmdb_api_key` with your own key. Never commit your local `.env.local` file.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in your terminal.

### Production Build

To create an optimised production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## 🔑 API Information

CineScope uses the [TMDB API](https://developer.themoviedb.org/docs) to retrieve movie information and associated images.

This product uses the TMDB API but is not endorsed or certified by TMDB.

The `VITE_TMDB_API_KEY` variable is used by the client-side application. Variables with the `VITE_` prefix are included in the browser bundle, so this key should not be treated as a private server-side secret.

## 📂 Project Structure

```text
movie-app/
├── public/
├── src/
│   ├── components/
│   │   ├── FeaturedMovie.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── PopularMovies.jsx
│   │   ├── Search.jsx
│   │   └── Watchlist.jsx
│   ├── context/
│   │   └── WatchlistContext.jsx
│   ├── services/
│   │   └── movieApi.js
│   ├── App.jsx
│   └── main.jsx
├── .env.local
├── package.json
└── README.md
```

## 🎯 Project Goals

CineScope was built to practise and demonstrate:

- Building reusable React components.
- Fetching and displaying data from an external API.
- Managing application state and browser storage.
- Implementing search, sorting, filtering, and pagination.
- Creating multi-page navigation with React Router.
- Building and deploying a production-ready frontend application.

## 👨‍💻 Developer

**Built by Abdulgafar**

- GitHub: [@Gaphar20](https://github.com/Gaphar20)
- Project repository: [Gaphar20/movie-app](https://github.com/Gaphar20/movie-app)
- Live website: [CineScope](https://my-cinescope-app.netlify.app/)

---

*Discover something worth watching.*

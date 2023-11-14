import { Children, useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "235f5cfe";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const resp = await fetch(
          `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`
        );
        if (!resp.ok) {
          throw new Error("Something has gone wrong!!!");
        }
        const result = await resp.json();
        console.log(result);
        if (result.Response === "False") {
          throw new Error("Films aren't found!!!");
        }
        setMovies(result.Search);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) return;
    fetchMovies();
  }, [query]);

  const onSelectMovie = (id) => {
    setSelectedMovie(id);
  };

  const arrowBack = () => {
    setSelectedMovie("");
  };

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        {/* <StarRating maxRating={5} color="yellow" size={20} /> */}
        <Box>
          {isLoading && <Loader />}

          {!isLoading && !error && (
            <MovieList onSelectMovie={onSelectMovie} movies={movies} />
          )}

          {error && <MessageError message={error} />}
        </Box>
        <Box>
          {selectedMovie ? (
            <MovieDetails selectedMovie={selectedMovie} arrowBack={arrowBack} />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <div className="loader">Loading...</div>;
};

const MessageError = ({ message }) => {
  return (
    <div className="error">
      Something gone wrong!!!
      <p>{message}</p>
    </div>
  );
};

const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const Numresults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">{isOpen && children}</div>;
};

const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          onSelectMovie={() => {
            onSelectMovie(movie.imdbID);
          }}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
};

const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li onClick={onSelectMovie}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

function MovieDetails({ selectedMovie, arrowBack }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsLoading(true);
      const resp = await fetch(
        `http://www.omdbapi.com/?i=${selectedMovie}&apikey=${KEY}`
      );
      const result = await resp.json();
      setMovie(result);
      setIsLoading(false);
    }
    fetchMovieDetails();
  }, [selectedMovie]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={() => arrowBack()} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} color={"#fcc419"} size={24} />
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// const WatchedBox = () => {
//   const [isOpen2, setIsOpen2] = useState(true);

//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummery watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// };

const WatchedSummery = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedList = ({ watched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
};

const WatchedMovie = ({ movie }) => {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
};

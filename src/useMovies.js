import React, { useState, useEffect } from "react";

const KEY = "235f5cfe";

export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (query.length < 3) {
      setMovies("");
      return;
    }
    fetchMovies();
  }, [query]);

  return { movies, isLoading, error };
};

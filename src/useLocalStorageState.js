import { useState, useEffect } from "react";

export const useLocalStorageState = (initialValue, word) => {
  const [watched, setWatched] = useState(() => {
    return getItemfromStore();
  });

  useEffect(() => {
    localStorage.setItem(word, JSON.stringify(watched));
  }, [watched, word]);

  function getItemfromStore() {
    return JSON.parse(localStorage.getItem(word));
  }

  return [watched, setWatched];
};

import { useState } from "react";
import { fetchMovieSearch } from "../../modules/fetchers";
import FilmSearchResultCard from "./FilmSearchResultCard";
import styles from "./AddFilmSheet.module.css";

export default function AddFilmSheet({ isOpen, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await fetchMovieSearch(query);
      setResults(data.results.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(movie) {
    await onAdd(movie); // parent decides what to do with it
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <h2>Add a Film</h2>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search films..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className={styles.loading}>Searching…</p>}

        <div className={styles.results}>
          {results.map((movie) => (
            <FilmSearchResultCard
              key={movie.id}
              movie={movie}
              onAdd={() => handleAdd(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { fetchMovieSearch } from "../../modules/fetchers";
import FilmSearchResultCard from "./FilmSearchResultCard";
import styles from "./AddFilmSheet.module.css";

export default function AddFilmSheet({ isOpen, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== Drag-to-close logic =====
  const sheetRef = useRef(null);
  const handleRef = useRef(null);
  const dragStart = useRef(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    handle.addEventListener("touchstart", handleTouchStart, { passive: true });
    handle.addEventListener("touchmove", handleTouchMove, { passive: false });
    handle.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      handle.removeEventListener("touchstart", handleTouchStart);
      handle.removeEventListener("touchmove", handleTouchMove);
      handle.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragY]);

  function handleTouchStart(e) {
    dragStart.current = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const delta = e.touches[0].clientY - dragStart.current;
    setDragY(delta);
  }

  function handleTouchEnd() {
    if (dragY > 10) {
      // threshold — if dragged more than 120px, close
      handleClose();
    }
    setDragY(0); // snap back if not past threshold
  }

  // ===== End of Drag-to-close logic =====

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
    handleClose();
  }

  function handleClose() {
    setQuery("");
    setResults([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        style={{
          transform: dragY === 0 ? undefined : `translateY(${dragY}px)`,
          transition: dragY === 0 ? undefined : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={handleRef} className={styles.dragHandle} />
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

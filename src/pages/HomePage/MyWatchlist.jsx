import { useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./MyWatchlist.module.css";

export default function MyWatchlist({ watchlist, onBack, removeFilm }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const pressTimer = useRef(null);

  function handleTouchStart() {
    pressTimer.current = setTimeout(() => setEditMode(true), 500);
  }

  function handleTouchEnd() {
    clearTimeout(pressTimer.current);
  }

  function handleCardClick(filmId) {
    if (editMode) return; // clicks are swallowed in edit mode — only the × badge removes
    navigate(`/movies/${filmId}`);
  }

  function handleRemove(e, filmId) {
    e.stopPropagation(); // prevent click bubbling up to the card's onClick
    removeFilm(filmId);
  }

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.topRow}>
          <button className={styles.back} onClick={onBack}>
            ← Back
          </button>
          <div className={styles.topRowRight}>
            {editMode && (
              <button
                className={styles.doneBtn}
                onClick={() => setEditMode(false)}
              >
                Done
              </button>
            )}
            <NavLink to="/movies" className={styles.addBtn}>
              + Add Film
            </NavLink>
          </div>
        </div>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Your collection</p>
          <h1 className={styles.title}>
            My <span>Watchlist</span>
          </h1>
          <p className={styles.meta}>
            {watchlist.length} film{watchlist.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nothing here yet.</p>
          <p className={styles.emptySub}>
            Add a film to start your collection.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {watchlist.map((film, index) => (
            <div
              key={film.id}
              className={`${styles.card} ${editMode ? styles.cardEditMode : ""}`}
              style={{ animationDelay: `${index * 0.04}s` }}
              onClick={() => handleCardClick(film.id)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
            >
              {editMode && (
                <button
                  className={styles.removeBadge}
                  onClick={(e) => handleRemove(e, film.id)}
                >
                  ×
                </button>
              )}
              <img
                src={film.poster}
                alt={film.title}
                className={styles.poster}
              />
              <div className={styles.overlay}>
                <p className={styles.cardTitle}>{film.title}</p>
                <p className={styles.cardYear}>{film.releaseDate}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

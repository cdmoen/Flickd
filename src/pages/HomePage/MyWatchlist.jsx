import { NavLink } from "react-router-dom";
import styles from "./MyWatchlist.module.css";

export default function MyWatchlist({ watchlist, onBack }) {
  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.topRow}>
          <button className={styles.back} onClick={onBack}>
            ← Back
          </button>
          <NavLink to="/movies" className={styles.addBtn}>
            + Add Film
          </NavLink>
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
              className={styles.card}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
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

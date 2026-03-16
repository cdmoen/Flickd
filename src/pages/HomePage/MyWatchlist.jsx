import { NavLink } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function MyWatchlist({ watchlist, onBack }) {
  return (
    <div className={styles.watchlist}>
      <button className={styles.backBtn} onClick={onBack}>
        Back
      </button>

      <div className={styles.cardRow}>
        <img
          src="/images/glasses.png"
          alt="Watchlist Icon"
          className={styles.cardIcon}
        />
        <h2 className={styles.watchlistTitle}>My Watchlist</h2>
      </div>

      {watchlist.length === 0 && (
        <p className={styles.emptyText}>Your watchlist is empty.</p>
      )}

      <NavLink to="/movies" className={styles.cardBtn}>
        Add a Film
      </NavLink>

      <div className={styles.filmList}>
        {watchlist.map((film) => (
          <div key={film.id} className={styles.filmItem}>
            <img
              src={`https://image.tmdb.org/t/p/w300${film.posterPath}`}
              alt={film.title}
              className={styles.poster}
            />
            <div className={styles.info}>
              <p className={styles.filmTitle}>{film.title}</p>
              <p className={styles.filmNote}>{film.releaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ref, set, push, remove } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./FilmCard.module.css";

export default function FilmCard({ film, filmId, groupId, uid }) {
  const rating = film.ratings?.[uid] ?? null;
  const seen = film.seen?.[uid] ?? false;

  function handleRate(value) {
    const ratingRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/ratings/${uid}`,
    );
    set(ratingRef, value);
  }

  function toggleSeen() {
    const seenRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/seen/${uid}`,
    );
    set(seenRef, !seen);
  }

  function addComment(text) {
    const commentsRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/comments`,
    );
    const newCommentRef = push(commentsRef);
    set(newCommentRef, {
      uid,
      text,
      timestamp: Date.now(),
    });
  }

  function removeFilm() {
    const filmRef = ref(database, `groups/${groupId}/films/${filmId}`);
    remove(filmRef);
  }

  return (
    <div className={styles.card}>
      <img src={film.posterURL} alt={film.title} className={styles.poster} />

      <div className={styles.info}>
        <h2 className={styles.title}>
          <a href={`/film/${film.tmdbId}`}>{film.title}</a>
        </h2>
        <p>{film.releaseYear}</p>
        <p>Genre: {film.genres}</p>

        <div className={styles.actions}>
          <button className={styles.button} onClick={() => handleRate(8)}>
            Rate
          </button>
          <button className={styles.button} onClick={toggleSeen}>
            {seen ? "Seen ✓" : "Mark Seen"}
          </button>
          <button
            className={styles.button}
            onClick={() => addComment("Nice pick!")}
          >
            Comment
          </button>
          <button className={styles.button} onClick={removeFilm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

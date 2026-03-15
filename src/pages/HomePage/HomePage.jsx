import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AvatarPicker from "./AvatarPicker";  
import { NavLink } from "react-router-dom";
import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, logout, profile, loading } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  if (loading) return <div className={styles.loading}>Loading...</div>;

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await addFilm({ title, note });
    setTitle("");
    setNote("");
  }

  return (
    <main className={styles.container}>

      {!showWatchlist && (
        <div className={styles.cardGrid}>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>My Watchlist</h2>
            <div className={styles.cardRow}>
              <img
                src="/images/glasses.png"
                alt="Friends Icon"
                title="Friends"
                className={styles.cardIcon}
              />
              <p className={styles.cardContent}>
                The movies you want to watch. Your personal watchlist!
              </p>
            </div>
            <button className={styles.cardBtn} onClick={() => setShowWatchlist(true)}>
              My Watchlist
            </button>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Friends</h2>
            <div className={styles.cardRow}>
              <img
                src="/images/ticket.png"
                alt="Friends Icon"
                title="Friends"
                className={styles.cardIcon}
              />
              <p className={styles.cardContent}>
                Add friends to share your group watchlists.
              </p>
            </div>
            <NavLink to="/friends" className={styles.cardBtn}>
              Add Friends
            </NavLink>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Groups</h2>
            <div className={styles.cardRow}>
              <img
                src="/images/roll.png"
                alt="Groups Icon"
                title="Groups"
                className={styles.cardIcon}
              />
              <p className={styles.cardContent}>
                Create a group to share watchlists.
              </p>
            </div>
            <NavLink to="/groups" className={styles.cardBtn}>
              Add Groups
            </NavLink>
          </div>

        </div>
      )}

      {showWatchlist && (
        <div className={styles.watchlist}>
          <button className={styles.backBtn} onClick={() => setShowWatchlist(false)}>
            Back
          </button>

          <div className={styles.cardRow}>
            <img src="/images/glasses.png" alt="Watchlist Icon" className={styles.cardIcon} />
            <h2 className={styles.watchlistTitle}>My Watchlist</h2>
          </div>

          <form className={styles.addForm} onSubmit={handleAdd}>
            <input
              className={styles.input}
              type="text"
              placeholder="Movie title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button className={styles.cardBtn} type="submit">Add Film</button>
          </form>

          {watchlist.length === 0 && (
            <p className={styles.cardContent}>No films yet — add one above!</p>
          )}

          <div className={styles.filmList}>
            {watchlist.map((film) => (
              <div key={film.id} className={styles.filmItem}>
                <div>
                  <p className={styles.filmTitle}>{film.title}</p>
                  {film.note && <p className={styles.filmNote}>{film.note}</p>}
                </div>
                <button className={styles.removeBtn} onClick={() => removeFilm(film.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
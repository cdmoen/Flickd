import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MyWatchlist from "./MyWatchlist";
import FriendsCard from "./FriendsCard";
import GroupsCard from "./GroupsCard";
import WatchlistCard from "./WatchlistCard";
import AddFilmSheet from "../../components/AddFilmSheet/AddFilmSheet";

import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [addFilmSheetIsOpen, setAddFilmSheetIsOpen] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);

  function handleAddFilm(movie) {
    addFilm({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : "/images/placeholder.svg",
      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : "/images/backdrop_placeholder.svg",
      year: movie.release_date?.slice(0, 4),
    });
    setAddFilmSheetIsOpen(false);
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <main className={styles.container}>
      {!showWatchlist && (
        <div className={styles.cardGrid}>
          <WatchlistCard onOpen={() => setShowWatchlist(true)} />
          <FriendsCard />
          <GroupsCard />
        </div>
      )}

      {showWatchlist && (
        <MyWatchlist
          watchlist={watchlist}
          addFilm={addFilm}
          removeFilm={removeFilm}
          onBack={() => setShowWatchlist(false)}
          setAddFilmSheetIsOpen={setAddFilmSheetIsOpen}
        />
      )}

      <AddFilmSheet
        isOpen={addFilmSheetIsOpen}
        onClose={() => setAddFilmSheetIsOpen(false)}
        onAdd={(movie) => handleAddFilm(movie)}
      />
    </main>
  );
}

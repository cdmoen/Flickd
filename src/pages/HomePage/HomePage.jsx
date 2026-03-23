import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MyWatchlist from "./MyWatchlist";
import FriendsCard from "./FriendsCard";
import GroupsCard from "./GroupsCard";
import WatchlistCard from "./WatchlistCard";
import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { watchlist, addFilm, removeFilm } = useWatchlist(user?.uid);
  const [showCards, setShowCards] = useState(true);
  const watchlistRef = useRef(null);
  const topRef = useRef(null);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  function handleOpenWatchlist() {
    setShowCards(false);
    setTimeout(() => {
      watchlistRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleBack() {
    setShowCards(true);
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <main className={styles.container}>

      <div ref={topRef} />

      {showCards && (
        <div className={styles.cardGrid}>
          <WatchlistCard onOpen={handleOpenWatchlist} />
          <FriendsCard />
          <GroupsCard />
        </div>
      )}

      <div ref={watchlistRef}>
        <MyWatchlist
          watchlist={watchlist}
          addFilm={addFilm}
          removeFilm={removeFilm}
          onBack={handleBack}
        />
      </div>

    </main>
  );
}
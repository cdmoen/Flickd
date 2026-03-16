import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MyWatchlist from "./MyWatchlist";
import FriendsCard from "./FriendsCard";
import GroupsCard from "./GroupsCard";
import WatchlistCard from "./WatchlistCard";
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
          onBack={() => setShowWatchlist(false)}
        />
      )}
    </main>
  );
}

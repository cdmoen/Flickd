import styles from "./HomePage.module.css";

export default function WatchlistCard({ onOpen }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>My Watchlist</h2>

      <section className={styles.cardRow}>
        <img
          src="/images/glasses.png"
          alt="Watchlist Icon"
          title="Watchlist"
          className={styles.cardIcon}
        />
        <p className={styles.cardContent}>
          The movies you want to watch. Your personal watchlist!
        </p>
      </section>

      <button 
        className={styles.cardBtn} 
        onClick={onOpen} 
        aria-label="View my watchlist"
      >
        My Watchlist
      </button>
    </article>
  );
}

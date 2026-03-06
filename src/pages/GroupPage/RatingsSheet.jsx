import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./RatingsSheet.module.css";

export default function RatingsSheet({
  isOpen,
  onClose,
  groupId,
  filmId,
  profile,
}) {
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const ratingsRef = ref(
      database,
      `groups/${groupId}/films/${filmId}/ratings`,
    );
    return onValue(ratingsRef, (snap) => {
      setRatings(snap.exists() ? snap.val() : {});
    });
  }, [isOpen, groupId, filmId]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <h2>Ratings</h2>

        <div className={styles.list}>
          {Object.entries(ratings).map(([uid, stars]) => (
            <div key={uid} className={styles.row}>
              <span className={styles.user}>{uid}</span>
              <span className={styles.stars}>{stars} ★</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

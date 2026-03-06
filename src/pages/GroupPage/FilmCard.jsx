import { useState } from "react";
import CommentsSheet from "./CommentsSheet";
import RatingsSheet from "./RatingsSheet";
import SeenSheet from "./SeenSheet";
import styles from "./FilmCard.module.css";

export default function FilmCard({ film, filmId, groupId, uid, profile }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [seenOpen, setSeenOpen] = useState(false);

  return (
    <>
      <div className={styles.card}>
        <img src={film.posterURL} className={styles.poster} />

        <div className={styles.info}>
          <h3 className={styles.title}>{film.title}</h3>

          <div className={styles.actions}>
            <button onClick={() => setCommentsOpen(true)}>Comments</button>
            <button onClick={() => setRatingsOpen(true)}>Ratings</button>
            <button onClick={() => setSeenOpen(true)}>Viewed</button>
          </div>
        </div>
      </div>

      <CommentsSheet
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        groupId={groupId}
        filmId={filmId}
        uid={uid}
        profile={profile}
      />

      <RatingsSheet
        isOpen={ratingsOpen}
        onClose={() => setRatingsOpen(false)}
        groupId={groupId}
        filmId={filmId}
        profile={profile}
      />

      <SeenSheet
        isOpen={seenOpen}
        onClose={() => setSeenOpen(false)}
        groupId={groupId}
        filmId={filmId}
        profile={profile}
      />
    </>
  );
}

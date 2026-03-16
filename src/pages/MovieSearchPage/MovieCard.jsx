import { youtubeTrailer } from "../../modules/movieDatabaseHelpers";
import { director } from "../../modules/movieDatabaseHelpers";
import { fetchMovieDetails } from "../../modules/fetchers";
import { topThreeStars } from "../../modules/movieDatabaseHelpers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MovieCard.module.css";

export default function MovieCard({ user, movieID, watchlist, addFilm }) {
  const navigate = useNavigate();
  const [trailerIsVisible, setTrailerIsVisible] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);

  function handleMovieClick(movieID) {
    navigate(`/movies/${movieID}`);
  }

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await fetchMovieDetails(movieID);
        setMovieInfo(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    loadMovie();
  }, [movieID]);

  if (error) {
    return <p>Error loading movie.</p>;
  }

  if (!movieInfo) {
    return <p>Loading...</p>;
  }

  const title = movieInfo.title;
  const year = movieInfo.release_date.slice(0, 4);
  const description = movieInfo.description;
  const poster = `https://image.tmdb.org/t/p/w780/${movieInfo.backdrop_path ? movieInfo.backdrop_path : "ss4GSbqZy2xKumjWD48dU2cZQ31.jpg"}`;
  const stars = topThreeStars(movieInfo);
  const direct = director(movieInfo);
  const youtubeCode = youtubeTrailer(movieInfo);
  const filmForWatchlist = {
    id: movieID,
    title,
    poster: poster,
    year: year,
  };
  const isInWatchlist = watchlist.some((f) => f.id === String(movieID));

  return (
    <section className={styles.card}>
      <div
        className={styles.posterWrapper}
        onClick={() => handleMovieClick(movieID)}
      >
        <img className={styles.poster} src={poster} />
      </div>

      <section className={styles.info}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.year}>{year}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.trailerButton}
            onClick={() => setTrailerIsVisible(true)}
          >
            ▶ Trailer
          </button>
          {user && !isInWatchlist && (
            <button
              className={styles.watchlistButton}
              onClick={() => addFilm(filmForWatchlist)}
            >
              + Watchlist
            </button>
          )}
        </div>

        <p className={styles.description}>
          <strong>Director:</strong>
          {direct}
        </p>
        <p className={styles.description}>
          <strong>Starring:</strong> {stars}
        </p>
      </section>

      {trailerIsVisible && (
        <div
          className={styles.modal}
          onClick={() => setTrailerIsVisible(false)}
        >
          <iframe
            src={
              youtubeCode
                ? `https://www.youtube.com/embed/${youtubeCode}`
                : "https://www.youtube.com/embed/Aq5WXmQQooo"
            }
            allowFullScreen
          ></iframe>
        </div>
      )}
    </section>
  );
}

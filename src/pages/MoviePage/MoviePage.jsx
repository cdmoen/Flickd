import {
  youtubeTrailer,
  director,
  topThreeStars,
} from "../../modules/movieDatabaseHelpers";
import { fetchMovieDetails } from "../../modules/fetchers";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWatchlist } from "../../hooks/useWatchlist";
import styles from "./MoviePage.module.css";

export default function MoviePage() {
  const { user, logout } = useAuth();
  const { movieID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { watchlist, addFilm } = useWatchlist(user?.uid);

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMovieDetails(movieID);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [movieID]);

  if (loading) return <p className="loading">Loading movie...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!movie) return <p className="error">Movie not found.</p>;

  // Now that movie is loaded, compute helpers safely
  const direc = director(movie);
  const stars = topThreeStars(movie);
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
    : "/images/backdrop_placeholder.svg";
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
    : "/images/placeholder.svg";
  const year = movie.release_date.slice(0, 4);
  const youtubeCode = youtubeTrailer(movie);
  const filmForWatchlist = {
    id: movieID,
    title: movie.title,
    poster: poster,
    backdrop: backdrop,
    year: year,
  };
  const isInWatchlist = watchlist.some((f) => f.id === String(movieID));

  return (
    <div className="movie-container">
      <h1>{movie.title}</h1>
      {user && !isInWatchlist && (
        <button
          className={styles.watchlistButton}
          onClick={() => addFilm(filmForWatchlist)}
        >
          Add to My Watchlist
        </button>
      )}

      {user && isInWatchlist && (
        <p className={styles.alreadyAdded}>Already in your watchlist</p>
      )}

      <img
        className="movie-poster"
        src={poster}
        alt={`${movie.title} Poster`}
      />

      <div className="movie-info">
        <p className="movie-year">
          {movie.release_date.slice(0, 4)} •{" "}
          {movie.genres?.map((genre) => genre.name).join(", ")}
        </p>

        <p className="movie-description">{movie.overview}</p>

        <ul className="movie-details">
          <li>
            <strong>Director:</strong> {direc}
          </li>
          <li>
            <strong>Starring:</strong> {stars}
          </li>
          <li>
            <strong>Runtime:</strong> {movie.runtime}
          </li>
        </ul>
      </div>
    </div>
  );
}

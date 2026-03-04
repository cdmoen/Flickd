import { database } from "../firebase";
import { ref, set } from "firebase/database";
import { fetchMovieInfo } from "../fetchers";
import {
  director,
  topThreeStars,
  youtubeTrailer,
} from "../movieDatabaseHelpers";

export async function addFilmToGroup(groupId, uid, tmdbId) {
  let movie;

  // 1. Fetch metadata from TMDB
  try {
    movie = await fetchMovieInfo(tmdbId);
  } catch (err) {
    console.log("fetchMovieInfo from TMDB failed");
    return false;
  }
  // 2. Build the Firebase path
  // Using tmdbId as the filmId keeps things simple and avoids duplicates
  const filmRef = ref(database, `groups/${groupId}/films/${tmdbId}`);

  // Extract director, top three stars, and trailer link from movie object:

  const director = director(movie);
  const topThreeStars = topThreeStars(movie);
  const youtubeTrailer = youtubeTrailer(movie);

  // 3. Write the film object into Firebase
  await set(filmRef, {
    title: movie.title,
    tmdbId: movie.id,
    posterURL: `https://image.tmdb.org/t/p/w200/${movie.poster_path}`,
    addedBy: uid,
    genres: movie.genres.map((genre) => genre.name),
    overview: movie.overview,
    releaseDate: movie.release_date,
    runtime: movie.runtime,
    director: director || "no director info available",
    topThreeStars: topThreeStars || "no cast info available",
    youtubeTrailer: youtubeTrailer || "No trailer available",
    addedAt: Date.now(),
  });

  return true;
}

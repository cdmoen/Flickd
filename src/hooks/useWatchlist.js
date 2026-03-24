import { useEffect, useState } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { database } from "../modules/firebase";

/*
==============================
        USE WATCHLIST
==============================

Returns a user's watchlist and functions to add or remove films from it,
kept in sync with the Firebase Realtime Database.

Each user's watchlist is stored as a keyed object at:
  root/watchlists/$uid: { $filmId: { id, title, ... }, ... }

Film entries are keyed by their TMDB ID so that lookups and deletions
can target a specific film directly without scanning the whole list.

PARAMS:
  uid (string) - the current user's ID

RETURNS:
  watchlist  (array)     - the user's current watchlist as an array of film objects
  addFilm    (function)  - adds a film to the watchlist; film.id must be the TMDB ID
  removeFilm (function)  - removes a film from the watchlist by its TMDB ID

*/

export function useWatchlist(uid) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!uid) return;

    // Point to this user's watchlist in the database
    const watchlistRef = ref(database, `watchlists/${uid}`);

    // Subscribe to the watchlist and keep local state in sync with any changes.
    // onValue returns its own unsubscribe function, so we return it directly
    // for cleanup instead of wrapping it in an arrow function
    return onValue(watchlistRef, (snap) => {
      const data = snap.val();

      if (data) {
        // The snapshot is a keyed object of film entries — convert it to an array
        // and merge the Firebase key back in as each film's id field
        const films = Object.entries(data).map(([filmId, film]) => ({
          id: filmId,
          ...film,
        }));
        setWatchlist(films);
      } else {
        // No watchlist data exists yet for this user
        setWatchlist([]);
      }
    });
  }, [uid]);

  // Write the film to root/watchlists/$uid/$filmId.
  // Using set() means a re-add will cleanly overwrite any stale data
  async function addFilm(film) {
    // film.id MUST be the TMDB ID
    const filmRef = ref(database, `watchlists/${uid}/${film.id}`);
    await set(filmRef, film);
  }

  // Remove a single film from the watchlist by targeting its key directly
  async function removeFilm(filmId) {
    const filmRef = ref(database, `watchlists/${uid}/${filmId}`);
    await remove(filmRef);
  }

  return { watchlist, addFilm, removeFilm };
}

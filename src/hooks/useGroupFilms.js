import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../modules/firebase";

/*
==============================
       USE GROUP FILMS
==============================

Returns the full list of films for a given group, kept in sync with
the Firebase Realtime Database.

Group films are stored as a keyed object at:
  root/groups/$groupId/films: { $filmId: { title, ... }, ... }

Film entries are keyed by their TMDB ID so each film can be uniquely
identified when rendering or cross-referencing with a user's watchlist.

PARAMS:
  groupId (string) - the ID of the group whose film list is being watched

RETURNS:
  films (array) - the group's current film list as an array of film objects

*/

export function useGroupFilms(groupId) {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    // Point to the films nested under this specific group
    const filmsRef = ref(database, `groups/${groupId}/films`);

    // Subscribe to the film list and return onValue's unsubscribe function directly for cleanup
    return onValue(filmsRef, (snap) => {
      if (!snap.exists()) {
        setFilms([]);
        return;
      }

      const data = snap.val();

      // The snapshot is a keyed object of film entries — convert it to an array
      // and merge the Firebase key back in as each film's id field
      const list = Object.entries(data).map(([filmId, film]) => ({
        id: filmId,
        ...film,
      }));

      setFilms(list);
    });
  }, [groupId]);

  return films;
}

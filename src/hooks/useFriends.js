import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../modules/firebase";

/*
==============================
          USE FRIENDS
==============================

Returns all public profile objects for every friend a given user has,
kept in sync with the Firebase Realtime Database.

Friend relationships are stored as a flat lookup object at:
  root/friends/$uid: { $friendUid: true, ... }

Public profile data is stored separately at:
  root/usersPublic/$friendUid: { username, avatarUrl, ... }

This hook resolves friends in two stages: a live subscription watches the
user's friend list for any changes, then a separate effect fetches each
friend's public profile whenever that list updates.

PARAMS:
  uid (string) - the current user's ID

RETURNS:
  friends (array)   - public profile objects for each of the user's friends,
                      each shaped as { uid, username, avatarUrl, ...profile }
  loading (boolean) - true until the first fetch completes

*/

export function useFriends(uid) {
  const [friendIds, setFriendIds] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stage 1: Subscribe to the user's friend list and keep the local friendIds
  // array in sync — any additions or removals will trigger the fetch effect below
  useEffect(() => {
    if (!uid) return;

    const friendsRef = ref(database, `friends/${uid}`);

    const unsubscribe = onValue(friendsRef, (snapshot) => {
      // The snapshot is a flat { $friendUid: true } lookup — we only need the keys
      const data = snapshot.val() || {};
      setFriendIds(Object.keys(data));
    });

    return () => unsubscribe();
  }, [uid]);

  // Stage 2: Whenever friendIds changes, fetch each friend's public profile.
  // This runs sequentially rather than with Promise.all so that partial results
  // can still be collected if any individual fetch fails or returns no data
  useEffect(() => {
    async function fetchFriends() {
      // If the user has no friends, clear the state and bail early
      if (friendIds.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      const results = [];

      for (const friendUid of friendIds) {
        const snap = await get(ref(database, `usersPublic/${friendUid}`));

        if (snap.exists()) {
          const profile = snap.val();

          // Spread the full profile last so that explicit fields take
          // precedence, with fallbacks for any missing required properties
          results.push({
            uid: friendUid,
            username: profile.username || "Unknown User",
            avatarUrl: profile.avatarUrl || null,
            ...profile,
          });
        }
      }

      setFriends(results);
      setLoading(false);
    }

    fetchFriends();
  }, [friendIds]);

  return { friends, loading };
}

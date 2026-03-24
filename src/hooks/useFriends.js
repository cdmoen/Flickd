import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../modules/firebase";

/*
 
_______useFriends(uid)_______
 
  Loads the user's friends list in two steps:
  1. Subscribes to friends/{uid} to get the list of friend UIDs.
  2. Fetches each friend's public profile from usersPublic/{friendUid}.
 
  Returns a loading boolean and an array of friend objects.
    
  Example friend array:
        [
          { uid, username, avatarUrl, ... }, 
          { uid, username, avatarUrl, ...}
        ]
  
 */

export function useFriends(uid) {
  const [friendIds, setFriendIds] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const friendsRef = ref(database, `friends/${uid}`);

    const unsubscribe = onValue(friendsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setFriendIds(Object.keys(data));
    });

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    async function fetchFriends() {
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

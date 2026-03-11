import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../modules/firebase";

export function useUserGroups(uid) {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const userGroupsRef = ref(database, `users/${uid}/groups`);

    const unsub = onValue(userGroupsRef, async (snap) => {
      const data = snap.val() || {};
      const ids = Object.keys(data);

      if (ids.length === 0) {
        setUserGroups([]);
        setLoading(false);
        return;
      }

      const snaps = await Promise.all(
        ids.map((id) => get(ref(database, `groups/${id}`))),
      );

      const results = snaps
        .filter((s) => s.exists())
        .map((s, i) => ({ id: ids[i], ...s.val() }));

      setUserGroups(results);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  return { userGroups, loading };
}

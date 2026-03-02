import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase";

export function useUserGroups(uid) {
  const [groupIds, setGroupIds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load group IDs
  useEffect(() => {
    // do nothing if the user is not logged in
    if (!uid) return;

    // create a reference to the user's groups inside the realtime database
    const userGroupsRef = ref(database, `users/${uid}/groups`);

    // A listener function for the values inside users/:uid/groups
    const unsubscribe = onValue(userGroupsRef, (snapshot) => {
      // data is an object
      const data = snapshot.val() || {};
      // set GroupIds to be an object containing just the ID's of all the groups
      setGroupIds(Object.keys(data));
    });

    // clean up
    return () => unsubscribe();
  }, [uid]);

  // Load group metadata
  useEffect(() => {
    async function fetchGroups() {
      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const results = [];
      for (const id of groupIds) {
        const snap = await get(ref(database, `groups/${id}`));
        if (snap.exists()) results.push(snap.val());
      }

      setGroups(results);
      setLoading(false);
    }

    fetchGroups();
  }, [groupIds]);

  return { groups, loading };
}

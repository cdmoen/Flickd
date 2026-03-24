import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../modules/firebase";

/*
==============================
      USE USER GROUPS
==============================

Returns all full group objects for every group a given user belongs to,
kept in sync with the Firebase Realtime Database.

The user's group memberships are stored as a flat lookup object at:
  root/users/$uid/groups: { groupId1: true, groupId2: true, ... }

Full group data is stored separately at:
  root/groups/$groupId: { name, members, ... }

This hook bridges those two locations: it watches the user's membership
list for changes, then fetches the full group record for each membership
and returns them as an array.

PARAMS:
  uid (string) - the current user's ID

RETURNS:
  userGroups (array) - the full group objects the user belongs to
  loading (boolean)  - true until the first fetch completes

*/

export function useUserGroups(uid) {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    // Point to the groups this user belongs to
    const userGroupsRef = ref(database, `users/${uid}/groups`);

    // Create a listener at this same location
    const unsub = onValue(userGroupsRef, async (snap) => {
      // The snapshot value is a flat object of { groupId: true } pairs,
      // or null if the user belongs to no groups
      const data = snap.val() || {};

      // Extract just the group IDs
      const ids = Object.keys(data);

      // If the user has no group memberships, short-circuit and return early
      if (ids.length === 0) {
        setUserGroups([]);
        setLoading(false);
        return;
      }

      // Using the group ID's relevant to this specific user, we can now fetch
      // the complete information about each group from root/groups
      // We use Promise.all to generate all async promises at once and wait for them all to resolve before continuing on.
      const snaps = await Promise.all(
        ids.map((id) => get(ref(database, `groups/${id}`))),
      );

      // Filter out any group IDs that no longer have a corresponding record
      // in root/groups (e.g. a group that was deleted), then unwrap each
      // snapshot into a plain object
      const results = snaps
        .filter((s) => s.exists())
        .map((s) => ({ ...s.val() }));

      // Update the state using our group object
      setUserGroups(results);
      setLoading(false);
    });

    // Unsubscribe the firebase listener when the component unmounts or uid changes
    return () => unsub();
  }, [uid]);

  return { userGroups, loading };
}

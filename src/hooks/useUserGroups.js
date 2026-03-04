import { useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase";

/**
 * useUserGroups(uid)
 *
 * A custom hook that:
 * 1. Subscribes to the list of group IDs the user belongs to
 *    (stored under users/{uid}/groups)
 * 2. Fetches metadata for each group (stored under groups/{groupId})
 * 3. Returns a list of fully-loaded group objects + a loading flag
 *
 * This hook does NOT determine whether the user is a member —
 * that logic is handled by the database structure and helpers.
 */
export function useUserGroups(uid) {
  // Holds the list of group IDs the user belongs to
  const [groupIds, setGroupIds] = useState([]);

  // Holds the full group objects (name, members, owner, etc.)
  const [groups, setGroups] = useState([]);

  // Indicates whether the hook is still loading data
  const [loading, setLoading] = useState(true);

  /**
   * STEP 1 — Subscribe to the user's group ID list
   *
   * The path users/{uid}/groups looks like:
   * {
   *   "group123": true,
   *   "group456": true
   * }
   *
   * We only need the keys, not the values.
   */

  useEffect(() => {
    // If the user isn't logged in yet, do nothing.
    if (!uid) return;

    // Reference to the user's group membership list
    const userGroupsRef = ref(database, `users/${uid}/groups`);

    // Subscribe to changes in the user's group list
    const unsubscribe = onValue(userGroupsRef, (snapshot) => {
      // snapshot.val() returns an object or null
      const data = snapshot.val() || {};

      // Convert the object keys into an array of group IDs
      setGroupIds(Object.keys(data));
    });

    // Cleanup subscription when uid changes or component unmounts
    return () => unsubscribe();
  }, [uid]);

  /**
   * STEP 2 — Fetch metadata for each group ID
   *
   * For each groupId, we load:
   * groups/{groupId}
   *
   * A group object looks like:
   * {
   *   id: "group123",
   *   name: "My Group",
   *   owner: "uid123",
   *   members: { uid123: true, uid456: true },
   *   createdAt: 123456789
   * }
   *
   * We normalize `members` to always be an object so the UI
   * never crashes due to undefined/null.
   */
  useEffect(() => {
    async function fetchGroups() {
      // If the user belongs to no groups, clear and stop loading
      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const results = [];

      // Fetch each group individually
      for (const id of groupIds) {
        const snap = await get(ref(database, `groups/${id}`));

        if (snap.exists()) {
          const group = snap.val();

          // Normalize members so UI always receives a safe object
          results.push({
            ...group,
            members: group.members || {},
          });
        }
      }

      // Store the fully-loaded group objects
      setGroups(results);

      // Mark loading as complete
      setLoading(false);
    }

    fetchGroups();
  }, [groupIds]);

  /**
   * Return the final data structure:
   * - groups: array of group objects
   * - loading: boolean
   */
  return { groups, loading };
}

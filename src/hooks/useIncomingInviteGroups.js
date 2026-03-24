import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../modules/firebase";

/*
==============================
  USE INCOMING INVITE GROUPS
==============================

Given a user's incoming invites, resolves and returns the full group object
for each invite, keyed by group ID.

Incoming invites are stored as a keyed object at:
  root/users/$uid/incomingInvites: { $inviteId: { groupId, ... }, ... }

Full group data is stored separately at:
  root/groups/$groupId: { name, members, ... }

This hook bridges those two locations: it reads the groupId from each invite
entry, fetches the corresponding group record, and returns them as a lookup
object so invite UI can display group details without an extra fetch.

PARAMS:
  incomingInvites (object) - the user's raw incomingInvites object from the database

RETURNS:
  inviteGroups (object) - a lookup of { $groupId: groupObject } for each invite

*/

export function useIncomingInviteGroups(incomingInvites) {
  const [inviteGroups, setInviteGroups] = useState({});

  // Derive the entries array outside the effect so it can be used
  // both as the data source and as the effect dependency
  const inviteEntries = Object.entries(incomingInvites);

  useEffect(() => {
    async function load() {
      // If there are no pending invites, clear the state and bail early
      if (inviteEntries.length === 0) {
        setInviteGroups({});
        return;
      }

      const results = {};

      // Fetch each group record in parallel, then populate the results
      // lookup object with any group IDs that still have a valid record
      await Promise.all(
        inviteEntries.map(async ([inviteId, inviteData]) => {
          const groupId = inviteData.groupId;
          const snap = await get(ref(database, `groups/${groupId}`));
          if (snap.exists()) {
            results[groupId] = snap.val();
          }
        }),
      );

      setInviteGroups(results);
    }

    load();
  }, [incomingInvites]);

  return inviteGroups;
}

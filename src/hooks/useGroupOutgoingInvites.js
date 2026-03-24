import { ref, onValue } from "firebase/database";
import { database } from "../modules/firebase";
import { useEffect, useState } from "react";

/*
==============================
  USE GROUP OUTGOING INVITES
==============================

Returns a live list of friend UIDs that the current user has already invited
to a specific group, kept in sync with the Firebase Realtime Database.

Outgoing group invites are stored at:
  root/groupInvitesOutgoing/$uid/$groupId: { $friendUid: true, ... }

This hook is primarily used to track pending invite state so that UI
elements (e.g. invite buttons) can reflect whether a friend has already
been invited to the group.

PARAMS:
  uid     (string) - the current user's ID
  groupId (string) - the ID of the group whose outgoing invites are being watched

RETURNS:
  invited (array) - UIDs of friends who have already been invited to this group

*/

export function useGroupOutgoingInvites(uid, groupId) {
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    if (!uid || !groupId) return;

    // Point to the outgoing invites for this specific user + group combination
    const invitesRef = ref(database, `groupInvitesOutgoing/${uid}/${groupId}`);

    // Subscribe to the invite list and return onValue's unsubscribe function directly for cleanup
    return onValue(invitesRef, (snap) => {
      if (!snap.exists()) {
        setInvited([]);
      } else {
        // The snapshot is a flat { $friendUid: true } lookup — we only need the keys
        setInvited(Object.keys(snap.val()));
      }
    });
  }, [uid, groupId]);

  return invited;
}

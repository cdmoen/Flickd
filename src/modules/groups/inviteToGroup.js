import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function inviteToGroup(groupId, fromUid, toUid) {
  if (!groupId || !fromUid || !toUid) {
    throw new Error("Invalid arguments for inviteToGroup");
  }

  const updates = {};

  // Create Outgoing invite: you -> them
  updates[`groupInvitesOutgoing/${fromUid}/${groupId}/${toUid}`] = true;

  // Create Incoming invite: them <- you
  updates[`groupInvitesIncoming/${toUid}/${groupId}`] = {
    from: fromUid,
    groupId: groupId,
    timestamp: Date.now(),
  };

  await update(ref(database), updates);
}

import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function cancelFriendRequest(myUid, otherUid) {
  if (!myUid || !otherUid) {
    throw new Error("Invalid UIDs for canceling friend request");
  }

  const updates = {};

  // Remove the outgoing request
  updates[`friendRequestsOutgoing/${myUid}/${otherUid}`] = null;

  // Remove the incoming request
  updates[`friendRequestsIncoming/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

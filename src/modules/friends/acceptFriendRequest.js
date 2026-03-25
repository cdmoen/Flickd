import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function acceptFriendRequest(myUid, otherUid) {
  const updates = {};

  // add the other user's uid to your 'friends' node
  updates[`friends/${myUid}/${otherUid}`] = true;

  // add your uid to the other user's 'friends' node
  updates[`friends/${otherUid}/${myUid}`] = true;

  // clear the 'incoming' request
  updates[`friendRequestsIncoming/${myUid}/${otherUid}`] = null;

  // clear the 'outgoing' request
  updates[`friendRequestsOutgoing/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

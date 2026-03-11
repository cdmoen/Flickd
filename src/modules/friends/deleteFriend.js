import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function deleteFriend(myUid, otherUid) {
  if (!myUid || !otherUid) {
    throw new Error("Invalid UIDs for deleting friend");
  }

  const updates = {};

  // Remove each side of the mutual friendship
  updates[`friends/${myUid}/${otherUid}`] = null;
  updates[`friends/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

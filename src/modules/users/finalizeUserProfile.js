import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function finalizeUserProfile(uid, username, email) {
  const createdAt = Date.now();

  const updates = {};

  // Private profile
  updates[`users/${uid}`] = {
    email,
    username,
    avatarUrl: null,
    createdAt,
  };

  // Public profile
  updates[`usersPublic/${uid}`] = {
    username,
    avatarUrl: null,
  };

  // Username index
  updates[`usersByUsername/${username}`] = uid;

  await update(ref(database), updates);
}

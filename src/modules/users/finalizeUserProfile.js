import { database } from "../firebase";
import { ref, update } from "firebase/database";

export async function finalizeUserProfile(uid, username, email) {
  const createdAt = Date.now();

  const updates = {};

  // Create the user's private profile
  updates[`users/${uid}`] = {
    email,
    username,
    avatarUrl: "/avatars/popcorn.png",
    createdAt,
  };

  // Create the user's public profile
  updates[`usersPublic/${uid}`] = {
    username,
    avatarUrl: "/avatars/popcorn.png",
  };

  // Update the username index with the new user's username + uid so
  // that nobody else can use the same username in the future
  updates[`usersByUsername/${username}`] = uid;

  await update(ref(database), updates);
}

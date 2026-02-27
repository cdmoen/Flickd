// firebaseHelpers.js
import { database } from "../firebase";
import { ref, runTransaction, update } from "firebase/database";

// Check if a username is available
async function reserveUsername(username) {
  const usernameRef = ref(database, `usernames/${username}`);

  const result = await runTransaction(usernameRef, (currentValue) => {
    if (currentValue === null) {
      return "TEMP"; // reserve the username
    }
    return; // abort if taken
  });

  if (!result.committed) {
    throw new Error("Username already taken");
  }
}

// Create a user profile inside the realtime database
async function finalizeUserProfile(uid, username, email) {
  const updates = {};

  updates[`usernames/${username}`] = uid;
  updates[`users/${uid}`] = {
    email,
    username,
    createdAt: Date.now(),
    avatarUrl: null,
    friends: {},
    groups: {},
  };

  await update(ref(database), updates);
}

export { reserveUsername, finalizeUserProfile };

// Create a new group
async function createGroup(uid, groupName) {
  const groupsRef = ref(database, "groups");

  const newGroupRef = push(groupsRef);

  // Optional: get the generated ID
  const groupID = newGroupRef.key;

  // Write the group data
  await set(newGroupRef, {
    id: groupID,
    name: groupName,
    owner: uid,
    createdAt: Date.now(),
  });

  await set(ref(database, `users/${uid}/groups/${groupId}`), true);

  return groupID;
}

export { createGroup };

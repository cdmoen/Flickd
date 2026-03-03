import { database } from "../firebase";
import {
  ref,
  runTransaction,
  update,
  push,
  set,
  remove,
} from "firebase/database";

/* ============================
   USER REGISTRATION HELPERS
   ============================ */

// _______RESERVE USERNAME_______

export async function reserveUsername(username) {
  const usernameRef = ref(database, `usersByUsername/${username}`);

  const result = await runTransaction(usernameRef, (currentValue) => {
    if (currentValue === null) {
      return "TEMP"; // temporarily reserve
    }
    return; // abort if taken
  });

  if (!result.committed) {
    throw new Error("Username already taken");
  }
}

// _______FINALIZE USER PROFILE_______

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

/* ============================
   GROUP HELPERS
   ============================ */

// _______ DELETE GROUP _______
export async function deleteGroup(groupId, uid) {
  if (!groupId || !uid) throw new Error("Missing groupId or uid");

  try {
    await remove(ref(database, `groups/${groupId}`));
    await remove(ref(database, `users/${uid}/groups/${groupId}`));
    return true;
  } catch (err) {
    console.error("Error deleting group:", err);
    throw err;
  }
}

// _______ CREATE GROUP _______
export async function createGroup(uid, groupName) {
  try {
    const groupsRef = ref(database, "groups");
    const newGroupRef = push(groupsRef);
    const groupID = newGroupRef.key;

    await set(newGroupRef, {
      id: groupID,
      name: groupName,
      owner: uid,
      members: [uid],
      createdAt: Date.now(),
    });

    await set(ref(database, `users/${uid}/groups/${groupID}`), true);
    return groupID;
  } catch (err) {
    console.error("Error creating group:", err);
    throw err;
  }
}

// _______ INVITE TO GROUP _______ (unfinished)
export function inviteToGroup(groupId) {
  console.log("Invite friend to group:", groupId);
}

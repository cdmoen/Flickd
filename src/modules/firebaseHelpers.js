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

/* ============================
   FRIEND HELPERS
   ============================ */

// _______ SEND FRIEND REQUEST  _______

export async function sendFriendRequest(myUid, theirUid) {
  if (!myUid || !theirUid) {
    throw new Error("Invalid UIDs for friend request");
  }
  if (myUid === theirUid) {
    throw new Error("You cannot friend yourself");
  }

  const updates = {};

  // You → Them (outgoing)
  updates[`friendRequestsOutgoing/${myUid}/${theirUid}`] = true;

  // Them → You (incoming)
  updates[`friendRequestsIncoming/${theirUid}/${myUid}`] = true;

  await update(ref(database), updates);
}

// _______ ACCEPT FRIEND REQUEST  _______

export async function acceptFriendRequest(myUid, otherUid) {
  const updates = {};

  // add the new friend's uid to your friends node
  updates[`friends/${myUid}/${otherUid}`] = true;

  // add your uid to the new friend's friends node
  updates[`friends/${otherUid}/${myUid}`] = true;

  // clear the 'incoming' request node from friend's account
  updates[`friendRequestsIncoming/${myUid}/${otherUid}`] = null;

  // clear the 'outgoing' request node from your account
  updates[`friendRequestsOutgoing/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

// _______ REJECT FRIEND REQUEST  _______

export async function rejectFriendRequest(myUid, otherUid) {
  const updates = {};

  // Remove the 'incoming' request from your user account
  updates[`friendRequestsIncoming/${myUid}/${otherUid}`] = null;

  // remove the 'outgoing' request from the other user's account
  updates[`friendRequestsOutgoing/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

// _______ CANCEL FRIEND REQUEST _______

export async function cancelFriendRequest(myUid, otherUid) {
  if (!myUid || !otherUid) {
    throw new Error("Invalid UIDs for canceling friend request");
  }

  const updates = {};

  // Remove your outgoing request
  updates[`friendRequestsOutgoing/${myUid}/${otherUid}`] = null;

  // Remove their incoming request
  updates[`friendRequestsIncoming/${otherUid}/${myUid}`] = null;

  await update(ref(database), updates);
}

// _______ DELETE FRIEND _______

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

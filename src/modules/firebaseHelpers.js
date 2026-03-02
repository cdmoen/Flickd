// firebaseHelpers.js
import { database } from "../firebase";
import {
  ref,
  runTransaction,
  update,
  push,
  set,
  remove,
} from "firebase/database";

//########## INCOMPLETE FUNCTIONS #################
// function to invite a friend to a group
export function inviteToGroup(groupId) {
  // open modal, send notification, etc.
  console.log("Invite friend to group:", groupId);
}

// ##############################################################

// Delete group and remove the user's membership pointer.
// @param {string} groupId - The ID of the group to delete.
// @param {string} uid - The ID of the user performing the deletion.
export async function deleteGroup(groupId, uid) {
  if (!groupId || !uid) {
    throw new Error("Missing groupId or uid");
  }

  try {
    // Remove the group object
    await remove(ref(database, `groups/${groupId}`));

    // Remove the membership pointer for the user
    await remove(ref(database, `users/${uid}/groups/${groupId}`));

    // OPTIONAL: If you later add collaborators or group lists,
    // you can remove those here as well.
    // await remove(ref(database, `groupCollaborators/${groupId}`));
    // await remove(ref(database, `groupLists/${groupId}`));

    return true;
  } catch (err) {
    console.error("Error deleting group:", err);
    throw err;
  }
}

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
  try {
    // reference the /groups path
    const groupsRef = ref(database, "groups");

    // create a new unique key inside the /groups path
    const newGroupRef = push(groupsRef);

    // Save the generated key to use below
    const groupID = newGroupRef.key;

    // Write the group data inside the new group that exists in /groups/:groupID
    await set(newGroupRef, {
      id: groupID,
      name: groupName,
      owner: uid,
      members: [uid],
      createdAt: Date.now(),
    });

    /* 
    Link the group to the creator's profile by creating a reference at /users/:uid/groups/:groupID
     The data inside /users/:uid/groups will look like this:
     {
       [groupID]: true,
       [groupID]: true
     }*/
    await set(ref(database, `users/${uid}/groups/${groupID}`), true);
    return groupID;
  } catch (err) {
    console.error("Error creating group:", err);
    throw err;
  }
}

export { createGroup };

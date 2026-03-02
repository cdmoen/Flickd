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
      createdAt: Date.now(),
    });

    /* 
    Link the group to the creator's profile by creating a reference at /users/:uid/groups/:groupID
     The data inside /users/:uid/groups will look like this:
     {
       [groupID]: true,
       [groupID]: true
     }*/
    await set(ref(database, `users/${uid}/groups/${groupId}`), true);
    return groupID;
  } catch (err) {
    console.error("Error creating group:", err);
    throw err;
  }
}

export { createGroup };

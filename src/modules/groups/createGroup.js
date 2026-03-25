import { database } from "../firebase";
import { ref, push, set } from "firebase/database";

export async function createGroup(uid, groupName) {
  try {
    // Point to the 'groups' node in firebase
    const groupsRef = ref(database, "groups");

    // Create new group inside of 'groups' with a unique ID
    const newGroupRef = push(groupsRef);

    // Save the new group's ID so we can use it later
    const groupID = newGroupRef.key;

    // create the group object in Firebase
    await set(newGroupRef, {
      id: groupID,
      name: groupName,
      createdBy: uid,
      members: {
        [uid]: true,
      },
      createdAt: Date.now(),
    });

    // Add the user who created the group to the group's membership list
    await set(ref(database, `users/${uid}/groups/${groupID}`), true);

    return groupID;
  } catch (err) {
    console.error("Error creating group:", err);
    throw err;
  }
}

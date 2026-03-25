import { database } from "../firebase";
import { ref, runTransaction } from "firebase/database";

export async function reserveUsername(username) {
  // Point to the desired username inside the publicly-viewable list of
  // existing usernames to see if it is already in use by someone else
  const usernameRef = ref(database, `usersByUsername/${username}`);

  const result = await runTransaction(usernameRef, (currentValue) => {
    // If username does not already exist, it is available for use.
    if (currentValue === null) {
      return "TEMP"; // temporarily mark the node as 'TEMP' to reserve the username
    }
    return; // abort if the username is already taken or reserved as 'TEMP' by someone else
  });

  // If 'TEMP' was not written by runTransaction, then the username was not available,
  // so we throw an error
  if (!result.committed) {
    throw new Error("Username already taken");
  }
}

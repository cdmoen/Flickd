import { database } from "../firebase";
import { ref, remove } from "firebase/database";

export async function removeFilmFromGroup(groupId, tmdbId) {
  try {
    // Point to the film inside the group/films node
    const filmRef = ref(database, `groups/${groupId}/films/${tmdbId}`);
    // Remove the film
    await remove(filmRef);
    return true;
  } catch (err) {
    console.log("removeFilmFromGroup failed:", err);
    return false;
  }
}

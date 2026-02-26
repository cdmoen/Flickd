import { database } from "../firebase";
import { ref, set } from "firebase/database";

function writeUserData(userId, userName, userAge) {
  set(ref(database, `users/${userId}`), {
    name: userName,
    age: userAge,
  });
}

export { writeUserData };

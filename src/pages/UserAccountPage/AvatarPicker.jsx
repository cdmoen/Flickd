import { ref, set } from "firebase/database";
import { database } from "../../modules/firebase";
import styles from "./AvatarPicker.module.css";

const avatarList = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
  "/avatars/avatar11.png",
  "/avatars/avatar12.png",
];

export default function AvatarPicker({ uid, onClose }) {
  function chooseAvatar(url) {
    const userRef = ref(database, `users/${uid}/avatarUrl`);
    set(userRef, url);
    onClose();
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Choose an Avatar</h2>
        </div>

        <div className={styles.grid}>
          {avatarList.map((url) => (
            <img
              key={url}
              src={url}
              className={styles.avatar}
              onClick={() => chooseAvatar(url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

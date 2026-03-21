import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./NavGroups.module.css";

export default function NavGroups() {
  const { user } = useAuth();
  const [hasInvites, setHasInvites] = useState(false);

  useEffect(() => {
    if (!user) return;

    const inviteRef = ref(database, `groupInvitesIncoming/${user.uid}`);

    const unsubscribe = onValue(inviteRef, (snap) => {
      const data = snap.val();

      setHasInvites(data && Object.keys(data).length > 0);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <NavLink
      to="/groups"
      className={({ isActive }) =>
        `${styles.groupsButton} 
         ${hasInvites ? styles.pending : ""} 
         ${isActive ? styles.active : ""}`
      }
    >
      {/* Groups icon with both image and text for multiple screen sizes
          Smaller is icon only, Larger is icon and text */}
      <img
        src="/images/roll.png"
        alt="Link to Groups Page"
        title="Groups"
        className={styles.groupsIcon}
      />
      <span className={styles.linkText}>Groups</span>
      {hasInvites && <span className={styles.badge}></span>}
    </NavLink>
  );
}

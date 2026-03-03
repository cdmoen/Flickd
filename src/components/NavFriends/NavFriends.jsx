import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./NavFriends.module.css";

export default function NavFriends() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRequests, setHasRequests] = useState(false);

  useEffect(() => {
    if (!user) return;

    const reqRef = ref(database, `friendRequestsIncoming/${user.uid}`);

    const unsubscribe = onValue(reqRef, (snap) => {
      const data = snap.val();
      setHasRequests(data && Object.keys(data).length > 0);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <button
      className={`${styles.friendsButton} ${hasRequests ? styles.pending : ""}`}
      onClick={() => navigate("/friends")}
    >
      Friends
      {hasRequests && <span className={styles.badge}></span>}
    </button>
  );
}

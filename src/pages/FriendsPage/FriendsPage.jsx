import { useState, useEffect } from "react";
import { ref, onValue, get, set } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../modules/firebase";
import { createPortal } from "react-dom";
import SearchUsers from "./SearchUsers";
import { sendFriendRequest } from "../../modules/friends/sendFriendRequest";
import { acceptFriendRequest } from "../../modules/friends/acceptFriendRequest";
import { rejectFriendRequest } from "../../modules/friends/rejectFriendRequest";
import { cancelFriendRequest } from "../../modules/friends/cancelFriendRequest";
import { deleteFriend } from "../../modules/friends/deleteFriend";
import styles from "./FriendsPage.module.css";

export default function FriendsPage() {
  const { user, logout } = useAuth();
  const uid = user?.uid;

  const [friends, setFriends] = useState({});
  const [incoming, setIncoming] = useState({});
  const [outgoing, setOutgoing] = useState({});
  const [usernames, setUsernames] = useState({});
  const [searchFormActive, setSearchFormActive] = useState(false);

  async function getUsername(otherUid) {
    if (!otherUid) return "(unknown)";
    if (usernames[otherUid]) return usernames[otherUid];
    const snap = await get(ref(database, `usersPublic/${otherUid}`));
    const username = snap.exists() ? snap.val().username : "(unknown)";
    setUsernames((prev) => ({ ...prev, [otherUid]: username }));
    return username;
  }

  useEffect(() => {
    Object.keys(friends).forEach(getUsername);
    Object.keys(incoming).forEach(getUsername);
    Object.keys(outgoing).forEach(getUsername);
  }, [friends, incoming, outgoing]);

  useEffect(() => {
    if (!uid) return;

    const unsubFriends = onValue(ref(database, `friends/${uid}`), (snap) =>
      setFriends(snap.val() || {}),
    );
    const unsubIncoming = onValue(
      ref(database, `friendRequestsIncoming/${uid}`),
      (snap) => setIncoming(snap.val() || {}),
    );
    const unsubOutgoing = onValue(
      ref(database, `friendRequestsOutgoing/${uid}`),
      (snap) => setOutgoing(snap.val() || {}),
    );

    return () => {
      unsubFriends();
      unsubIncoming();
      unsubOutgoing();
    };
  }, [uid]);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Friends</h2>

        {Object.keys(friends).length === 0 ? (
          <p className={styles.empty}>No friends yet.</p>
        ) : (
          <ul className={styles.list}>
            {Object.keys(friends).map((friendUid) => (
              <li key={friendUid} className={styles.listItem}>
                <span className={styles.username}>
                  {usernames[friendUid] || "Loading..."}
                </span>
                <button
                  className={styles.rejectButton}
                  onClick={() => deleteFriend(uid, friendUid)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>Find a Friend</h2>
        <button
          className={styles.rejectButton}
          onClick={() => {
            setSearchFormActive(true);
          }}
        >
          Search
        </button>
      </div>

      <div className={styles.topRow}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Incoming Requests</h2>
          {Object.keys(incoming).length === 0 ? (
            <p className={styles.empty}>No incoming requests.</p>
          ) : (
            <ul className={styles.list}>
              {Object.keys(incoming).map((otherUid) => (
                <li key={otherUid} className={styles.listItem}>
                  <span className={styles.username}>
                    {usernames[otherUid] || "Loading..."}
                  </span>
                  <div className={styles.buttonRow}>
                    <button
                      className={styles.acceptButton}
                      onClick={() => acceptFriendRequest(uid, otherUid)}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => rejectFriendRequest(uid, otherUid)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Outgoing Requests</h2>
          {Object.keys(outgoing).length === 0 ? (
            <p className={styles.empty}>No outgoing requests.</p>
          ) : (
            <ul className={styles.list}>
              {Object.keys(outgoing).map((otherUid) => (
                <li key={otherUid} className={styles.listItem}>
                  <span className={styles.username}>
                    {usernames[otherUid] || "Loading..."}
                  </span>
                  <button
                    className={styles.rejectButton}
                    onClick={() => cancelFriendRequest(uid, otherUid)}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {searchFormActive &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            onClick={() => setSearchFormActive(false)}
          >
            <div
              className={styles.modalSheet}
              onClick={(e) => e.stopPropagation()}
            >
              <SearchUsers
                searchFormActive={searchFormActive}
                setSearchFormActive={setSearchFormActive}
                uid={uid}
                friends={friends}
                incoming={incoming}
                outgoing={outgoing}
                onSendRequest={(otherUid) => sendFriendRequest(uid, otherUid)}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

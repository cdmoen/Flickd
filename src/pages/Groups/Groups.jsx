import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";
import { useUserGroups } from "../../hooks/useUserGroups";
import { useFriends } from "../../hooks/useFriends";
import { useGroupOutgoingInvites } from "../../hooks/useGroupOutgoingInvites";
import {
  deleteGroup,
  acceptGroupInvite,
  rejectGroupInvite,
  cancelGroupInvite,
} from "../../modules/firebaseHelpers";

import GroupCard from "../../components/GroupCard/GroupCard";
import CreateGroup from "../../components/CreateGroup/CreateGroup";
import FriendPickerSheet from "../../components/FriendPickerSheet/FriendPickerSheet"; // NEW COMPONENT

import styles from "./Groups.module.css";

export default function Groups() {
  const { user } = useAuth();
  const uid = user?.uid;

  // Load groups the user belongs to
  const { groups, loading } = useUserGroups(uid);

  // Load the user's friends for the bottom sheet
  const { friends } = useFriends(uid);

  // Invite state
  const [incomingInvites, setIncomingInvites] = useState({});
  const [outgoingInvites, setOutgoingInvites] = useState({});

  // Bottom sheet state
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Create group form toggle
  const [showForm, setShowForm] = useState(false);

  // Retrieve list of friends who have already been invited to a selected group
  const invited = useGroupOutgoingInvites(uid, selectedGroupId);

  // Filter out the already-invited friends to only display friends who could still be invited to a group
  const filteredFriends = friends.filter((f) => !invited.includes(f.uid));

  // ---------------------------------------------------------
  // SUBSCRIPTIONS FOR INCOMING + OUTGOING GROUP INVITES
  // ---------------------------------------------------------
  useEffect(() => {
    if (!uid) return;

    const incomingRef = ref(database, `groupInvitesIncoming/${uid}`);
    const outgoingRef = ref(database, `groupInvitesOutgoing/${uid}`);

    const unsubIncoming = onValue(incomingRef, (snap) =>
      setIncomingInvites(snap.val() || {}),
    );

    const unsubOutgoing = onValue(outgoingRef, (snap) =>
      setOutgoingInvites(snap.val() || {}),
    );

    return () => {
      unsubIncoming();
      unsubOutgoing();
    };
  }, [uid]);

  // ---------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------

  function handleDelete(group) {
    deleteGroup(group.id, uid);
  }

  // Open the bottom sheet and store which group is being invited to
  function handleInvite(group) {
    setSelectedGroupId(group.id);
    setIsPickerOpen(true);
  }

  // Close the friend picker sheet
  function onClose() {
    setIsPickerOpen(false);
    setSelectedGroupId(null);
  }

  return (
    <div className={styles.container}>
      <h1>Your Groups</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className={styles.createButton}
      >
        {showForm ? "Cancel" : "Create a New Group"}
      </button>

      {showForm && (
        <div className={styles.formWrapper}>
          <CreateGroup />
        </div>
      )}

      {/* ---------------------------------------------------------
         YOUR GROUPS
      --------------------------------------------------------- */}
      <h2 className={styles.sectionTitle}>Your Groups</h2>

      {loading && <p>Loading groups...</p>}

      {!loading && groups.length === 0 && (
        <p className={styles.empty}>You don't belong to any groups yet.</p>
      )}

      {!loading &&
        groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onDelete={handleDelete}
            onInvite={handleInvite} // opens bottom sheet
          />
        ))}

      {/* ---------------------------------------------------------
         INCOMING INVITES
      --------------------------------------------------------- */}
      <h2 className={styles.sectionTitle}>Group Invites</h2>

      {Object.keys(incomingInvites).length === 0 ? (
        <p className={styles.empty}>No group invites.</p>
      ) : (
        <ul className={styles.list}>
          {Object.keys(incomingInvites).map((groupId) => {
            const groupName =
              groups.find((g) => g.id === groupId)?.name || groupId;

            return (
              <li key={groupId} className={styles.listItem}>
                <span className={styles.groupName}>{groupName}</span>

                <div className={styles.buttonRow}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => acceptGroupInvite(uid, groupId)}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => rejectGroupInvite(uid, groupId)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* ---------------------------------------------------------
         OUTGOING INVITES
      --------------------------------------------------------- */}
      <h2 className={styles.sectionTitle}>Pending Invitations</h2>

      {Object.keys(outgoingInvites).length === 0 ? (
        <p className={styles.empty}>No pending invites.</p>
      ) : (
        <ul className={styles.list}>
          {Object.entries(outgoingInvites).map(([groupId, invitedUsers]) => {
            const groupName =
              groups.find((g) => g.id === groupId)?.name || groupId;

            return Object.keys(invitedUsers).map((friendUid) => (
              <li key={`${groupId}-${friendUid}`} className={styles.listItem}>
                <span className={styles.groupName}>
                  {groupName} → {friendUid}
                </span>

                <button
                  className={styles.rejectButton}
                  onClick={() => cancelGroupInvite(uid, groupId, friendUid)}
                >
                  Cancel
                </button>
              </li>
            ));
          })}
        </ul>
      )}

      {/* ---------------------------------------------------------
         FRIEND PICKER BOTTOM SHEET
      --------------------------------------------------------- */}
      <FriendPickerSheet
        isOpen={isPickerOpen}
        onClose={onClose}
        groupId={selectedGroupId}
        uid={uid}
        friends={filteredFriends}
      />
    </div>
  );
}

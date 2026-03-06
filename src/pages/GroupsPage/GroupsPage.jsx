import { useState, useEffect, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../modules/firebase";

import { useUserGroups } from "../../hooks/useUserGroups";
import { useIncomingInviteGroups } from "../../hooks/useIncomingInviteGroups";
import { useFriends } from "../../hooks/useFriends";
import { useGroupOutgoingInvites } from "../../hooks/useGroupOutgoingInvites";

import { cancelGroupInvite } from "../../modules/groups/cancelGroupInvite";
import { acceptGroupInvite } from "../../modules/groups/acceptGroupInvite";
import { rejectGroupInvite } from "../../modules/groups/rejectGroupInvite";
import { deleteGroup } from "../../modules/groups/deleteGroup";

import GroupCard from "./GroupCard";
import CreateGroup from "./CreateGroup";
import FriendPickerSheet from "./FriendPickerSheet";

import styles from "./GroupsPage.module.css";

export default function GroupsPage() {
  const { user } = useAuth();
  const uid = user?.uid;

  // Groups the user belongs to
  const { groups: userGroups, loading } = useUserGroups(uid);

  // Friends
  const { friends } = useFriends(uid);

  // Invite state
  const [incomingInvites, setIncomingInvites] = useState({});
  const [outgoingInvites, setOutgoingInvites] = useState({});

  // Load metadata for groups the user is invited to
  const incomingInviteGroups = useIncomingInviteGroups(incomingInvites);

  // Bottom sheet
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Create group form toggle
  const [showForm, setShowForm] = useState(false);

  // Outgoing invites for selected group
  const invited = useGroupOutgoingInvites(uid, selectedGroupId);
  const filteredFriends = friends.filter((f) => !invited.includes(f.uid));

  // Subscribe to incoming + outgoing invites
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

  // Fast lookup maps
  const userGroupMap = useMemo(() => {
    const map = {};
    for (const g of userGroups) map[g.id] = g;
    return map;
  }, [userGroups]);

  const incomingGroupMap = useMemo(() => {
    return incomingInviteGroups; // already keyed by groupId
  }, [incomingInviteGroups]);

  function handleDelete(group) {
    deleteGroup(group.id, uid);
  }

  function handleInvite(group) {
    setSelectedGroupId(group.id);
    setIsPickerOpen(true);
  }

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

      {/* USER GROUPS */}
      <h2 className={styles.sectionTitle}>Your Groups</h2>

      {loading && <p>Loading groups...</p>}

      {!loading && userGroups.length === 0 && (
        <p className={styles.empty}>You don't belong to any groups yet.</p>
      )}

      {!loading &&
        userGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onDelete={handleDelete}
            onInvite={handleInvite}
          />
        ))}

      {/* INCOMING INVITES */}
      <h2 className={styles.sectionTitle}>Group Invites</h2>

      {Object.keys(incomingInvites).length === 0 ? (
        <p className={styles.empty}>No group invites.</p>
      ) : (
        <ul className={styles.list}>
          {Object.entries(incomingInvites).map(([inviteId, invite]) => {
            const groupId = invite.groupId;
            const group = incomingGroupMap[groupId];
            const groupName = group?.name || groupId;

            return (
              <li key={inviteId} className={styles.listItem}>
                <span className={styles.groupName}>
                  {friends.find((f) => f.uid === invite.from)?.username ||
                    invite.from}{" "}
                  has invited you to join the group: {groupName}
                </span>

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

      {/* OUTGOING INVITES */}
      <h2 className={styles.sectionTitle}>Pending Invitations</h2>

      {Object.keys(outgoingInvites).length === 0 ? (
        <p className={styles.empty}>No pending invites.</p>
      ) : (
        <ul className={styles.list}>
          {Object.entries(outgoingInvites).map(([groupId, invitedUsers]) => {
            const group = userGroupMap[groupId];
            const groupName = group?.name || groupId;

            return Object.keys(invitedUsers).map((friendUid) => (
              <li key={`${groupId}-${friendUid}`} className={styles.listItem}>
                <span className={styles.groupName}>
                  {groupName} →{" "}
                  {friends.find((i) => i.uid === friendUid)?.username}
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

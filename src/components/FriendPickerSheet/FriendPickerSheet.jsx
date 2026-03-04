import { inviteToGroup } from "../../modules/firebaseHelpers";
import { useGroupOutgoingInvites } from "../../hooks/useGroupOutgoingInvites";
import styles from "./FriendPickerSheet.module.css";

export default function FriendPickerSheet({
  isOpen,
  onClose,
  groupId,
  uid,
  friends = [],
}) {
  if (!isOpen) return null;

  async function handleInvite(friendUid) {
    try {
      await inviteToGroup(groupId, uid, friendUid);
      onClose();
    } catch (err) {
      console.error("Error sending invite:", err);
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className={styles.header}>
          <div className={styles.dragHandle} />
          <h2>Invite Friends</h2>
        </div>

        <div className={styles.list}>
          {friends.length === 0 && (
            <p className={styles.empty}>You have no friends to invite.</p>
          )}

          {friends.map((friend) => (
            <div key={friend.uid} className={styles.friendRow}>
              <span className={styles.friendName}>{friend.username}</span>
              <button
                className={styles.inviteButton}
                onClick={() => handleInvite(friend.uid)}
              >
                Invite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

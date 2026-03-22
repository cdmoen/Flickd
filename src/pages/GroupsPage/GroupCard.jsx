import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GroupCard.module.css";

export default function GroupCard({ group, onDelete, onInvite }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <article className={styles.card}>
      <section className={styles.header}>
        <button
          className={styles.nameButton}
          onClick={() => navigate(`/groups/${group.id}`)}
          aria-label={`View details for group ${group.name}`}
        >
          <span className={styles.nameButtonText}>{group.name}</span>
          <span className={styles.arrow}>{" →"}</span>
        </button>

        <section className={styles.actions}>
          <button
            className={styles.inviteButton}
            onClick={() => onInvite(group)}
            aria-label={`Invite friend to group ${group.name}`}
          >
            Invite Friend
          </button>

          <button
            className={styles.deleteButton}
            onClick={() => setShowConfirm(true)}
            aria-label={`Delete group ${group.name}`}
          >
            Delete Group
          </button>
        </section>
      </section>

      <section className={styles.meta}>
        <span>Created: {new Date(group.createdAt).toLocaleString()}</span>
      </section>

      {showConfirm && (
        <div className={styles.backdrop}>
          <div className={styles.modal}>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{group.name}</strong>?
              This cannot be undone.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
                aria-label="Cancel delete group"
              >
                Cancel
              </button>

              {/* warning for deleting a group */}
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onDelete(group);
                  setShowConfirm(false);
                }}
                aria-label="Confirm delete group"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

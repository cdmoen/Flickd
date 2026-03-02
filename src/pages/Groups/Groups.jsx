import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserGroups } from "../../modules/useUserGroups";
import { deleteGroup, inviteToGroup } from "../../modules/firebaseHelpers";
import GroupCard from "../../components/GroupCard/GroupCard";
import CreateGroup from "../../components/CreateGroup/CreateGroup";

import styles from "./Groups.module.css";

export default function Groups() {
  const { user } = useAuth();
  const { groups, loading } = useUserGroups(user?.uid);
  const [showForm, setShowForm] = useState(false);

  function handleDelete(group) {
    if (!user || !user.uid) {
      console.error("User not loaded yet");
      return;
    }

    deleteGroup(group.id, user.uid);
  }

  function handleInvite(group) {
    inviteToGroup(group.id);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Groups</h1>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Cancel" : "Create a New Group"}
      </button>

      {showForm && (
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <CreateGroup />
        </div>
      )}

      <h2>Existing Groups</h2>

      {loading && <p>Loading groups...</p>}

      {!loading && groups.length === 0 && (
        <p>You don't belong to any groups yet.</p>
      )}

      {!loading &&
        groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onDelete={handleDelete}
            onInvite={handleInvite}
          />
        ))}
    </div>
  );
}

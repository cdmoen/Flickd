import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CreateGroup from "../../components/CreateGroup/CreateGroup";
import styles from "./Groups.module.css";

import { useState } from "react";
import CreateGroup from "../components/CreateGroup"; // adjust path as needed

export default function Groups() {
  const [showForm, setShowForm] = useState(false);

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

      {/* Placeholder for your actual group list */}
      <div>
        <h2>Existing Groups</h2>
        <p>(Your groups will appear here.)</p>
      </div>
    </div>
  );
}

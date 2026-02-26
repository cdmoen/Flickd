import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Groups.module.css";

export default function Groups() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Groups Example</h1>
      <p>Logged in as: {user?.email}</p>
      <h2>Group List Example</h2>
      <ul>
        <li>Example Group 1</li>
        <li>Example Group 2</li>
        <li>Example Group 3</li>
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

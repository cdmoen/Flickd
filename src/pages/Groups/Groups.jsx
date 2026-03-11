import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Groups.module.css";

export default function Groups() {
  const { user, logout } = useAuth();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Groups Example</h1>
      <p className={styles.userInfo}>Logged in as: {user?.email}</p>
      <h2>Group List Example</h2>
      <ul>
        <li>Example Group 1</li>
        <li>Example Group 2</li>
        <li>Example Group 3</li>
      </ul>
      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </main>
  );
}

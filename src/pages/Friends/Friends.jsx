import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Friends.module.css";

export default function Friends() {
  const { user, logout } = useAuth();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Friends</h1>
        <p className={styles.userInfo}>Logged in as: {user?.email}</p>
      <h2>Friend List Example</h2>
        <ul>
          <li>Example Friend 1</li>
          <li>Example Friend 2</li>
          <li>Example Friend 3</li>
        </ul>
      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </main>
  );
}
``
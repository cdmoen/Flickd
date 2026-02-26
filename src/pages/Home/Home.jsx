import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Home.module.css";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home</h1>
      <p className={styles.userInfo}>Logged in as: {user?.email}</p>
      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </div>
  );
}

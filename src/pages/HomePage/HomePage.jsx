import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, logout, profile, loading } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home</h1>
      <p className={styles.userInfo}>Logged in as: {profile?.username}</p>
      <p className={styles.userInfo}>Email: {profile?.email}</p>
      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </div>
  );
}

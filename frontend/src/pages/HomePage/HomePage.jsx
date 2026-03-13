import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AvatarPicker from "./AvatarPicker";

import styles from "./HomePage.module.css";

export default function HomePage() {
  const { user, logout, profile, loading } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.container}>

      <h1 className={styles.title}>Home</h1>

      <section className={styles.avatarPicker} onClick={() => setPickerOpen(true)}>
        <div className={styles.avatarContainer}>
          <img
            src={profile?.avatarUrl}
            className={styles.avatarImage}
            alt="User avatar"
          />
        </div>
        
        <p>Change Avatar</p>
      
      </section>      
      
      <p className={styles.userInfo}>Logged in as: {profile?.username}</p>
      
      <p className={styles.userInfo}>Email: {profile?.email}</p>


      {pickerOpen && (
        <AvatarPicker uid={user.uid} onClose={() => setPickerOpen(false)} />
      )}

      <button className={styles.logoutBtn} onClick={logout}>
        Logout
      </button>
    </main>
  );
}

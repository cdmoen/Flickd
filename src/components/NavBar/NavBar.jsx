import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavFriends from "./NavFriends";
import NavGroups from "./NavGroups";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { user, profile, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
<<<<<<< HEAD
    <nav className={styles.navbar}>
      <NavLink
        to="/home"
      >
        <img
          src="/images/flickd-2.png"
          alt="Logo"
          className={styles.logo}
        />
      </NavLink>
=======
      <nav className={styles.navbar}>
        <NavLink to="/home">
          <img src="/images/flickd-2.png" alt="Logo" className={styles.logo} />
        </NavLink>
>>>>>>> f5b4ecda40666e9d803d98c7829e7037c96fb0f4

        <NavFriends />

        <NavGroups />

<<<<<<< HEAD
      <NavLink
        to="/movies"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        <img 
          src="/images/search.png"
          alt="Search Icon"
          className={styles.searchIcon}
        />
=======
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <img
            src="public\images\search.png"
            alt="Search Icon"
            className={styles.searchIcon}
          />
>>>>>>> f5b4ecda40666e9d803d98c7829e7037c96fb0f4
          <span className={styles.linkText}>Search</span>
        </NavLink>

        <span className={styles.loginStatus}>
          Welcome, {profile?.username}!
        </span>
        <span className={styles.logoutBtn} onClick={logout}>
          Logout
        </span>
      </nav>
    </>
  );
}

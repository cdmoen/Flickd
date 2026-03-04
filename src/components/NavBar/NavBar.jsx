import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavFriends from "../NavFriends/NavFriends";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { user, profile } = useAuth();

  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Home
      </NavLink>

      <NavFriends />

      <NavLink
        to="/groups"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Groups
      </NavLink>

      <NavLink
        to="/movies"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Search Movies
      </NavLink>

      <span className={styles.loginStatus}>Welcome, {profile?.username}!</span>
    </nav>
  );
}

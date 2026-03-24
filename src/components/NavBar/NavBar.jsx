import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NavFriends from "./NavFriends";
import NavGroups from "./NavGroups";
import styles from "./NavBar.module.css";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export default function NavBar() {
  const { user, profile, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/home">
          <picture>
            <source media="(max-width: 412px)" srcSet="/images/logo-f-play.png" />
            <source media="(min-width: 412px)" srcSet="/images/logo-flickd-play.png" />
            <img
              src="/images/logo-f-play.png"
              alt="Link to Flickd Home"
              title="Flickd Home"
              className={styles.logo}
            />
          </picture>
        </NavLink>

        <NavFriends />

        <NavGroups />

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <img
            src="/images/search.png"
            alt="Link to Movie Search"
            title="Search Movies"
            className={styles.searchIcon}
          />
          <span className={styles.linkText}>Search</span>
        </NavLink>

        <NavLink to="/account" className={styles.link}>
          <img
            src="/images/faces.png"
            alt="Link to User Account"
            title="User Account"
            className={styles.accountIcon}
          />
          <span className={styles.linkText}>Account</span>
        </NavLink>



        {/* Right-side items pushed to the end */}
        <div className={styles.navRight}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === "light" ? (
            <img
              src="/images/moon.png"
              alt="Button for Dark Theme"
              title="Switch to Dark Theme"
              className={styles.themeIcon}
            />
          ) : (
            <img
              src="/images/sun.png"
              alt="Button for Light Theme"
              title="Switch to Light Theme"
              className={styles.themeIcon}
            />
          )}
        </button>
          <img
            src={profile?.avatarUrl || "/images/avatar1.png"}
            alt="Link to User Account"
            title="User Account"
            className={styles.accountIcon}
          />
          <span className={styles.loginStatus}>
            Welcome, {profile?.username}!
          </span>
        </div>
      </nav>
    </>
  );
}
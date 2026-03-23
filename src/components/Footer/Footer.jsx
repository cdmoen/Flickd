import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <NavLink to="/about" className={styles.link}>
        About
      </NavLink>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Flickd. All rights reserved.
      </p>
    </footer>
  );
}
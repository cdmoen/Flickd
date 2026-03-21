import { NavLink } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function GroupsCard() {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>Groups</h2>

      <section className={styles.cardRow}>
        <img
          src="/images/roll.png"
          alt="Groups Icon"
          title="Groups"
          className={styles.cardIcon}
        />
        <p className={styles.cardContent}>
          Create a group to share watchlists.
        </p>
      </section>

      <NavLink 
        to="/groups" 
        className={styles.cardBtn}
        aria-label="Add groups"
      >
        Add Groups
      </NavLink>
    </article>
  );
}

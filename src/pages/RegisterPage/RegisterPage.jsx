import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../modules/firebase";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { finalizeUserProfile } from "../../modules/users/finalizeUserProfile";
import { reserveUsername } from "../../modules/users/reserveUsername";
import styles from "./RegisterPage.module.css";
import { NavLink } from "react-router-dom";

export default function RegisterPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to="/home" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // reserveUsername checks if the username is available and throws an error if not
      await reserveUsername(username);

      // If username is available, create new Firebase user Authentication (nothing happens to realtime database yet)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Create and populate user profile in the realtime database (this is where realtime database is impacted)
      await finalizeUserProfile(uid, username, email);
    } catch (err) {
      setError(err.message || "Unable to create account");
    }
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img
          src="/images/logo-flickd-play.png"
          alt="Flickd Logo"
          className={styles.logo}
        />
      </header>

      <h1 className={styles.title}>Register</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email" className={styles.visuallyHidden}>
          Email Address
        </label>
        <input
          id="email"
          className={styles.input}
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className={styles.visuallyHidden}>
          Password
        </label>
        <input
          id="password"
          className={styles.input}
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="username" className={styles.visuallyHidden}>
          Display Name
        </label>
        <input
          id="username"
          className={styles.input}
          type="text"
          placeholder="Display Name"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button className={styles.button} type="submit">
          Create account
        </button>

        <NavLink
          to="/login"
          className={styles.loginbutton}
          aria-label="Go to Login Page"
        >
          Login
        </NavLink>
      </form>
    </main>
  );
}

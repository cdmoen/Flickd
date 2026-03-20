import { useState } from "react";
import { auth } from "../../modules/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect immediately
  if (user) return <Navigate to="/home" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("Sign in successful", user);
    } catch (error) {
      setError("Invalid email or password");
      console.error("Invalid email or password.", error.code, error.message);
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
      
      <h1 className={styles.title}>Login</h1>

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
          required
          autoComplete="email"
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

        <button className={styles.button} type="submit">
          Login
        </button>
      </form>

      <Link 
        className={styles.link} 
        to="/register"
        aria-label="Create account"
      >
        Create account
      </Link>
    </main>
  );
}

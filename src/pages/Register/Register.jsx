import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Register.module.css";

export default function Register() {
  const { user } = useAuth(); // read current user from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect immediately
  if (user) return <Navigate to="/home" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Firebase logs the user in automatically after registration
      // AuthContext will update `user`, triggering the redirect above
    } catch (err) {
      setError("Unable to create account");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Group.module.css";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      <h1>Example Group</h1>
      <h2>List of Films</h2>
      <ul>
        <li>Film 1</li>
        <li>Film 2</li>
        <li>Film 3</li>
      </ul>
      <p>Logged in as: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Friends.module.css";

export default function Friends() {
  const { user, logout } = useAuth();

  return (
    <>
      <h1>Friends</h1>
      <p>Logged in as: {user?.email}</p>
      <h2>Friend List Example</h2>
      <ul>
        <li>Example Friend 1</li>
        <li>Example Friend 2</li>
        <li>Example Friend 3</li>
      </ul>
      <button onClick={logout}>Logout</button>
    </>
  );
}

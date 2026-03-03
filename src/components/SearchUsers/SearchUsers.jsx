import { useState } from "react";
import {
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  get,
} from "firebase/database";
import { database } from "../../firebase";
import styles from "./SearchUsers.module.css";

export default function SearchUsers({ onSelect }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    const value = e.target.value;
    setTerm(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const usersRef = ref(database, "users");
    const q = query(
      usersRef,
      orderByChild("username"),
      startAt(value),
      endAt(value + "\uf8ff"),
    );

    const snap = await get(q);
    if (snap.exists()) {
      const data = snap.val();
      setResults(Object.entries(data).map(([uid, user]) => ({ uid, ...user })));
    } else {
      setResults([]);
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search username..."
        value={term}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      <div className={styles.results}>
        {results.map((user) => (
          <div
            key={user.uid}
            className={styles.resultRow}
            onClick={() => onSelect(user)}
          >
            <span className={styles.username}>{user.username}</span>

            <span className={styles.status}>
              {/* placeholder — will show real status later */}
              Status
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

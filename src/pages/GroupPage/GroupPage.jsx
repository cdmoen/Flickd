import { useParams } from "react-router-dom";
import { useGroupFilms } from "../../hooks/useGroupFilms";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../modules/firebase";
import { useAuth } from "../../contexts/AuthContext";
import FilmCard from "./FilmCard";
import styles from "./GroupPage.module.css";

export default function GroupPage() {
  const { user } = useAuth();
  const uid = user.uid;
  const { groupId } = useParams();
  const films = useGroupFilms(groupId);

  const [group, setGroup] = useState(null);

  useEffect(() => {
    const groupRef = ref(database, `groups/${groupId}`);
    return onValue(groupRef, (snap) => {
      if (snap.exists()) {
        setGroup(snap.val());
      }
    });
  }, [groupId]);

  if (!group) return <div>Loading group…</div>;

  return (
    <div className="group-page">
      <header className="group-header">
        <h1>{group.name}</h1>
        <button className="add-film-btn">Add Film</button>
      </header>

      <div className="film-list">
        {films.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            filmId={film.id}
            groupId={groupId}
            uid={uid}
          />
        ))}
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";
import styles from "./Group.module.css";

export default function Group() {
  const { groupId } = useParams();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Group: {groupId}</h1>
      <p>Group details will go here.</p>
    </div>
  );
}

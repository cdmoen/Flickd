import styles from "./AboutPage.module.css";

const developers = [
  {
    name: "Colin",
    role: "Creator & Developer",
    bio: "Add bio here.",
    photo: "/images/colin.jpg",
    github: "https://github.com/colin",
    linkedin: "https://linkedin.com/in/colin",
  },
  {
    name: "James",
    role: "Creator & Developer",
    bio: "Add bio here.",
    photo: "/images/james.jpg",
    github: "https://github.com/james",
    linkedin: "https://linkedin.com/in/james",
  },
  {
    name: "Nikole",
    role: "Creator & Developer",
    bio: "Add bio here.",
    photo: "/images/nikole.jpg",
    github: "https://github.com/nikole",
    linkedin: "https://linkedin.com/in/nikole",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.container}>

      <header className={styles.header}>
        <h1 className={styles.title}>Meet the Team</h1>
        <p className={styles.subtitle}>
          The developers behind Flickd.
        </p>
      </header>

      <div className={styles.cardGrid}>
        {developers.map((dev) => (
          <article key={dev.name} className={styles.card}>

            <div className={styles.photoWrapper}>
              <img
                src={dev.photo}
                alt={dev.name}
                className={styles.photo}
              />
            </div>

            <div className={styles.info}>
              <h2 className={styles.name}>{dev.name}</h2>
              <p className={styles.role}>{dev.role}</p>
              <p className={styles.bio}>{dev.bio}</p>
            </div>

            {/* <div className={styles.links}>
              {dev.github && (
                
                  href={dev.github}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  GitHub
                </a>
              )}
              {dev.linkedin && (
                
                  href={dev.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  LinkedIn
                </a>
              )}
            </div> */}

          </article>
        ))}
      </div>

    </main>
  );
}
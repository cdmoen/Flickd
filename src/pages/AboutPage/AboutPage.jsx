import styles from "./AboutPage.module.css";

const developers = [
  {
    photo: "/images/colin.jpg",
    name: "Colin Moen",
    role: "Creator & Developer",
    email: "colin@x.com",
    portfolio: "https://colin.github.io/colin/index.html",
    github: "https://github.com/colin",
    linkedin: "https://linkedin.com/in/colin",
    thisproject: "Add contribution here.",
    passion: "Add passion here.",
  },
  {
    photo: "/images/james.jpg",
    name: "James Kim",
    role: "Creator & Developer",
    email: "james@x.com",
    portfolio: "https://james.github.io/james/index.html",
    github: "https://github.com/james",
    linkedin: "https://linkedin.com/in/james",
    thisproject: "Add contribution here.",
    passion: "Add passion here.",
  },
  {
    photo: "/images/nikole.jpg",
    name: "Nikole Dixon",
    role: "Creator & Developer",
    email: "njdartwork@outlook.com",
    portfolio: "https://njdixn.github.io/NikoleDixonPortfolio/index.html",
    github: "https://github.com/njdixn",
    linkedin: "https://www.linkedin.com/in/nikoledixon/",
    thisproject: (
      <>
          For this project, I took on the role front-end developer, shaping the user experience and visual identity of Flickd with light and dark themes. 
          <br /><br />
          I was responsible for crafting the overall look and feel of the app, ensuring it was intuitive, engaging, and visually appealing. This involved designing the user interface, creating custom graphics, and implementing parts of the responsive layouts to provide a seamless experience across devices. 
          <br /><br />
          My goal was to create an app that not only functions well but also delights users with its design and usability.
        </>
      ),
    passion: (
      <>
      <hr />
        <br />
        <strong>'We define the lines that we color within.'</strong>
        <br /><br />
        I have a passion for creativity! What draws me to software development is the same impulse that has always driven my art. The desire to build something meaningful from nothing.
        <br /><br />
        Coding requires the same balance of discipline and imagination, where logic provides the framework and creativity gives it life. This process is fueled by a deep passion for creative exploration.
      </>
    ),    

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

  <div className={styles.profileRow}>
    <div className={styles.photoColumn}>
      <div className={styles.photoWrapper}>
        <img
          src={dev.photo}
          alt={dev.name}
          className={styles.photo}
        />
      </div>
    </div>

    <div className={styles.profileInfo}>
      <h2 className={styles.name}>{dev.name}</h2>
      <p className={styles.role}>{dev.role}</p>
    </div>
  </div>

  <div className={styles.links}>
    {dev.email && (
      <a href={"mailto:" + dev.email} className={styles.link}>
        Email
      </a>
    )}
    {dev.portfolio && (
      <a href={dev.portfolio} target="_blank" rel="noreferrer" className={styles.link}>
        Portfolio
      </a>
    )}
    {dev.github && (
      <a href={dev.github} target="_blank" rel="noreferrer" className={styles.link}>
        GitHub
      </a>
    )}
    {dev.linkedin && (
      <a href={dev.linkedin} target="_blank" rel="noreferrer" className={styles.link}>
        LinkedIn
      </a>
    )}
  </div>

  <div className={styles.info}>
    <p className={styles.thisproject}>{dev.thisproject}</p>
    <p className={styles.passion}>{dev.passion}</p>
  </div>

</article>
        ))}
      </div>

    </main>
  );
}

import styles from "./Hero.module.css";

export function Hero() {
  return (
    <header className={`container ${styles.hero} reveal`}>
     
      <div className={styles.content}>
        <h1 className={styles.name}>Pablo Santiago Potes</h1>
        <p className={styles.role}>
          $ Mechatronics Engineer — AI Specialist — Software Developer
        </p>
        <p className={styles.summary}>
          I'm a <b>Mechatronics Engineer</b>, with a hybrid profile
          that spans hardware, software, and machine learning. I work across the full stack, from
          <b> PyTorch/TensorFlow pipelines</b> to FastAPI <b>backends</b> and React <b>frontends</b>,
          and have hands-on experience with data-driven systems, and <b>technical research</b> into <b>model interpretability</b>,
          auditing internal representations to understand how <b>AI systems</b> actually reason. I'm driven by <b>clean code</b>
          , rigorous <b>documentation</b>, and turning complex technical problems into clear, working <b>solutions</b>.
        </p>
        <div className={styles.links}>
          <a className={`${styles.link} ${styles.primary}`} href="#projects">
            View projects
          </a>
          <a className={styles.link} href="mailto:potespablo11@gmail.com">
            Email
          </a>
          <a className={styles.link} href="https://github.com/Potest11" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
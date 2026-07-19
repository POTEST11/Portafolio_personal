import type { Section } from "../../types/section";
import styles from "./Footer.module.css";

interface FooterProps {
  sections: Section[];
}

export function Footer({ sections }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.columns}>
          <div className={styles.brandColumn}>
            <span className={styles.brandName}>Pablo Santiago Potes</span>
            <p className={styles.tagline}>
              Mechatronics Engineer — building across hardware, software, and machine learning.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/Potest11"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/pablopotes"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className={styles.linkColumn}>
            
            <nav className={styles.linkList}>
              {sections
                .filter((s) => s.isVisible)
                .map((section) => (
                  <a key={section.id} href={`#${section.slug}`} className={styles.link}>
                    {section.title}
                  </a>
                ))}
            </nav>
          </div>

          <div className={styles.linkColumn}>
            
            <nav className={styles.linkList}>
              <a href="mailto:potespablo11@gmail.com" className={styles.link}>
                potespablo11@gmail.com
              </a>
              <a href="tel:+573152962028" className={styles.link}>
                +57 315 296 2028
              </a>
            </nav>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.copyright}>© {year} Pablo Santiago Potes Velasco</span>
          <span className={styles.credit}>Built with React, FastAPI &amp; PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}
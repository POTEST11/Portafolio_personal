import type { ReactNode } from "react";
import styles from "./SectionShell.module.css";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  transparent?: boolean;
}

export function SectionShell({ id, eyebrow, title, children, transparent }: SectionShellProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${transparent ? styles.transparent : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container">
        <span className={`${styles.eyebrow} reveal`}>{eyebrow}</span>
        <h2 id={`${id}-heading`} className={`${styles.title} reveal`}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
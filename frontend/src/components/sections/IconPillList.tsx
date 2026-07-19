import styles from "./IconPillList.module.css";

export interface IconEntry {
  label: string;
  icon?: string;
  link?: string;
}

export function normalizeIconEntry(raw: unknown): IconEntry {
  if (typeof raw === "string") {
    return { label: raw };
  }
  const entry = raw as IconEntry;
  return { label: entry.label ?? "", icon: entry.icon, link: entry.link };
}

export function IconPillList({ items }: { items: unknown[] }) {
  const entries = items.map(normalizeIconEntry);

  return (
    <div className={styles.pills}>
      {entries.map((entry) => {
        const content = (
          <>
            {entry.icon && <img src={entry.icon} alt="" className={styles.pillIcon} />}
            {entry.label}
          </>
        );

        return entry.link ? (
          <a
            key={entry.label}
            href={entry.link}
            target="_blank"
            rel="noreferrer"
            className={`${styles.pill} ${styles.pillLink}`}
          >
            {content}
          </a>
        ) : (
          <span key={entry.label} className={styles.pill}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
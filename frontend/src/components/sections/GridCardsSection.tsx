import type { Section } from "../../types/section";
import { SectionShell } from "./SectionShell";
import styles from "./GridCardsSection.module.css";

export function GridCardsSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.slug} eyebrow={section.eyebrow} title={section.title} transparent>
      <div className={styles.grid}>
        {section.items.map((item) => {
          const tags = Array.isArray(item.data.tags) ? item.data.tags : [];
          return (
            <article key={item.id} className={`${styles.card} reveal`}>

              <h3 className={styles.cardTitle}>{item.data.name}</h3>
              {typeof item.data.image === "string" && item.data.image && (
                <img
                  src={item.data.image}
                  alt={String(item.data.name ?? "")}
                  className={styles.cardImage}
                />
              )}
              <p className={styles.cardDescription}>{item.data.description}</p>
              {tags.length > 0 && (
                <div className={styles.tags}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {item.data.link && (
                <a
                  className={styles.cardLink}
                  href={String(item.data.link)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View →
                </a>
              )}
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
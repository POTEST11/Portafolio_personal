import type { Section } from "../../types/section";
import { SectionShell } from "./SectionShell";
import styles from "./TimelineSection.module.css";

export function TimelineSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.slug} eyebrow={section.eyebrow} title={section.title}>
      <div className={styles.timeline}>
        {section.items.map((item) => (
          <div key={item.id} className={`${styles.entry} reveal`}>
            <div className={styles.dates}>
              {item.data.start_date} — {item.data.end_date ?? "present"}
            </div>
            <div className={styles.headline}>{item.data.degree}</div>
            <div className={styles.institution}>{item.data.institution}</div>
            {item.data.description && (
              <p className={styles.description}>{item.data.description}</p>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

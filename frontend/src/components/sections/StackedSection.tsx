import type { Section } from "../../types/section";
import { SectionShell } from "./SectionShell";
import { IconPillList } from "./IconPillList";
import styles from "./StackedSection.module.css";

function renderFieldValue(type: string, value: unknown): React.ReactNode {
  if (value === undefined || value === null || value === "") return null;

  if (type === "image" && typeof value === "string") {
    return <img src={value} alt="" className={styles.image} />;
  }

  if (type === "url" && typeof value === "string") {
    return (
      <a href={value} target="_blank" rel="noreferrer" className={styles.link}>
        {value}
      </a>
    );
  }

  if (type === "icon-list" && Array.isArray(value)) {
    return <IconPillList items={value} />;
  }

  if (type === "tags" && Array.isArray(value)) {
    return (
      <div className={styles.tags}>
        {value.map((tag) => (
          <span key={String(tag)} className={styles.tag}>
            {String(tag)}
          </span>
        ))}
      </div>
    );
  }

  if (type === "richtext") {
    return <p className={styles.richtext}>{String(value)}</p>;
  }

  return <p className={styles.text}>{String(value)}</p>;
}

export function StackedSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.slug} eyebrow={section.eyebrow} title={section.title} transparent>
      <div className={styles.stack}>
        {section.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <article key={item.id} className={`${styles.entry} reveal`}>
              {section.fieldSchema.map((field) => {
                const rendered = renderFieldValue(field.type, item.data[field.key]);
                if (!rendered) return null;
                return (
                  <div key={field.key} className={styles.field}>
                    {rendered}
                  </div>
                );
              })}
            </article>
          ))}
      </div>
    </SectionShell>
  );
}
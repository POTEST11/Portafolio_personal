import type { Section } from "../../types/section";
import { SectionShell } from "./SectionShell";
import { IconPillList } from "./IconPillList";
import styles from "./PillGroupsSection.module.css";

export function PillGroupsSection({ section }: { section: Section }) {
  return (
    <SectionShell id={section.slug} eyebrow={section.eyebrow} title={section.title}>
      <div className={styles.groups}>
        {section.items.map((item) => {
          const rawItems = Array.isArray(item.data.items) ? item.data.items : [];
          return (
            <div key={item.id} className={`${styles.group} reveal`}>
              <span className={styles.groupLabel}>{item.data.group}</span>
              <IconPillList items={rawItems} />
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
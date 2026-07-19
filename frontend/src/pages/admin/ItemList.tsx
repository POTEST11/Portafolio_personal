import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSection } from "../../api/adminSections";
import { deleteItem } from "../../api/adminItems";
import type { Section } from "../../types/section";
import styles from "./ItemList.module.css";

export function ItemList() {
  const { id } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) load(id);
  }, [id]);

  function load(sectionId: string) {
    setIsLoading(true);
    fetchSection(sectionId)
      .then(setSection)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }

  async function handleDelete(itemId: string) {
    if (!id || !confirm("Delete this item? This can't be undone.")) return;
    try {
      await deleteItem(id, itemId);
      load(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item.");
    }
  }

  if (isLoading) return <p className={styles.status}>Loading…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!section) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link to="/admin/dashboard" className={styles.back}>
            ← dashboard
          </Link>
          <h1 className={styles.heading}>{section.title} — items</h1>
        </div>
        <Link to={`/admin/sections/${id}/items/new`} className={styles.newButton}>
          + New item
        </Link>
      </header>

      {section.items.length === 0 && (
        <p className={styles.empty}>No items yet — add the first one.</p>
      )}

      <div className={styles.list}>
        {section.items
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            // Use the first schema field's value as a human-readable label.
            const primaryKey = section.fieldSchema[0]?.key;
            const label = primaryKey ? String(item.data[primaryKey] ?? "Untitled") : "Untitled";

            return (
              <div key={item.id} className={styles.row}>
                <span className={styles.label}>{label}</span>
                <div className={styles.rowActions}>
                  <Link to={`/admin/sections/${id}/items/${item.id}`} className={styles.editLink}>
                    Edit →
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllSections, updateSectionVisibility, deleteSection } from "../../api/adminSections";
import { clearToken } from "../../api/client";
import type { Section } from "../../types/section";
import styles from "./Dashboard.module.css";

export function AdminDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setIsLoading(true);
    try {
      const data = await fetchAllSections();
      setSections(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sections.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleVisibility(section: Section) {
    try {
      await updateSectionVisibility(section, !section.isVisible);
      await loadSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update visibility.");
    }
  }

  async function handleDelete(section: Section) {
    const itemCount = section.items.length;
    const warning =
      itemCount > 0
        ? `Delete "${section.title}"? This will also delete its ${itemCount} item${
            itemCount !== 1 ? "s" : ""
          }. This can't be undone.`
        : `Delete "${section.title}"? This can't be undone.`;

    if (!confirm(warning)) return;

    try {
      await deleteSection(section.id);
      await loadSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section.");
    }
  }

  function handleLogout() {
    clearToken();
    window.location.href = "/admin";
  }

  if (isLoading) return <p className={styles.status}>Loading…</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>~/admin/dashboard</h1>
        <div className={styles.headerActions}>
          <Link to="/admin/sections/new" className={styles.newButton}>
            + New section
          </Link>
          <button onClick={handleLogout} className={styles.logout}>
            Log out
          </button>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {sections.map((section) => (
          <div key={section.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.slug}>{section.slug}</span>
              <span className={styles.title}>{section.title}</span>
              <span className={styles.meta}>
                {section.layoutVariant} · {section.items.length} item
                {section.items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className={styles.rowActions}>
              <button
                onClick={() => handleToggleVisibility(section)}
                className={styles.toggle}
              >
                {section.isVisible ? "Visible" : "Hidden"}
              </button>
              <Link to={`/admin/sections/${section.id}`} className={styles.editLink}>
                Edit →
              </Link>
              <Link to={`/admin/sections/${section.id}/items`} className={styles.editLink}>
                Items →
              </Link>
              <button onClick={() => handleDelete(section)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
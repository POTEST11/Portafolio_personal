import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSection } from "../../api/adminSections";
import { createItem, editItem } from "../../api/adminItems";
import { DynamicField } from "../../components/admin/DynamicField";
import type { Section } from "../../types/section";
import styles from "./ItemForm.module.css";

export function ItemForm() {
  const { id, itemId } = useParams();
  const navigate = useNavigate();
  const isNew = itemId === "new";

  const [section, setSection] = useState<Section | null>(null);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [order, setOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchSection(id)
      .then((s) => {
        setSection(s);
        if (!isNew && itemId) {
          const existing = s.items.find((item) => item.id === itemId);
          if (existing) {
            setData(existing.data as Record<string, unknown>);
            setOrder(existing.order);
          }
        } else {
          setOrder(s.items.length + 1);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, itemId, isNew]);

  function updateField(key: string, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!id) return;
    setError(null);
    setIsSaving(true);

    try {
      if (isNew) {
        await createItem(id, order, data);
      } else if (itemId) {
        await editItem(id, itemId, order, data);
      }
      navigate(`/admin/sections/${id}/items`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <p className={styles.status}>Loading…</p>;
  if (error && !section) return <p className={styles.error}>{error}</p>;
  if (!section) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        {isNew ? `~/${section.slug}/new` : `~/${section.slug}/edit`}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span>Order</span>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </label>

        {section.fieldSchema.map((field) => (
          <DynamicField
            key={field.key}
            field={field}
            value={data[field.key]}
            onChange={(value) => updateField(field.key, value)}
          />
        ))}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save item"}
          </button>
        </div>
      </form>
    </div>
  );
}
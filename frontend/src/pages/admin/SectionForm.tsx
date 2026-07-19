import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FieldSchemaEditor } from "../../components/admin/FieldSchemaEditor";
import { fetchSection, createSection, editSection } from "../../api/adminSections";
import type { FieldDefinition, LayoutVariant } from "../../types/section";
import styles from "./SectionForm.module.css";

const LAYOUTS: LayoutVariant[] = ["timeline", "grid-cards", "pill-groups", "stacked"];

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function SectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [order, setOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>("grid-cards");
  const [fieldSchema, setFieldSchema] = useState<FieldDefinition[]>([]);

  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    fetchSection(id)
      .then((section) => {
        setSlug(section.slug);
        setTitle(section.title);
        setEyebrow(section.eyebrow);
        setOrder(section.order);
        setIsVisible(section.isVisible);
        setLayoutVariant(section.layoutVariant);
        setFieldSchema(section.fieldSchema);
        setSlugTouched(true);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, isNew]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload = { slug, title, eyebrow, order, isVisible, layoutVariant, fieldSchema };

    try {
      if (isNew) {
        await createSection(payload);
      } else if (id) {
        await editSection(id, payload);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <p className={styles.status}>Loading…</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        {isNew ? "~/admin/sections/new" : `~/admin/sections/${slug}`}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <span>Title</span>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </label>

        <label className={styles.field}>
          <span>Slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Eyebrow label</span>
          <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} placeholder="// section" />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Order</span>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </label>

          <label className={styles.field}>
            <span>Layout</span>
            <select
              value={layoutVariant}
              onChange={(e) => setLayoutVariant(e.target.value as LayoutVariant)}
            >
              {LAYOUTS.map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
            />
            <span>Visible</span>
          </label>
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Fields (field_schema)</legend>
          <FieldSchemaEditor fields={fieldSchema} onChange={setFieldSchema} />
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save section"}
          </button>
        </div>
      </form>
    </div>
  );
}
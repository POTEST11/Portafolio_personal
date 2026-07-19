import { useState } from "react";
import type { FieldDefinition } from "../../types/section";
import { uploadImage } from "../../api/upload";
import styles from "./DynamicField.module.css";

interface IconEntry {
  label: string;
  icon?: string;
  link?: string;
}

interface DynamicFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function DynamicField({ field, value, onChange }: DynamicFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <label className={styles.field}>
      <span>
        {field.label}
        {field.required && <span className={styles.required}> *</span>}
      </span>

      {field.type === "text" || field.type === "date" || field.type === "url" ? (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      ) : field.type === "richtext" ? (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
        />
      ) : field.type === "number" ? (
        <input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          required={field.required}
        />
      ) : field.type === "tags" ? (
        <input
          type="text"
          placeholder="comma, separated, values"
          value={Array.isArray(value) ? value.join(", ") : ""}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean)
            )
          }
        />
      ) : field.type === "icon-list" ? (
        <IconListField
          value={Array.isArray(value) ? (value as IconEntry[]) : []}
          onChange={onChange}
        />


      ) : field.type === "image" ? (
        <div className={styles.imageField}>
          {typeof value === "string" && value && (
            <img src={value} alt="" className={styles.preview} />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {isUploading && <span className={styles.uploading}>Uploading…</span>}
          {uploadError && <span className={styles.uploadError}>{uploadError}</span>}
        </div>
      ) : null
      
      
      
      }

      
    </label>
  );
}

function IconListField({
  value,
  onChange,
}: {
  value: IconEntry[];
  onChange: (value: IconEntry[]) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  function updateEntry(index: number, patch: Partial<IconEntry>) {
    onChange(value.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  }

  function removeEntry(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addEntry() {
    onChange([...value, { label: "", icon: undefined, link: undefined }]);
  }

  async function handleIconUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const url = await uploadImage(file);
      updateEntry(index, { icon: url });
    } catch {
      // Upload failure just leaves the icon unset — the label still saves fine.
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className={styles.iconList}>
      {value.map((entry, index) => (
        <div key={index} className={styles.iconRow}>
          {entry.icon && <img src={entry.icon} alt="" className={styles.iconPreview} />}
          <input
            type="text"
            placeholder="Skill name"
            value={entry.label}
            onChange={(e) => updateEntry(index, { label: e.target.value })}
            className={styles.iconLabelInput}
          />
          <input
            type="url"
            placeholder="Link (optional)"
            value={entry.link ?? ""}
            onChange={(e) => updateEntry(index, { link: e.target.value })}
            className={styles.iconLabelInput}
          />
          <input
            type="file"
            accept="image/svg+xml"
            onChange={(e) => handleIconUpload(index, e)}
          />
          {uploadingIndex === index && <span className={styles.uploading}>Uploading…</span>}
          <button type="button" onClick={() => removeEntry(index)} className={styles.remove}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={addEntry} className={styles.addEntry}>
        + Add entry
      </button>
    </div>
  );
}
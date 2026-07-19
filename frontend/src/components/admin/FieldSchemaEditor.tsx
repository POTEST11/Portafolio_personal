import type { FieldDefinition, FieldType } from "../../types/section";
import styles from "./FieldSchemaEditor.module.css";

const FIELD_TYPES: FieldType[] = ["text", "richtext", "url", "date", "image", "tags", "icon-list", "number"];

interface FieldSchemaEditorProps {
  fields: FieldDefinition[];
  onChange: (fields: FieldDefinition[]) => void;
}

export function FieldSchemaEditor({ fields, onChange }: FieldSchemaEditorProps) {
  function updateField(index: number, patch: Partial<FieldDefinition>) {
    const next = fields.map((field, i) => (i === index ? { ...field, ...patch } : field));
    onChange(next);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
  }

  function addField() {
    onChange([...fields, { key: "", label: "", type: "text", required: false }]);
  }

  return (
    <div className={styles.wrapper}>
      {fields.map((field, index) => (
        <div key={index} className={styles.row}>
          <input
            placeholder="key (e.g. institution)"
            value={field.key}
            onChange={(e) => updateField(index, { key: e.target.value })}
            className={styles.key}
          />
          <input
            placeholder="Label"
            value={field.label}
            onChange={(e) => updateField(index, { label: e.target.value })}
            className={styles.label}
          />
          <select
            value={field.type}
            onChange={(e) => updateField(index, { type: e.target.value as FieldType })}
            className={styles.type}
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className={styles.requiredLabel}>
            <input
              type="checkbox"
              checked={field.required ?? false}
              onChange={(e) => updateField(index, { required: e.target.checked })}
            />
            required
          </label>
          <button
            type="button"
            onClick={() => removeField(index)}
            className={styles.remove}
            aria-label={`Remove field ${field.label || index}`}
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" onClick={addField} className={styles.addButton}>
        + Add field
      </button>
    </div>
  );
}
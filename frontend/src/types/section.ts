// These types mirror the future FastAPI/Postgres model 1:1.
// `field_schema` describes the shape of `data` on each SectionItem —
// this is what lets the admin UI add whole new section types later
// without any frontend code changes.

export type FieldType =
  | "text"
  | "richtext"
  | "url"
  | "date"
  | "image"
  | "tags"
  | "icon-list"
  | "number";

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}
export type LayoutVariant =
  | "timeline"
  | "grid-cards"
  | "pill-groups"
  | "stacked"
  | "hero-text";
export interface SectionItem {
  id: string;
  sectionId: string;
  order: number;
  data: Record<string, string | string[] | number | undefined>;
}

export interface Section {
  id: string;
  slug: string;
  title: string;
  eyebrow: string; // the terminal-comment style label, e.g. "// education"
  order: number;
  isVisible: boolean;
  layoutVariant: LayoutVariant;
  fieldSchema: FieldDefinition[];
  items: SectionItem[];
}

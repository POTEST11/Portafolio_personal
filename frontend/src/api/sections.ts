import type { Section, SectionItem, FieldDefinition } from "../types/section";

const API_URL = import.meta.env.VITE_API_URL;

// Raw shapes matching exactly what the FastAPI/Pydantic response looks like.
interface RawFieldDefinition {
  key: string;
  label: string;
  type: string;
  required: boolean;
}

interface RawSectionItem {
  id: string;
  section_id: string;
  order: number;
  data: Record<string, unknown>;
}

interface RawSection {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  order: number;
  is_visible: boolean;
  layout_variant: string;
  field_schema: RawFieldDefinition[];
  items: RawSectionItem[];
}

function toFieldDefinition(raw: RawFieldDefinition): FieldDefinition {
  return {
    key: raw.key,
    label: raw.label,
    type: raw.type as FieldDefinition["type"],
    required: raw.required,
  };
}

function toSectionItem(raw: RawSectionItem): SectionItem {
  return {
    id: raw.id,
    sectionId: raw.section_id,
    order: raw.order,
    data: raw.data as SectionItem["data"],
  };
}

function toSection(raw: RawSection): Section {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    eyebrow: raw.eyebrow,
    order: raw.order,
    isVisible: raw.is_visible,
    layoutVariant: raw.layout_variant as Section["layoutVariant"],
    fieldSchema: raw.field_schema.map(toFieldDefinition),
    items: raw.items.map(toSectionItem),
  };
}

export async function fetchSections(): Promise<Section[]> {
  const response = await fetch(`${API_URL}/sections`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sections: ${response.status}`);
  }

  const raw: RawSection[] = await response.json();
  return raw.map(toSection);
}
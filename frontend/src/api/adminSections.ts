import { adminFetch } from "./client";
import type { Section } from "../types/section";

// Reuse the same snake_case -> camelCase conversion logic as the public fetch.
function toSection(raw: any): Section {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    eyebrow: raw.eyebrow,
    order: raw.order,
    isVisible: raw.is_visible,
    layoutVariant: raw.layout_variant,
    fieldSchema: raw.field_schema,
    items: raw.items.map((item: any) => ({
      id: item.id,
      sectionId: item.section_id,
      order: item.order,
      data: item.data,
    })),
  };
}

export async function fetchAllSections(): Promise<Section[]> {
  const response = await adminFetch("/sections/admin/all");
  if (!response.ok) {
    throw new Error("Failed to load sections.");
  }
  const raw = await response.json();
  return raw.map(toSection);
}

export async function updateSectionVisibility(
  section: Section,
  isVisible: boolean
): Promise<void> {
  const response = await adminFetch(`/sections/${section.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      slug: section.slug,
      title: section.title,
      eyebrow: section.eyebrow,
      order: section.order,
      is_visible: isVisible,
      layout_variant: section.layoutVariant,
      field_schema: section.fieldSchema,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to update section visibility.");
  }
}

export async function fetchSection(id: string): Promise<Section> {
  const response = await adminFetch(`/sections/admin/all`);
  if (!response.ok) throw new Error("Failed to load section.");
  const raw = await response.json();
  const match = raw.find((s: any) => s.id === id);
  if (!match) throw new Error("Section not found.");
  return toSection(match);
}

export async function createSection(section: Omit<Section, "id" | "items">): Promise<Section> {
  const response = await adminFetch("/sections", {
    method: "POST",
    body: JSON.stringify({
      slug: section.slug,
      title: section.title,
      eyebrow: section.eyebrow,
      order: section.order,
      is_visible: section.isVisible,
      layout_variant: section.layoutVariant,
      field_schema: section.fieldSchema,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to create section.");
  }
  return toSection(await response.json());
}

export async function editSection(
  id: string,
  section: Omit<Section, "id" | "items">
): Promise<Section> {
  const response = await adminFetch(`/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      slug: section.slug,
      title: section.title,
      eyebrow: section.eyebrow,
      order: section.order,
      is_visible: section.isVisible,
      layout_variant: section.layoutVariant,
      field_schema: section.fieldSchema,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to update section.");
  }
  return toSection(await response.json());
}

export async function deleteSection(id: string): Promise<void> {
  const response = await adminFetch(`/sections/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete section.");
  }
}
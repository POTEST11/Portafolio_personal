import { adminFetch } from "./client";
import type { SectionItem } from "../types/section";

function toItem(raw: any): SectionItem {
  return {
    id: raw.id,
    sectionId: raw.section_id,
    order: raw.order,
    data: raw.data,
  };
}

export async function createItem(
  sectionId: string,
  order: number,
  data: Record<string, unknown>
): Promise<SectionItem> {
  const response = await adminFetch(`/sections/${sectionId}/items`, {
    method: "POST",
    body: JSON.stringify({ order, data }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to create item.");
  }
  return toItem(await response.json());
}

export async function editItem(
  sectionId: string,
  itemId: string,
  order: number,
  data: Record<string, unknown>
): Promise<SectionItem> {
  const response = await adminFetch(`/sections/${sectionId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ order, data }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to update item.");
  }
  return toItem(await response.json());
}

export async function deleteItem(sectionId: string, itemId: string): Promise<void> {
  const response = await adminFetch(`/sections/${sectionId}/items/${itemId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item.");
  }
}
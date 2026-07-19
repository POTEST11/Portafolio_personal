import type { ComponentType } from "react";
import type { LayoutVariant, Section } from "../../types/section";
import { TimelineSection } from "./TimelineSection";
import { GridCardsSection } from "./GridCardsSection";
import { PillGroupsSection } from "./PillGroupsSection";
import { StackedSection } from "./StackedSection";

type SectionComponent = ComponentType<{ section: Section }>;

// When a new section type is added from the admin panel, it just needs
// to pick one of these existing layout_variant values. Adding a genuinely
// new layout later means adding one entry here — everything else
// (data fetching, routing, nav) stays untouched.
export const sectionRegistry: Record<LayoutVariant, SectionComponent | null> = {
  timeline: TimelineSection,
  "grid-cards": GridCardsSection,
  "pill-groups": PillGroupsSection,
  stacked: StackedSection,
  "hero-text": null, // reserved: the Hero component covers this today
};

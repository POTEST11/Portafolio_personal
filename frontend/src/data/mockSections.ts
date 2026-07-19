import type { Section } from "../types/section";

// Stand-in for `GET /api/sections?include=items`.
// Replace this file with a real API call once the backend is wired up —
// nothing else in the app needs to change, since components consume
// `Section`/`SectionItem` the same way regardless of source.

export const mockSections: Section[] = [
  {
    id: "sec-education",
    slug: "education",
    title: "Education",
    eyebrow: "// education",
    order: 1,
    isVisible: true,
    layoutVariant: "timeline",
    fieldSchema: [
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "start_date", label: "Start", type: "date", required: true },
      { key: "end_date", label: "End", type: "date" },
      { key: "description", label: "Description", type: "richtext" },
    ],
    items: [
      {
        id: "edu-1",
        sectionId: "sec-education",
        order: 1,
        data: {
          institution: "Universidad Autónoma de Occidente",
          degree: "B.Eng. in Computer Engineering",
          start_date: "2021",
          end_date: "2026",
          description:
            "Focus on distributed systems and cloud infrastructure. Capstone project on automated deployment pipelines.",
        },
      },
      {
        id: "edu-2",
        sectionId: "sec-education",
        order: 2,
        data: {
          institution: "AWS Educate",
          degree: "Cloud Foundations & Solutions Architecture",
          start_date: "2023",
          end_date: "2023",
          description:
            "Self-directed track covering core AWS services, IAM, and well-architected design principles.",
        },
      },
    ],
  },
  {
    id: "sec-projects",
    slug: "projects",
    title: "Projects",
    eyebrow: "~/projects",
    order: 2,
    isVisible: true,
    layoutVariant: "grid-cards",
    fieldSchema: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "richtext", required: true },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "image", label: "Cover image", type: "image" },
      { key: "link", label: "Link", type: "url" },
    ],
    items: [
      {
        id: "proj-1",
        sectionId: "sec-projects",
        order: 1,
        data: {
          name: "This portfolio",
          description:
            "A schema-driven portfolio: a FastAPI + Postgres backend lets new content sections be defined from an admin panel with no code changes.",
          tags: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
          link: "https://github.com",
        },
      },
      {
        id: "proj-2",
        sectionId: "sec-projects",
        order: 2,
        data: {
          name: "Deploy pipeline dashboard",
          description:
            "Internal tool that visualizes CI/CD pipeline health across services, built during a cloud-infrastructure capstone.",
          tags: ["AWS", "Terraform", "Python"],
          link: "https://github.com",
        },
      },
      {
        id: "proj-3",
        sectionId: "sec-projects",
        order: 3,
        data: {
          name: "Sensor telemetry API",
          description:
            "REST API ingesting embedded-device telemetry at scale, with a time-series store and alerting rules.",
          tags: ["FastAPI", "PostgreSQL", "Docker"],
          link: "https://github.com",
        },
        
      },
    ],
  },
  {
    id: "sec-skills",
    slug: "skills",
    title: "Skills",
    eyebrow: "// skills",
    order: 3,
    isVisible: true,
    layoutVariant: "pill-groups",
    fieldSchema: [
      { key: "group", label: "Group", type: "text", required: true },
      { key: "items", label: "Items", type: "tags", required: true },
    ],
    items: [
      {
        id: "skill-1",
        sectionId: "sec-skills",
        order: 1,
        data: {
          group: "Languages",
          items: ["TypeScript", "Python", "SQL", "Go"],
        },
      },
      {
        id: "skill-2",
        sectionId: "sec-skills",
        order: 2,
        data: {
          group: "Frontend",
          items: ["React", "Vite", "CSS", "Accessibility"],
        },
      },
      {
        id: "skill-3",
        sectionId: "sec-skills",
        order: 3,
        data: {
          group: "Backend & Cloud",
          items: ["FastAPI", "PostgreSQL", "Docker", "AWS", "Railway"],
        },
      },
    ],
  },
];

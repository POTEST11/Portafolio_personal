# Portfolio Monorepo

- `frontend/` — React + TypeScript + Vite, pure CSS (CSS Modules), currently
  rendering from mock data in `src/data/mockSections.ts`.
- `backend/` — FastAPI + PostgreSQL, not yet scaffolded.

## Frontend: run locally

    cd frontend
    npm install
    npm run dev

## Architecture recap

- Content model: `Section` (slug, layout_variant, field_schema) +
  `SectionItem` (data: JSONB matching field_schema). This is what lets new
  section types (Experience, Publications, ...) be added from an admin
  panel later with zero frontend/backend code changes.
- `src/components/sections/registry.ts` maps `layout_variant` to the React
  component that renders it. Today: timeline, grid-cards, pill-groups.
  Swap `mockSections` for a real `GET /api/sections` call once the backend
  exists — nothing else changes.
- Design tokens live in `src/styles/tokens.css` (colors, type, spacing,
  motion), theme toggle via `data-theme` attribute + localStorage.

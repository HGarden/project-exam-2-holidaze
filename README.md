# Holidaze (React + Vite)

This app is a Holidaze-style venue marketplace built with React 18 and Vite. It uses Tailwind CSS + DaisyUI for UI, and Noroff v2 API for data.

## Dev scripts
- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — serve the build locally
- `npm run lint` — run ESLint

## Project structure
- `src/api/` — API client and endpoint modules (fetch wrapper, venues API)
- `src/components/` — reusable UI components (Header, Footer, Layout, Card, etc.)
- `src/pages/` — route-level features (home, venue, admin, profile, login, register)
- `src/constants/` — runtime constants (API URLs, headers)

## Notable decisions
- Light theme only for accessibility.
- Centralized headers (Authorization + X-Noroff-API-Key).
- Search is URL-driven (`/?q=`) and works from any page.

See `docs/structure.md` for recommended folder organization and future improvements.

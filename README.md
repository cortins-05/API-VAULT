# API Vault

Dashboard to catalog, evaluate, and monitor third‑party APIs. Combines AI‑assisted ingestion (Gemini 2.5 Flash) with manual flows, persists to PostgreSQL via Prisma, and runs on Next.js 16 (App Router) + React 19 + TailwindCSS 4 + Radix UI + shadcn/ui.

![Sidebar+LandingPage](/photos/image1.png)

## Key Features
- AI ingestion: extracts technical metadata from official docs (name, description, API type, auth, SDKs, pricing, confidence) with Zod validation and a repair retry if the AI returns invalid JSON.
- Assisted create/edit flow: pre‑fills and lets humans correct before saving provider + API.
- Full CRUD for APIs, providers, and keys; revalidation and navigation via server actions.
- API detail: summary, protected/masked key, contexts (recommended/avoid), evaluations (cost, performance, stability, support), flags (black/gray/warning), and technical incident memos.
- Live search and cards with formatted dates for fast cataloging.

![IaIngestForm](/photos/image2.png)
![FormConfirm](/photos/image3.png)
![ApiDetails](/photos/image4.png)

## Architecture & Stack
- Frontend: Next.js 16 (App Router), React 19, TailwindCSS 4, Radix UI, shadcn/ui, theming with next‑themes.
- Backend: Next Server Actions, Prisma Client generated under [src/generated/prisma](src/generated/prisma), `@prisma/adapter-pg` and `pg` for PostgreSQL.
- AI: `@google/genai` (Gemini 2.5 Flash) for factual ingestion with schema validation (Zod) and JSON repair strategy.
- Utilities: `date-fns` for formatting, `lucide-react` icons, `sonner` toasts, `motion` animations.

## New Features
- Added `ApisPerProvider` component to display APIs for a specific provider.
- Implemented `ProviderDetailsPage` to show detailed provider information.
- Created `FlagsCard` to visualize API flags.
- Updated `ApiComponent`, `CreateFormConfirm`, `ProviderComponent`, `SearchApis`, and `SearchProviders` to improve functionality and UX.

## Data Modeling (Prisma)
- Provider ↔ Api (1:1) with key metadata, support, and notes.
- ApiMemory (technical memos), ApiEvaluation (0‑5 metrics), ApiFlag (black/gray/warning), ApiContext (recommended/avoid) with cascade relations.

## Functional Flows
1) Create API (AI): name + docs URL → Gemini ingestion → validated draft → human review → save.
2) Create API (manual): fill provider + API + metadata → save.
3) Operational knowledge: add memos, contexts, flags, and evaluations from the API detail view.
4) Catalog: live search and navigate to details.
5) Reproducible seed: GET route `/api/seed` with examples (OpenAI, Stripe).

## User Experience
- Layout with sidebar, theme toggle, and fixed footer.
- Landing with text effects (rolling, shimmering, text‑generate) for the hero.
- Inline edits: flags, contexts, memos, and evaluations with immediate revalidation.
- API Key with masking, visibility toggle, copy‑to‑clipboard; quick key updates.

## Getting Started (Local)
1. Environment variables: rename `.env.template` to `.env` and fill credentials (PostgreSQL, `GOOGLE_API_KEY`, etc.).
2. Database: `docker compose up -d`.
3. Dependencies: `npm install`.
4. Migrations: `npx prisma migrate dev` (or `npm run migrate` for deploy‑style).
5. Prisma Client: `npx prisma generate` (or `npm run generate`).
6. Demo data (optional): visit `http://localhost:3000/api/seed`.
7. Development: `npm run dev` (http://localhost:3000).

## NPM Scripts
- `npm run dev` → development mode.
- `npm run build` → production build.
- `npm start` → serve build.
- `npm run lint` → ESLint.
- `npm run migrate` → apply Prisma migrations (deploy).
- `npm run generate` → generate Prisma Client.

## Suggested Next Steps
- Authentication and roles for teams.
- Historical metrics and comparisons across providers.
- Report exports (CSV/PDF) with flags and evaluations.
- Proactive alerts for changes detected in official documentation.

## V2 (New Changes)
- Dockerized PostgreSQL setup with persisted data under [postgres](postgres); compose orchestration via [docker-compose.yaml](docker-compose.yaml).
- New app routes for API/provider management: [src/app/gestor-apis](src/app/gestor-apis), [src/app/gestor-proveedores](src/app/gestor-proveedores), [src/app/my-api](src/app/my-api), [src/app/profile](src/app/profile), [src/app/errorAuth](src/app/errorAuth), and [src/app/auth](src/app/auth).
- Authentication flows and UI: [src/components/login-form.tsx](src/components/login-form.tsx), [src/components/signup-form.tsx](src/components/signup-form.tsx), [src/components/logginSocialButtons.tsx](src/components/logginSocialButtons.tsx), [src/components/SignInOutButton.tsx](src/components/SignInOutButton.tsx); backed by utilities in [src/lib/auth.ts](src/lib/auth.ts) and [src/lib/auth-client.ts](src/lib/auth-client.ts).
- API key management improvements via [src/components/UpdateKeyButton.tsx](src/components/UpdateKeyButton.tsx).
- Search and provider UX updates: [src/components/SearchApis.tsx](src/components/SearchApis.tsx), [src/components/NoProvidersError.tsx](src/components/NoProvidersError.tsx), and [src/components/SearchProvideers.tsx](src/components/SearchProvideers.tsx).
- shadcn/ui integration scaffolded under [src/components/shadcn](src/components/shadcn) and [src/components/ui](src/components/ui); theme toggling via [src/components/themeToggle.tsx](src/components/themeToggle.tsx).
- Server actions organized in [src/actions/ai](src/actions/ai), [src/actions/auth](src/actions/auth), and [src/actions/prisma](src/actions/prisma).
- Prisma setup refinements: [prisma/schema.prisma](prisma/schema.prisma), migration [prisma/migrations/20260111150557_test](prisma/migrations/20260111150557_test), and config [prisma.config.ts](prisma.config.ts).
- Generated Prisma client stored in [src/generated/prisma](src/generated/prisma) to speed up builds.
- Configuration and deploy metadata: [next.config.ts](next.config.ts), [eslint.config.mjs](eslint.config.mjs), [postcss.config.mjs](postcss.config.mjs), [tsconfig.json](tsconfig.json), and [vercel.json](vercel.json).
- Documentation screenshots added under [photos](photos).
## Quick project map (what this codebase is)

- Frontend: Vite + React (TSX) at the repository root. Entry: `index.tsx` / `App.tsx`.
- Backend API: Node + Express TypeScript in `/api`. Entry: `api/src/index.ts`.
- ORM: Prisma under `api/prisma` (schema at `api/prisma/schema.prisma`) and client wrapper at `api/src/prisma.ts`.
- Communication: frontend calls the API at `/api/*` (Vite proxy in dev). Frontend API client is `web/sdk.ts` which uses Zod schemas to validate responses.

## How to run locally (developer flow)

- Install deps for both projects:
  - Frontend: `npm install` (root)
  - Backend: `cd api && npm install`
- Run frontend dev server: `npm run dev` (root) — Vite serves the UI and proxies `/api` to the backend in dev.
- Run backend in dev: `cd api && npm run dev` (uses `ts-node-dev` to reload).
- Database / Prisma:
  - Create/migrate the DB: `cd api && npm run migrate` (runs `prisma migrate dev`).
  - Seed: `cd api && npm run seed`.

Environment notes: look for `.env` / `.env.local` entries used in the README and `api/src/env` (expect vars like `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `PORT`, and `GEMINI_API_KEY`).

## Key patterns and conventions to follow

- Validation: Use Zod for both server and client. Example: client response schemas live in `web/sdk.ts` and the server uses `zod-express-middleware` (see `api/src/modules/*/*.schema.ts`).
- Errors: The backend uses a custom `ApiError` and central error middleware (`api/src/middleware/errors.ts`). Throw `ApiError` (status, title, detail) from services/controllers so the middleware returns consistent JSON.
- Auth: JWT-based tokens are created in `api/src/modules/auth/service.ts` and the frontend sends credentials with `fetch(..., { credentials: 'include' })`. Cookies are parsed with `cookie-parser` on the server.
- Database access: Always import the shared Prisma client from `api/src/prisma.ts` (it configures logging based on NODE_ENV). Example usage: `import prisma from '../../prisma';` inside `api/src/modules/*`.
- Routing: Router modules sit under `api/src/modules/<name>` with `routes.ts` that export a default Express Router; they are mounted in `api/src/index.ts` (e.g., `/api/auth`, `/api/forums`). Follow that shape when adding new features.

## Examples (concrete snippets to follow project style)

- New route: create `api/src/modules/<feature>/routes.ts` exporting a router, then `api/src/modules/<feature>/controller.ts` and `service.ts`. Mount it in `api/src/index.ts` with `apiRouter.use('/<feature>', featureRoutes);`.
- Client call (follow `web/sdk.ts`): always call the API using the `api` client or `fetch('/api/xxx', { credentials: 'include' })`. Responses are validated by Zod schemas in `web/sdk.ts`.
- Auth flow: `POST /api/auth/register` and `POST /api/auth/login` return `{ user, token }`; token handling is done server-side via cookies (frontend expects to `include` credentials).

## Important files to reference while editing

- `api/src/index.ts` — app bootstrap, middleware, route mounting, error handling
- `api/src/prisma.ts` — Prisma client wrapper
- `api/prisma/schema.prisma` — DB models (migrations / seed)
- `api/src/modules/auth/service.ts` — example of register/login implementations (argon2 + jwt + prisma)
- `web/sdk.ts` — frontend API client and Zod response schemas
- `App.tsx` — frontend app wiring and where `fetch('/api/me', { credentials: 'include' })` is used

## Integration and cross-cutting concerns

- CORS: configured in `api/src/index.ts` using `env.CORS_ORIGIN`. Changing the origin or cookie policy requires updating both server and Vite dev proxy if needed.
- Sessions & cookies: server uses `cookie-parser`; frontend must use `credentials: 'include'` to send cookies.
- Prisma migrations: run migrations from the `api` package (`npm run migrate`). Do not forget to run `npm run seed` if the feature depends on seeded data.

## Developer dos & don'ts (project-specific)

- Do follow the Zod schemas for input/output shapes — the UI expects the shapes defined in `web/sdk.ts`.
- Do use `ApiError` for early failures in services/controllers so the central error handler produces consistent responses.
- Don't change the API base path — frontend assumes `/api` and the dev environment relies on Vite proxy.

If anything here is unclear or you want more detail (examples for adding a new module, tests to run, or CI hooks), tell me which area and I will extend the instructions. 

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**. Use `--remote` to talk to the hosted Astro DB (Turso) instead of the local SQLite shadow.

- `pnpm dev` — local dev server on http://localhost:4321 (uses local Astro DB shadow)
- `pnpm dev:prod` — dev server against the remote Astro DB
- `pnpm build` — production build against the remote DB (`astro build --remote`); outputs to `dist/`
- `pnpm preview` — preview the built site
- `pnpm as check` — run `astro check` (type-check `.astro` + `.ts`/`.tsx`). There is no separate lint/test script.
- `pnpm as db push --remote` — push `db/config.ts` schema changes to the remote DB

There is no test runner configured.

## Architecture

Astro 6 SSR app (`output: "server"`, Vercel adapter) that renders a portfolio/CV from data in Astro DB. Admin UI edits the data; the public homepage renders it.

### Rendering split (Astro vs React)

- `.astro` files are thin shells: they do DB reads, build a **view model** via `src/lib/view-models.ts`, and hand it to a React island with `client:load`.
- All interactive UI lives in React under `src/components/react/`. There are two main entry points:
  - `site.tsx` / `site-experience.tsx` — public portfolio sections used from `src/pages/index.astro`
  - `admin.tsx` — re-exports `AdminDashboardHome`, `AdminUsersList`, `AdminUserEditor` used from `src/pages/admin*`
- `src/components/ui/` are shadcn components built on `@base-ui/react` (not Radix — it was migrated). `components.json` style is `base-nova`, base color `stone`, icon library `tabler`.
- `.astro` components still exist under `src/components/` and `src/components/sections/`, but new work should prefer the React islands pattern above.

### Data layer

- Schema: `db/config.ts` defines all tables via `astro:db`. Two parallel user concepts coexist:
  - `users` (numeric id) — the **portfolio subject** (first_name, last_name, email); referenced by `personal_info`, `experience`, `education`, `skills`, `certificates`, `projects`, `user_languages`. `src/pages/index.astro` hardcodes `user.id = 1`.
  - `user` / `session` / `account` / `verification` (text id) — **better-auth** tables for login/admin access. These are separate from the `users` table above.
- Seed data: `db/seed.ts`.
- Import DB objects from `astro:db` (e.g. `import { db, users, eq } from "astro:db"`). `src/lib/db.ts` is just a re-export shim for the better-auth tables.

### Auth

- `better-auth` with the `admin` plugin, drizzle adapter over `astro:db` — see `src/lib/auth.ts`. Email+password only, `autoSignIn: false`.
- API route: `src/pages/api/auth/[...all].ts` handles all better-auth endpoints.
- `src/middleware.ts` populates `Astro.locals.user` / `Astro.locals.session` on every request and **redirects any `/admin*` request without a session to `/login`**. Types for `Astro.locals` live in `src/env.d.ts`.

### Admin editor flow

`src/pages/admin/users/[id].astro` is the tabbed editor. The pattern to know:

1. On `POST`, the page reads `FormData`, checks `Content-Length` (6MB cap to bound uploads at 5MB + multipart overhead), and dispatches via `handleAdminUserPost(userId, form)` in `src/lib/admin/index.ts`.
2. `handleAdminUserPost` switches on the `_action` form field (e.g. `update_user_basic`, `add_experience`, `upload_project_image`, …) and calls the matching handler in `src/lib/admin/<section>.ts`. Each handler returns `ActionResult` (`{ ok: true } | { ok: false, error }`).
3. On success the page redirects back to itself preserving `?tab=`; on failure `postError` is mapped to the owning tab via `tabActions` so the error surfaces on the correct tab.
4. All DB rows are then fed through `buildAdminUserEditorViewModel` (`src/lib/view-models.ts`) into a single `AdminUserEditor` React island. View-model types live in `src/types/view-models.ts`.

When adding a new admin section: add a handler file in `src/lib/admin/`, export it from `src/lib/admin/index.ts`, add a `case` in `handleAdminUserPost`, add the action id to `tabActions` in `[id].astro`, and wire it into `getAdminTabs` / the view model / the React editor.

### Feature flags

`src/lib/flags.ts` reads `import.meta.env.PUBLIC_ENABLE_UPLOADS`. Image upload UI (user avatar + project images) is gated on `ENABLE_UPLOADS`; `getAdminTabs(enableUploads)` conditionally includes the `image` tab.

### Path alias

`@/*` → `src/*` (see `tsconfig.json`). Use it consistently; avoid deep relative imports.

## Roadmap context (from `TODO.md`)

Outstanding work: selectable CV templates, and an export that produces a single self-contained HTML file with inlined CSS, base64-encoded images, and minimal JS. Keep this constraint in mind when adding client-side JS or external asset references on the public portfolio path.

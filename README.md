# WatchLyst

WatchLyst is a private, mobile-first TV, anime, and movie progress tracker. Its core flow is deliberately short: open **My Lyst**, see the exact episode, tap **+1 Episode**, and leave. It uses Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL, and a server-side TMDB proxy.

## Features and structure

- Email/password authentication and user-owned data protected by PostgreSQL RLS.
- Status/title filters, recent-update sorting, optimistic episode changes, manual progress, ratings and notes.
- TMDB movie/TV search without exposing its token, plus an installable responsive PWA.
- `src/app`: pages, manifest, and TMDB endpoints; `src/components`: UI; `src/lib`: types and clients; `supabase/migrations`: schema and RLS; `public`: icons.

## Local Setup

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill every value.
3. Run `npm run dev` and open `http://localhost:3000`.

Checks: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Supabase

1. Create a Supabase project and run `supabase/migrations/20260820000000_create_watch_items.sql` in its SQL Editor (or use `supabase db push`).
2. Enable Email under **Authentication → Providers**. Configure the production Site URL and redirect URLs; if confirmation is enabled, users confirm email before login.
3. Put the Project URL and public anon key in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Do not use a service-role key.

The migration enables RLS and restricts every operation to `auth.uid() = user_id`; frontend filtering is not the security boundary.

## TMDB

Create a TMDB account, request API access, and put the **API Read Access Token** (v4 bearer token) in server-only `TMDB_API_TOKEN`. This product uses the TMDB API but is not endorsed or certified by TMDB. Add TMDB's official attribution logo before a public commercial launch if required by its current terms.

## Vercel

Import the GitHub repository as a Next.js project, add all three `.env.example` variables to Production (and Preview if wanted), and deploy. Add the resulting HTTPS domain to Supabase Authentication URL configuration. No custom server is needed.

## iPhone

Open the deployed site in Safari, tap **Share → Add to Home Screen**, confirm **WatchLyst**, then launch its icon. It opens in standalone mode.

## Live verification

Actual signup/email delivery, RLS requests, persistent progress, and live TMDB results need a configured Supabase project, applied migration, and TMDB token. Verify those flows after configuration; never commit `.env.local`.

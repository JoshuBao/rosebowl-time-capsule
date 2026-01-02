## Rose Bowl Time Capsule (web)

A living, crowd-sourced archive of where people were and what they felt during the Rose Parade / Rose Bowl.

- **No auth**: submissions are accepted anonymously
- **Storage**: Supabase Postgres + Supabase Storage (optional photo/clip)
- **View**: scrolling “wall” + optional Mapbox map pins (if user shares location)

## Local dev

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1) Create a Supabase project
2) Create a table named `submissions` with the SQL below
3) Create a Storage bucket (default name: `rose-bowl-media`)
   - Make it **public** (so `getPublicUrl()` works), or change the app to use signed URLs
4) Put your env vars into `web/.env.local`:
   - **NEXT_PUBLIC_SUPABASE_URL** (or `SUPABASE_URL`): Project URL
   - **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY** (or `SUPABASE_SERVICE_ROLE_KEY`): Publishable key or service role key
   - **SUPABASE_STORAGE_BUCKET**: Bucket name (optional; defaults to `rose-bowl-media`)

### Table SQL

Run this in the Supabase SQL editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  location_text text not null,
  message text not null,
  lat double precision null,
  lng double precision null,
  media_url text null,
  media_type text null
);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);
```

## Optional: Mapbox map

If you want the pins-on-a-map view, set:

- `NEXT_PUBLIC_MAPBOX_TOKEN` in `web/.env.local`

If it’s not set, the app falls back to wall-only mode.

## Notes

- The server uses the **service role key** to insert and upload. Don’t expose it to the browser.
- Basic spam friction: a hidden honeypot field + server-side length/file checks.

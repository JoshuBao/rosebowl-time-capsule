# 🌹 Rose Bowl Time Capsule

A living, crowd-sourced archive of where people were and what they felt during the Rose Parade / Rose Bowl.

- **Submit**: “Where were you watching from?”, a sentence or two, optional photo/clip, optional map pin
- **View**: scrolling wall + optional Pasadena/LA map pins
- **No auth** required

## Where the app lives

The Next.js app is in `web/`.

## Run locally

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Supabase + Mapbox setup

See `web/README.md` for:

- Supabase table SQL (`submissions`)
- Supabase Storage bucket setup (for uploads)
- Optional Mapbox token setup


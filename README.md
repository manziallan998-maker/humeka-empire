# HUMEKA TV

A YouTube-style website for the HUMEKA TV channel, with a "publisher panel"
the channel owner uses to control everything on the public site — videos,
news posts, branding — plus YouTube sync that runs both on demand and
automatically every hour.

Your Supabase project credentials are already filled in below and in `.env`,
so you can run this locally right away. The only setup left is running the
SQL schema once and deploying the sync function (both take a few minutes).

## What's included

- **Public site** — homepage video grid, a watch page with the YouTube player
  embedded, a news/announcements feed, and an about page.
- **Publisher panel** (`/publisher`) — password-protected, to:
  - Add videos manually, or sync automatically from the YouTube channel
  - Publish, unpublish, feature, edit or delete any video
  - Write and publish news posts/announcements
  - Edit the logo, tagline, social links and which sections are visible
- **Supabase** for the database and login — no separate backend server.
- **Scheduled YouTube sync** — a Supabase Edge Function that pulls new
  uploads automatically, on top of the manual "Sync now" button. The YouTube
  API key lives only on the server side, never in the browser.

## 1. Set up the database (one time)

Project: `https://dhpiyyffecuzkkqllidy.supabase.co`

1. Open your Supabase project → **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` and run it. This creates the
   `videos`, `posts` and `site_settings` tables with the right security rules.
3. Go to **Authentication → Users → Add user** and create one login (email +
   password) for the channel owner — that's the publisher account. There's no
   public sign-up page by design.

## 2. Run it locally

```bash
npm install
npm run dev
```

`.env` already has your project URL and anon key, so this works immediately.
Visit `http://localhost:5173` for the public site, and
`http://localhost:5173/publisher/login` to sign in with the account from step 1.

At this point you can already add videos and posts manually from the
publisher panel. The steps below add **automatic** YouTube syncing.

## 3. Get a YouTube API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com), create
   a project, then **APIs & Services → Library → enable "YouTube Data API v3"**.
2. **APIs & Services → Credentials → Create credentials → API key**.
3. Restrict it under "API restrictions" to YouTube Data API v3 only.

## 4. Deploy the sync function

You'll need the [Supabase CLI](https://supabase.com/docs/guides/cli)
(`npm install -g supabase`, then `supabase login`).

```bash
supabase link --project-ref dhpiyyffecuzkkqllidy
supabase functions deploy sync-youtube
supabase secrets set YOUTUBE_API_KEY=your-youtube-api-key
supabase secrets set YOUTUBE_CHANNEL_ID=UC55j2e32L6BIimC_BJSESMg
```

That's it — the "Sync now" button in the publisher panel
(`/publisher/youtube-sync`) now works.

## 5. Schedule it to run automatically

Two ways to do this — pick whichever is easier:

- **Dashboard (no SQL):** Supabase Dashboard → **Edge Functions →
  sync-youtube → Cron Jobs tab** → schedule a call, e.g. every hour.
- **SQL:** open `supabase/cron.sql`, drop in your `service_role` key from
  **Project Settings → API** (keep this one secret — never put it in the
  frontend), and run it in the SQL Editor.

Either way, new uploads now appear on the site without anyone touching the
publisher panel.

## 6. Deploy the site to Cloudflare Pages

```bash
npm run build
```

Then either connect the project's git repo in the Cloudflare dashboard, or
deploy directly with Wrangler:

```bash
npx wrangler pages deploy dist --project-name=humeka-tv
```

**Cloudflare Pages settings:**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables (Settings → Environment variables): `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY` — same values as `.env`.

`public/_redirects` is already included so routes like `/publisher` and
`/watch/abc123` work correctly on refresh instead of 404ing (Cloudflare Pages
reads this automatically — no extra config needed).

## How the publisher panel maps to the public site

| Publisher panel action                       | Where it shows up publicly                          |
| ---------------------------------------------- | ----------------------------------------------------- |
| Add/sync a video, status "Published"          | Homepage grid + its own watch page                   |
| Mark a video "Featured"                       | Large banner at the top of the homepage               |
| Unpublish a video                             | Disappears from the public site (kept as a draft)     |
| Publish a post                                | News & Announcements page                             |
| Pin a post                                    | Sorted to the top of the News page                    |
| Site settings → logo / tagline / social links | Header, footer, about page                            |
| Site settings → "Show ticker" / "Show posts"  | Toggles the scrolling ticker and News nav link         |

Everything is gated by Supabase Authentication: only someone signed in with a
publisher account can change data. Everyone else gets read-only access to
published content.

## Project structure

```
src/
  components/                 shared UI (header, footer, video card, post card, ticker)
  lib/                        Supabase client, auth context, site settings hook
  pages/                      public site pages
  publisher/                  password-protected publisher panel pages
supabase/
  schema.sql                  run once in the Supabase SQL editor
  cron.sql                    optional: schedules the hourly sync via SQL
  functions/sync-youtube/     Edge Function — pulls new uploads, called manually or by cron
public/
  _redirects                  Cloudflare Pages SPA routing fallback
```

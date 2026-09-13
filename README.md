# FMA Motoshop — OMS + WMS + POS Starter

Minimal Next.js dashboard connected to your Supabase project. Right now it does:

- Login (Supabase Auth)
- Warehouse dashboard: shows live stock per product/location, flags low stock
  (red, based on each product's `reorder_point`), and has quick **+In / −Out**
  buttons that call your `adjust_inventory()` Supabase function

This is intentionally a starting skeleton — POS checkout, receiving screens,
and Excel import come next.

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local
```

Open `.env.local` and fill in your real values from
**Supabase → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then run it:

```bash
npm run dev
```

Visit `http://localhost:3000` — it'll send you to `/login`. Log in with the
account you created in Supabase Authentication (the one you used for
`seed.sql`).

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial FMA Motoshop dashboard"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/fma-motoshop.git
git branch -M main
git push -u origin main
```

## 3. Deploy to Vercel (free)

1. Go to vercel.com → **Add New Project** → import your GitHub repo
2. In the setup screen, add the same two environment variables
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Click **Deploy**

You'll get a live URL like `fma-motoshop.vercel.app`.

## 4. Install it on your phone (PWA)

Open the deployed URL on your Android or iPhone browser, then:
- **Android (Chrome):** menu → "Add to Home screen"
- **iPhone (Safari):** Share button → "Add to Home Screen"

It'll behave like a normal app icon. Offline support and a proper POS/checkout
screen come in the next build step.

## Project structure

```
app/
  page.js           -> redirects to /login or /dashboard
  login/page.js      -> Supabase Auth login form
  dashboard/page.js  -> live stock table + quick adjust buttons
lib/
  supabaseClient.js -> Supabase client setup
public/
  manifest.json     -> PWA config
```

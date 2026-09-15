# Deploying to SiteGround

This project is a Vite + React SPA with a small PHP/MySQL backend for
email and quote/booking submissions. GitHub is the single source of
truth; `dist/` is a **build artifact** generated on demand — it is not
committed to git (see `.gitignore`). You build it locally (or in CI) and
upload its contents to SiteGround.

> Do not upload the entire project source code to `public_html`. Upload
> only the **contents** of `dist/` after running the build below.

## STEP 1 — Install dependencies

```
bun install
```

(`npm install` also works if you don't have Bun.)

## STEP 2 — Build for production

```
bun run build
```

This runs `vite build` and produces a self-contained `dist/` folder.
Vite copies everything in `public/` into `dist/` as-is (preserving paths)
alongside the compiled `index.html`/`assets/`, so the PHP backend ships
together with the frontend build automatically — no manual file copying
needed.

## STEP 3 — Open `dist/`

After the build, `dist/` contains everything required to run the site:

```
dist/
├── index.html
├── assets/                  (hashed JS/CSS/images from the build)
├── favicon.ico, favicon.png, og-image.jpg, robots.txt
├── .htaccess                 (Apache SPA fallback + static caching)
├── send-form.php             (Request Service form endpoint)
├── send-quote.php            (Instant Quote / WhatsApp widget endpoint)
├── send-inspection.php       (Annual Inspection booking endpoint)
├── inc/
│   ├── .htaccess              (blocks direct HTTP access to this folder)
│   ├── .env.example           (placeholders only — copy to .env, see Step 5)
│   ├── env.php, mail.php, db.php, dates.php, email_templates.php
├── admin/
│   └── inspections.php        (password-protected bookings admin panel)
└── cron/
    └── send-reminders.php     (inspection reminder cron script)
```

There is no `videos/` folder unless you've added a real
`hero-background.mp4` under `public/videos/` before building — the hero
section gracefully falls back to its static image when the video is
absent, so this is optional (see Step 6).

## STEP 4 — Upload to SiteGround

In SiteGround Site Tools → **File Manager** (or via FTP/SFTP), upload the
**contents** of `dist/` directly into `public_html/` — i.e. `index.html`
and `assets/` should sit directly inside `public_html/`, not inside a
`public_html/dist/` subfolder.

## STEP 5 — Configure server-side secrets

The PHP backend reads configuration from `public_html/inc/.env`, which is
**never** committed to git and is **not** produced by the build (the
repo's `public/inc/.env` doesn't exist locally either — only
`.env.example` does, and that's what gets copied into `dist/inc/`).

On SiteGround, after uploading `dist/`'s contents:

1. Open File Manager, navigate to `public_html/inc/`.
2. Duplicate `.env.example` and rename the copy to `.env`.
3. Fill in real values (do this directly on the server — never in git):

   ```
   DB_HOST=localhost
   DB_NAME=<your SiteGround MySQL database>
   DB_USER=<your SiteGround MySQL user>
   DB_PASS=<your SiteGround MySQL password>

   BUSINESS_TIMEZONE=America/Toronto
   TO_EMAIL=info@gstruckrepair.ca
   FROM_EMAIL=info@gstruckrepair.ca
   MAIL_DRIVER=php_mail

   CRON_SECRET=<generate a long random string>
   ADMIN_PASSWORD_HASH=<bcrypt hash, see comment in the file>
   ```

4. `inc/.htaccess` (already deployed) blocks all direct HTTP requests to
   `inc/`, so `.env` is never publicly reachable even though it lives
   inside `public_html/` — PHP's own `require` calls can still read it.
5. If the Annual Inspection booking / reminder features are in use,
   create the database and run `sql/schema.sql` once against it (via
   phpMyAdmin in Site Tools).

## STEP 6 — (Optional) Add the hero background video

The hero section references `/videos/hero-background.mp4`. If you have
a final video, place it at `public/videos/hero-background.mp4` in the
repo **before** running `bun run build` — Vite will then include it in
`dist/videos/` automatically. If it's absent, the hero simply shows its
existing static image; nothing breaks either way.

## STEP 7 — Verify on SiteGround

After upload, check:

- Homepage loads at `https://YOUR-DOMAIN/`
- Navigation between pages (e.g. `/areas`, `/fleet`, `/contact`) works,
  including a hard refresh on a nested route (tests `.htaccess` fallback)
- Hero section renders (video or fallback image, no layout shift)
- Instant Quote service/where/when selection and bay-booking date/time
  picker work
- "Get Quote on WhatsApp" opens WhatsApp with the correct message and no
  price
- Contact / Request Service form submits successfully
  (`POST /send-form.php`)
- Instant Quote submits successfully (`POST /send-quote.php`)
- Service Areas page lists the GTA cities

## Notes

- **No Node/Bun runtime is required on SiteGround.** The frontend is
  fully pre-built into static files; only PHP (already standard on
  SiteGround shared hosting) is needed at runtime.
- **This does not affect the existing Hostinger deployment.** The same
  repository, the same `bun run build`, and the same `dist/` output work
  identically there — nothing Hostinger-specific was removed.
- `dist/` is intentionally git-ignored. Each environment (Hostinger,
  SiteGround) gets its **own** `dist/` build and its **own** `inc/.env`
  with host-specific database credentials — never share one `.env`
  between environments.

# Deploying to Namecheap shared hosting (Stellar Plus)

The site is built on your computer and uploaded as one archive. The host only runs it:
nothing is built or installed there, because shared hosting limits the memory and
processes a build needs.

The database stays on Neon. The site reaches it over port 443, like any HTTPS request.

## What ends up on the server

```
/home/<cpanel user>/bslctr/     the application root: in your home folder, NOT in public_html
    app.js                      startup file (from the archive)
    bundle/                     the built site (from the archive, replaced on every deploy)
    .env                        settings and secrets (you upload this once)
    uploads/                    files added from the dashboard (created by the site)
```

`.env` and `uploads/` sit beside `bundle/`, not inside it, so a redeploy cannot delete them.
`uploads/` also holds a hidden file, `.session-cutoffs.json`: the record of when each admin
last signed out. Leave it with the uploads; without it, a signed-out session works again
until it expires.

## 1. Build the archive

```bash
npm run build:namecheap
```

Stop `npm run dev` first: the build and the dev server both write to `.next`.

This writes `dist/bslctr-namecheap.tar.gz` (about 20 MB). To check it before uploading,
run `npm start` and open http://localhost:3000: that serves the same files the host will.

Pages that do not change per request are baked in at build time, so rebuild and redeploy
after a code change. Content edited in the dashboard does not need a redeploy.

## 2. First deploy

1. **Make sure the domain opens on `https://`.** The plan includes an SSL certificate,
   installed from cPanel. The admin session cookie is only sent over HTTPS, so the
   dashboard login does not work on plain `http://`.
2. **Upload the archive.** cPanel → File Manager → in your home folder (the one that
   contains `public_html`, not `public_html` itself) create a folder named `bslctr`. Open
   it, upload `dist/bslctr-namecheap.tar.gz`, select the file and choose Extract. The
   folder now holds `app.js` and `bundle/`.
3. **Upload the settings.** In File Manager → Settings, tick "Show Hidden Files". Upload
   your `.env` into `bslctr`, beside `app.js`. It needs `DATABASE_URL`, `ADMIN_CREDENTIALS`
   and `ADMIN_SESSION_SECRET` (see `.env.example`).
4. **Create the app.** cPanel → Setup Node.js App → Create Application:

   | Field | Value |
   |---|---|
   | Node.js version | 20 (what the bundle is tested on; 22 and 24 also meet the requirement) |
   | Application mode | Production |
   | Application root | `bslctr` |
   | Application URL | your domain |
   | Application startup file | `app.js` |

5. **Do not click "Run NPM Install".** The bundle carries its own `node_modules`; there is
   nothing to install.
6. **Start the app** from Setup Node.js App, then open the site.

If the home page shows an empty or default page, delete any `index.html` or `index.php`
that the host left in `public_html`: a file there is served in place of the site.

## 3. Later deploys

1. `npm run build:namecheap`
2. In File Manager, delete `bslctr/bundle`.
3. Upload the new archive into `bslctr` and extract it.
4. Restart the app in Setup Node.js App.

Leave `.env` and `uploads/` alone.

## If the site does not start

Errors from the app are normally written to `bslctr/stderr.log`.

- **"This site needs Node.js 20.19 or newer"**: pick a newer version in Setup Node.js App.
- **An error page in place of the site**: read the log. A `.env` in the wrong folder or a
  missing `ADMIN_SESSION_SECRET` shows up there.
- **Pages load but photos, guidelines or lists say they could not load**: the site cannot
  reach the database. Check `DATABASE_URL` in `bslctr/.env`.
- **Styles or pictures are missing**: the archive was extracted somewhere else. `bundle/`
  must be directly inside `bslctr`, with `bundle/.next/static` and `bundle/public` in it.
- **The first visit after a quiet spell is slow**: the host stops an idle app and starts it
  again on the next request.

## Limits of this host

- Large gallery videos may not upload. The dashboard allows up to 2 GB, but shared hosting
  limits how long and how large a request can be. Link a YouTube video instead of
  uploading a big file.
- Failed-login throttling lives in the memory of one process, so it resets whenever the
  host restarts the app.

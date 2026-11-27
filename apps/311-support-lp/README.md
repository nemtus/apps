# 311-support-lp

NEMTUS **3.11 Great East Japan Earthquake reconstruction-support donation project** site,
served at <https://311-support.nemtus.com>.

The site used to run on WordPress + Elementor on a rental server. It was re-implemented here as
plain HTML and CSS with one small script, keeping the original look and every public URL. It is
an assets-only Cloudflare Worker: no build step and no dependencies.

## Pages

| URL                                    | File                                  | Stylesheet  |
| -------------------------------------- | ------------------------------------- | ----------- |
| `/`                                    | `public/index.html`                   | `top.css`   |
| `/en/`                                 | `public/en/index.html`                | `top.css`   |
| `/front/揮毫/` (calligraphy event)     | `public/front/揮毫/index.html`        | `kigou.css` |
| `/en/kigou-event/`                     | `public/en/kigou-event/index.html`    | `kigou.css` |
| `/front/桜繋ぎ/` (blockchain art)      | `public/front/桜繋ぎ/index.html`      | `sakura.css`|
| `/en/sakura-weaving/`                  | `public/en/sakura-weaving/index.html` | `sakura.css`|
| anything else                          | `public/404.html`                     | inline      |

The two Japanese project pages keep their Japanese-slug URLs, so the directory names under
`public/front/` are Japanese. Cloudflare serves them for both the percent-encoded and the
literal form of the URL (lower-case percent-encoding gets a redirect to the upper-case form).

`public/_redirects` keeps old WordPress URLs working: the JP project pages were also linked at
the site root (`/揮毫/`, `/桜繋ぎ/`), and `/front/` itself redirected to `/`.
Old image URLs under `/wp-content/uploads/` redirect to the same file under `/assets/img/`.

### OGP images

`og:image` / `twitter:image` keep the exact URLs the WordPress site used
(`https://311-support.nemtus.com/wp-content/uploads/2021/03/...`), and the files are served
from that path. Crawlers only fetch `og:image` from the absolute URL, so this keeps share cards
working in both migration phases: before the cut-over the old server still answers that URL,
afterwards this Worker does. Because `_redirects` takes precedence over static files, the
`2021/03` redirects are listed file by file and leave these six out; keep it that way.

## Layout

```
public/
  index.html, en/, front/   the six pages (see above)
  404.html                  not-found page (the WordPress theme's default look)
  _redirects                old WordPress URLs → canonical pages
  assets/css/common.css     base styles + components shared by every page
  assets/css/{top,kigou,sakura}.css   per-page layout
  assets/js/main.js         entrance animations, scroll-to-top, carousel autoplay
  assets/img/               images, under their original WordPress file names
  wp-content/uploads/2021/03/   the six OGP images, at their original WordPress URLs
wrangler.toml               Cloudflare Workers (Static Assets) configuration
```

Everything works without JavaScript: `main.js` only adds the scroll-in animations, the
scroll-to-top button behaviour and carousel autoplay. The hero background slideshow is pure CSS.

Breakpoints follow the original Elementor site: desktop ≥ 1025px, tablet 768–1024px,
mobile ≤ 767px.

### Behaviour kept from the original on purpose

- The "ＮＥＭで寄付をする / Donate with NEM" buttons and the Telegram icon link to `#`. On the
  WordPress site they were meant to open modals whose content no longer existed, so clicking
  them did nothing; the static site behaves the same way. Give them a real target if one
  exists.
- The JP "日本円で寄付をする" buttons also link to `#` (the EN pages link to Congrant), exactly as
  on the original.
- The Google Analytics tag was dropped: it was a Universal Analytics (`UA-`) property, which no
  longer collects data.

## Local preview

```bash
npx --yes wrangler@4 dev                  # http://localhost:8787 (honours _redirects, 404.html)
npx --yes wrangler@4 deploy --dry-run     # validate the configuration and assets only
```

## Deployment

Cloudflare Workers Builds (Git integration) deploys this site; no Cloudflare token is stored in
GitHub. The dashboard settings are listed at the top of `wrangler.toml`.

- Pull request → preview URL, commented on the PR by Cloudflare
- Merge to `main` → production on <https://311-support.nemtus.com>

### Migration from the rental server (two phases)

**Phase 1 — workers.dev only (done).** `wrangler.toml` had `workers_dev = true` and no
`routes`, so the site was served at `https://nemtus-311-support-lp.<account-subdomain>.workers.dev`
while the WordPress site kept serving `311-support.nemtus.com`. Nothing in DNS changed.

1. Create the Worker in the Cloudflare dashboard with the Workers Builds settings from
   `wrangler.toml` (the Worker name must be `nemtus-311-support-lp`).
2. Merge to `main`; the build deploys to the workers.dev URL. Review it there.

**Phase 2 — switch the domain (current configuration).** Cloudflare refuses to create a
Custom Domain on top of an existing DNS record, so:

1. In the `nemtus.com` zone, delete the `A` record for `311-support` (it points at the rental
   server). The hostname stops resolving until step 3 finishes, so do steps 1–3 together.
2. Merge the PR that adds `routes` and sets `workers_dev = false` in `wrangler.toml`.
3. The deploy attaches the domain and Cloudflare issues the certificate; the site is reachable
   within a few minutes.
4. Cancel the WordPress hosting once the new site is confirmed.

### `www.311-support.nemtus.com`

The WordPress server redirected `www.311-support.nemtus.com` to the bare hostname, and that URL
keeps working the same way:

- `wrangler.toml` attaches it as a second Custom Domain, so Cloudflare creates its DNS record
  and issues a certificate for it. The zone's `*.nemtus.com` certificate does not cover a
  second-level subdomain like this one.
- A zone-wide **Single Redirect** rule in the `nemtus.com` zone (Rules → Redirect Rules), which
  runs before the Worker, sends it to the bare hostname. It was created from the "Redirect from
  WWW to root" template and covers every proxied `www.*` hostname in the zone, not only this one:
  - Request URL (wildcard pattern): `https://www.*`
  - Target URL: `https://${1}`, status `301`
  - **Preserve query string** off (the template default). The pattern is matched against the
    full URL, so `${1}` already holds the path and the query string:
    `https://www.311-support.nemtus.com/en/?a=1` → `https://311-support.nemtus.com/en/?a=1`.
- The rule is dashboard configuration, not part of this repository. Without it, the `www`
  hostname would serve the same pages (their canonical URL still points at the bare hostname).
- The pattern matches `https://` only, and **Always Use HTTPS** is deliberately off for the
  zone, because some blockchain nodes under `nemtus.com` must stay reachable over plain HTTP.
  So `http://www.311-support.nemtus.com/` is not redirected: it serves the same pages over
  HTTP, as `http://311-support.nemtus.com/` does.

As with the bare hostname, the Custom Domain cannot be created while the old `A` record for
`www.311-support` exists. Delete that record first, then deploy.

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
- Merge to `main` → production on the workers.dev URL (phase 1) or
  <https://311-support.nemtus.com> (phase 2)

### Migration from the rental server (two phases)

**Phase 1 — workers.dev only (current).** `wrangler.toml` has `workers_dev = true` and no
`routes`, so the site is served at `https://nemtus-311-support-lp.<account-subdomain>.workers.dev`
while the WordPress site keeps serving `311-support.nemtus.com`. Nothing in DNS changes.

1. Create the Worker in the Cloudflare dashboard with the Workers Builds settings from
   `wrangler.toml` (the Worker name must be `nemtus-311-support-lp`).
2. Merge to `main`; the build deploys to the workers.dev URL. Review it there.

**Phase 2 — switch the domain.** Cloudflare refuses to create a Custom Domain on top of an
existing DNS record, so:

1. In the `nemtus.com` zone, delete the `A` record for `311-support` (it points at the rental
   server). The hostname stops resolving until step 3 finishes, so do steps 1–3 together.
2. In `wrangler.toml`, uncomment `routes` and set `workers_dev = false`; merge the PR.
3. The deploy attaches the domain and Cloudflare issues the certificate; the site is reachable
   within a few minutes.
4. Cancel the WordPress hosting once the new site is confirmed.

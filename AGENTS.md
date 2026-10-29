# Repo notes for automated/dev sessions

## What this repo is
A learning/practice repo, not a framework app:
- `novacart/` — static multi-page HTML/CSS storefront (`index`, `products`, `product`, `cart` + `styles.css`). Product images are external `placehold.co` URLs.
- `HTML/`, `CSS/` — HTML/CSS practice pages.
- `Python/` — standalone scripts that only `print()` (no web server, no dependencies, no entry point).

There is no build step, no package.json and no runtime dependencies.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Single `web` service: `node:22-alpine`, repo bind-mounted at `/app`, runs `scripts/dev-server.mjs`.
- `scripts/dev-server.mjs` is a zero-dependency static dev server: it serves the repo root, answers `/` with `novacart/index.html` plus an injected `<base href="/novacart/">` (so the store's relative links work at the root URL), and injects a live-reload SSE client (`/__livereload`) that reloads pages when files change.
- Port 3000 is the preview entry point. There is no separate API, database, cache or external credential — no secrets are required.

## Gotchas
- HTML is case-sensitive on Linux: `CSS/` and `images/` are capitalized. The `HTML/*.html` pages originally linked `../css/style.css` and rendered unstyled; keep the capitalisation if you edit those links.
- Pages are separate documents (no client-side router), so an SPA `pushState` navigation does not switch pages — verification must follow real links or load each page's URL.
- `novacart/` has a horizontal-overflow issue at mobile widths (≈54px past the viewport, header/nav wrap). Pre-existing; not fixed.

## Running the Python practice scripts
There is no Python service in compose. Use a throwaway container from the repo root, e.g.:
```bash
docker run --rm -v "$PWD":/app -w /app Python python:3.13-slim python Python/Functions/main.py
```
`Python/modules/students_app/main.py` imports sibling modules, so run it from inside `Python/modules/students_app`.

## Verifying
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200 (serves the store home).
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/novacart/products.html` → 200.
- Healthcheck in compose uses `wget` against `/novacart/index.html`.

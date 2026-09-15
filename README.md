# pulse-web

The Pulse frontend: one phone-first screen that shows how every ROGUETECHNOLOGIES project is
doing, alerts Kagiso when something needs him, and lets him act from his phone. Angular 21,
SignalStore (`@ngrx/signals/events`), Netlify. Talks only to `pulse-api` (Spring Boot, Cloud Run).

The product spec and the HTTP contract live in `specs/` — `PULSE-SPEC.md` and `PULSE-CONTRACT.md`
are the source of truth; the same two files sit in `pulse-api/specs/`. The TypeScript interfaces in
the contract are copied verbatim into `src/shared/models/`.

## Run

```sh
npm install
npm start              # ng serve → http://localhost:4200, API at http://localhost:8090
npm run start:local    # same, using environment.local.ts
```

You need a `pulse-api` running on port 8090 (8081 is bookr-api). There is no mock server.

## Build configurations

| Command             | Configuration | API                                                     | Used by                                   |
| ------------------- | ------------- | ------------------------------------------------------- | ----------------------------------------- |
| `npm run build`     | `production`  | `https://pulse-api-898880840502.africa-south1.run.app`     | Netlify deploys of `main`                 |
| `npm run build:sit` | `sit`         | `https://pulse-api-sit-898880840502.africa-south1.run.app` | Netlify branch deploys of `development`   |
| `npm start`         | `development` | `http://localhost:8090`                                 | local dev                                 |
| `npm run start:local` | `local`     | `http://localhost:8090`                                 | local dev (separate file to point elsewhere) |

Environment files are in `src/environments/`. Each has three fields: `production`, `apiBaseUrl`,
`googleClientId`. `inlineCritical` is pinned off in `angular.json` because of the CSP in
`netlify.toml` — do not re-enable it.

## Quality gates

```sh
npm run build          # production build, strictTemplates — the type-check gate
npm test               # vitest unit tests (reducers, SSE parser, formatters, ConfirmSheet, BigNumber)
npm run check:secrets  # greps dist/ for every backend secret name; exits 1 on any hit
```

CI (`.github/workflows/ci.yml`) runs all three on `main` and `development`.

## Placeholders you must fill

- `googleClientId: 'REPLACE_WITH_GOOGLE_CLIENT_ID'` in every `src/environments/environment*.ts`.
  This is the PUBLIC OAuth client id, not a secret. The login page shows a coral developer note
  while it is still the placeholder.

Nothing else is configured in the frontend. Every connector credential lives in Secret Manager on
`pulse-api`; the Settings page only shows whether each one is configured.

## Google OAuth client (KAGISO ONLY)

1. Google Cloud console → APIs & Services → Credentials → Create credentials → OAuth client ID.
2. Application type **Web application**, name `pulse-web`.
3. **Authorised JavaScript origins** — add all of these:
   - `http://localhost:4200`
   - the Netlify URL of the `pulse-web` site (`https://<site>.netlify.app`), and the branch-deploy
     URL (`https://development--<site>.netlify.app`) if you use SIT sign-in
   - later, `https://pulse.rogue-tech.co.za`
4. No redirect URIs are needed (Google Identity Services uses the popup flow).
5. Copy the client id into `googleClientId` in the environment files **and** into pulse-api's
   `GOOGLE_CLIENT_ID` so the API can verify the token audience.
6. `PULSE_ALLOWED_EMAIL` on pulse-api is the one Google account that may sign in. Everyone else gets
   "That Google account isn't allowed to use Pulse."

## Netlify

`netlify.toml` publishes `dist/pulse-web/browser`, forces Node 24, redirects everything to
`index.html`, builds `development` with `npm run build:sit`, and sets the strict CSP + `noindex`
headers from the contract. Create the site, connect the repo, production branch `main`, enable
branch deploys for `development`.

## Layout

```
src/
  app/
    app.ts|html|scss        shell: top bar, project pills, range, refresh, notices, nav, Ask bar
    app.config.ts           router (component input binding), HttpClient + interceptors, service worker
    app.routes.ts           lazy pages; /login, /, /p/:slug, /prospects, /costs, /deploys, /settings, /view/:token
    core/auth/              GoogleIdentityService, AuthService, interceptors, guards
    core/services/          one HttpClient service per contract resource; AskApi streams SSE via fetch
    shell/                  project-pills, range-toggle, refresh-indicator, notices-bell, bottom-nav, ask-bar
    store/<name>State/      events · reducer · effects · facade · store (+ state) per feature
  pages/<page>/             login, all, project, prospects, costs, deploys, settings, client-view, not-found
  shared/components/        big-number, sparkline, project-card, confirm-sheet, traffic-chart, funnel-bars, …
  shared/models/            the contract interfaces, one file per resource
  shared/utils/             formatters (every number goes through these), action sentences, now()
  styles/_tokens.scss       Bookvas CI dark tokens (--pl-*)
scripts/
  check-secrets.mjs         the secret-name grep over dist/
  gen-icons.mjs             regenerates public/icons/*.png + favicon.ico (no dependencies)
```

Components talk to facades only. Every action goes through the ConfirmSheet and posts
`{ confirm: true }`. Coral appears only when something is wrong. Every number is JetBrains Mono.

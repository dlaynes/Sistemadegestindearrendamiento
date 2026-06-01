# E2E Tests (Playwright)

## Prerequisites

Install Playwright browsers (one-time):

```bash
cd frontend
npx playwright install chromium
```

## Run Tests

```bash
# Headless (CI mode)
npm run e2e

# Interactive UI mode (great for development)
npm run e2e:ui

# Headed (see the browser window)
npm run e2e:headed

# Debug mode (step through each action)
npm run e2e:debug

# View HTML report after a run
npm run e2e:report
```

## Architecture

- `playwright.config.ts` — Configures Chromium, base URL (`http://localhost:5173`), and auto-starts the Vite dev server.
- `fixtures.ts` — Shared helpers:
  - `mockApi(page, role)` — Mocks all API endpoints so no backend is required.
  - `loginAs(page, role)` — Navigates to `/login`, fills credentials, and waits for dashboard redirect.
- `*.spec.ts` — Test files organized by feature (login, dashboard, navigation).

## Mocked API

All backend calls are intercepted via `page.route()` and return static fixture data. This keeps e2e tests:
- **Fast** — no DB or Spring Boot startup needed.
- **Deterministic** — same data every run.
- **CI-friendly** — runs in any environment.

If you want to test against a real backend instead, comment out `mockApi()` calls and ensure `VITE_API_BASE_URL` points to your running backend.

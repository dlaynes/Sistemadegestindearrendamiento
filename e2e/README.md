# E2E Tests (Playwright)

## Prerequisites

Two one-time installs:

```bash
cd frontend
npm install
npx playwright install chromium   # downloads the browser binary
```

`npx playwright install` (without a browser name) installs all browsers and the
OS-level system dependencies. Use it if `npx playwright install chromium` is
not enough on your machine.

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

Run a specific slice:

```bash
# Just the BDD suite
npx playwright test e2e/features/

# One feature directory
npx playwright test e2e/features/amendments/

# The smoke suite (login + dashboard + navigation)
npx playwright test e2e/login.spec.ts e2e/dashboard.spec.ts e2e/navigation.spec.ts
```

## Architecture

```
e2e/
├── README.md                                (this file)
├── login.spec.ts                            Smoke: login + role-routing
├── dashboard.spec.ts                        Smoke: dashboard renders per role
├── navigation.spec.ts                       Smoke: sidebar links
└── features/                                BDD suite
    ├── README.md                            BDD conventions
    ├── _shared/
    │   └── fixtures.ts                      Shared `mockApi`, `loginAs` helpers
    ├── auth/
    │   ├── auth.feature                     Gherkin scenarios
    │   └── auth.spec.ts                     Playwright runner
    ├── properties/
    ├── users/
    ├── contracts/
    ├── payments/
    └── amendments/
```

- `_shared/fixtures.ts` — `mockApi(page, role)` mocks all role-aware endpoints; `loginAs(page, role)` fills the login form and waits for the role-scoped dashboard.
- `features/<area>/<area>.feature` — Gherkin spec; one Scenario per file (or, when sad paths are added, one Scenario per file under the same dir).
- `features/<area>/<area>.spec.ts` — paired Playwright runner that mirrors the Gherkin steps via `test.describe('Feature: …')` and `test('Scenario: …')` plus inline `// Given / When / Then` comments.

## Mocked API

All backend calls are intercepted via `page.route()` and return static fixture data. This keeps e2e tests:
- **Fast** — no DB or Spring Boot startup needed.
- **Deterministic** — same data every run.
- **CI-friendly** — runs in any environment.

If you want to test against a real backend instead, comment out `mockApi()` calls and ensure `VITE_API_BASE_URL` points to your running backend.

## BDD scenarios included

| Scenario | File | BPMN flow |
|---|---|---|
| Successful login for a landlord | `features/auth/auth.spec.ts` | §1 Autenticación |
| Landlord lists properties | `features/properties/properties.spec.ts` | §2 Gestión de Propiedades |
| Admin lists users | `features/users/users.spec.ts` | §3 Gestión de Usuarios |
| Landlord lists contracts | `features/contracts/contracts.spec.ts` | §4 Gestión de Contratos |
| Landlord lists payments | `features/payments/payments.spec.ts` | §5 Gestión de Pagos |
| Landlord proposes and approves a rent amendment | `features/amendments/amendments.spec.ts` | §7 Enmiendas |

Happy paths only in batch 1. Sad-path / multi-user variants are tracked as
follow-up work; each new scenario gets its own `<name>.feature` + `.spec.ts`
pair under the same feature directory.

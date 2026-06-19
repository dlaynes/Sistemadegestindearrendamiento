# BDD Features (Gherkin + Playwright)

This directory contains the project's BDD scenarios. Each use case lives in its
own subdirectory and ships as a Gherkin `.feature` file paired with a Playwright
`.spec.ts` runner.

## Layout

```
features/
├── README.md                (this file)
├── _shared/
│   └── fixtures.ts          Shared `mockApi`, `loginAs` helpers
├── auth/
│   ├── auth.feature
│   └── auth.spec.ts
├── properties/
│   ├── properties.feature
│   └── properties.spec.ts
├── users/
│   ├── users.feature
│   └── users.spec.ts
├── contracts/
│   ├── contracts.feature
│   └── contracts.spec.ts
├── payments/
│   ├── payments.feature
│   └── payments.spec.ts
└── amendments/
    ├── amendments.feature
    └── amendments.spec.ts
```

When a feature grows past a single happy-path scenario, add new scenarios as
additional `.feature` / `.spec.ts` pairs under the same directory. For example:

```
amendments/
├── propose-rent.feature                (happy)
├── propose-rent.spec.ts
├── propose-rent-while-pending.feature  (sad)
├── propose-rent-while-pending.spec.ts
├── decide-approve.feature              (happy)
├── decide-approve.spec.ts
├── decide-reject.feature               (sad)
├── decide-reject.spec.ts
├── decide-reject-too-short-note.feature (sad)
└── decide-reject-too-short-note.spec.ts
```

Messages (BPMN flow §6) is not in this batch — it requires multi-user
coordination that is awkward to mock via `page.route()`.

## Conventions

- One feature directory per major use case. Directory name is a singular noun
  (`auth/`, `amendments/`).
- Each scenario = one `.feature` + one `.spec.ts` pair, both prefixed with the
  scenario name. The spec file mirrors the Gherkin structure via
  `test.describe('Feature: …')` and `test('Scenario: …')` plus inline
  `// Given / When / Then` comments.
- All specs import from `'../_shared/fixtures'` (one level up + into `_shared/`).
- No new dependencies; the suite reuses the same Playwright infrastructure as
  the smoke suite under `e2e/`.

## Running

```bash
# All features (one run, all 6 happy paths)
npm run e2e

# Just the BDD slice
npx playwright test e2e/features/

# One feature directory
npx playwright test e2e/features/amendments/

# One scenario (by filename substring)
npx playwright test e2e/features/auth/
```

See `../README.md` for project-wide e2e instructions (prerequisites, reporters,
debug mode, etc.).

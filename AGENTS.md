# Repository Instructions

## Purpose

This repository contains the Storzy Next.js application used for the cost-optimization workshop. Keep implementation changes focused on the task provided by the workshop facilitator.

## Commands

```bash
pnpm dev                 # Start the development server
pnpm test                # Run Vitest tests
pnpm exec tsc --noEmit   # Run the TypeScript check
pnpm lint                # Run ESLint
pnpm build               # Create a production build
pnpm start               # Start the production server
```

## Architecture

- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS 4, shadcn/ui, and Radix UI primitives.
- `app/` contains routes, pages, and API handlers.
- `components/` contains application and reusable UI components.
- `lib/` contains application logic, validation, logging, data, and tests.
- `hooks/` contains reusable React hooks.
- Imports use the `@/*` alias mapped to the repository root.

## Application behavior

- Authentication and cart state are client-side and stored in `localStorage` under `currentUser` and `cart`.
- Existing API validation, operational logging, and privacy conventions must be preserved.
- Do not log credentials, search text, product content, checkout form values, or other customer-provided data.

## Change discipline

- Inspect existing code and tests before editing.
- Prefer the smallest complete implementation.
- Preserve existing sorting, cart, loading, retry, and error behavior.
- Avoid new dependencies unless genuinely necessary.
- Add or update focused tests for changed behavior.
- Report changed files, verification results, and remaining limitations.

## Workshop infrastructure

Do not modify `.agents/`, `.claude/`, `materials/`, or `workshop-results/` unless the user explicitly asks for workshop infrastructure changes. Implementation evaluation reports belong in `workshop-results/` and are ignored by Git.

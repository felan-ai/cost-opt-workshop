# Pre-Workshop Checklist

Complete these steps before the workshop. Do not start the implementation task yet.

## Tools

- [ ] Install Node.js 20.9.0 or later and confirm with `node --version`.
- [ ] Install pnpm and confirm with `pnpm --version`.
- [ ] Install and authenticate the coding agent you will use: Felan, Claude Code, or Codex.

## Repository setup

- [ ] Clone the workshop repository and enter its directory.
- [ ] Install the locked dependencies:

  ```bash
  pnpm install --frozen-lockfile
  ```

- [ ] Create the local environment file:

  ```bash
  cp .env.local.example .env.local
  ```

  PowerShell:

  ```powershell
  Copy-Item .env.local.example .env.local
  ```

## Verify the starting state

- [ ] Run the automated tests and confirm all 21 tests pass:

  ```bash
  pnpm test
  ```

- [ ] Run ESLint and confirm it completes successfully:

  ```bash
  pnpm lint
  ```

  ESLint must be provided by the repository dependencies; a global installation should not be required. If the command reports that ESLint is missing, contact the facilitator rather than changing the workshop dependencies locally.

- [ ] Run the production build and confirm it succeeds:

  ```bash
  pnpm build
  ```

- [ ] Start the development server:

  ```bash
  pnpm dev
  ```

- [ ] Open [http://localhost:3000](http://localhost:3000).
- [ ] Log in with username `test_user` and password `password`.
- [ ] Confirm the inventory displays six products.
- [ ] Stop the development server with `Ctrl+C`.

## Prepare the implementation worktrees

Create separate worktrees so the baseline and enhanced runs start from the same commit and remain available for comparison:

```bash
cd path/to/cost-opt-workshop
git worktree add ../cost-opt-workshop-baseline -b workshop/baseline main
git worktree add ../cost-opt-workshop-enhanced -b workshop/enhanced main
```

- [ ] Install dependencies and create the local environment file in the baseline worktree:

  ```bash
  cd ../cost-opt-workshop-baseline
  pnpm install --frozen-lockfile
  cp .env.local.example .env.local
  pnpm test
  ```

- [ ] Install dependencies and create the local environment file in the enhanced worktree:

  ```bash
  cd ../cost-opt-workshop-enhanced
  pnpm install --frozen-lockfile
  cp .env.local.example .env.local
  pnpm test
  ```

- [ ] Confirm both worktrees are present:

  ```bash
  cd ../cost-opt-workshop
  git worktree list
  ```

During the workshop, run implementation sessions from the corresponding worktree. Run evaluator sessions from the original `cost-opt-workshop` repository so all reports are saved together under `workshop-results/`.

## Verify the coding agent

- [ ] Start a fresh agent session from the repository root.
- [ ] Confirm the `cost-statistics` skill is available.
- [ ] Exit that session. Start a new session for the baseline implementation during the workshop.

If any check fails, resolve it before the workshop or send the failure details to the facilitator.

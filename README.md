# AI Coding Cost Optimization Workshop

This repository is the hands-on playground for the [Get More from Your AI Coding Budget](https://ai-sdlc.services/#agenda) workshop.

**When:** Thursday, November 12, 2026, 17:00–20:00 Europe/Sofia (EET, UTC+2)

**Format:** Three-hour online workshop

Participants implement the same feature twice in the Storzy application: first with a minimal coding-agent setup, then with cost-optimization techniques enabled. The two runs are evaluated using observed cost, time, token usage, verification evidence, and a shared quality rubric.

## Repository contents

| Path | Purpose |
|---|---|
| `app/`, `components/`, `lib/` | Storzy application used for the coding exercise |
| `materials/pre-workshop-checklist.md` | Setup and readiness checks to complete before the event |
| `materials/workshop-flow.md` | Step-by-step baseline, extension exercises, and enhanced workflow for Felan, Claude Code, and Codex |
| `materials/implementation-task.md` | Exact feature prompt used for both runs |
| `materials/manual-verification.md` | Five-check manual validation checklist |
| `.agents/skills/cost-statistics/` | Cost and quality evaluation skill for Felan and Codex |
| `.claude/skills/cost-statistics/` | Equivalent skill for Claude Code |
| `workshop-results/` | Locally generated reports; created when needed and ignored by Git |

The starting application intentionally does not contain the workshop's product-search feature.

## Prerequisites

- Node.js 20.9.0 or later
- pnpm
- A coding agent such as Felan, Claude Code, or Codex

## Setup

Complete the [`pre-workshop checklist`](materials/pre-workshop-checklist.md) before the event. The abbreviated setup is below.

After cloning the repository:

```bash
cd cost-opt-workshop
pnpm install
cp .env.local.example .env.local
pnpm test
```

Start the application:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with:

```text
Username: test_user
Password: password
```

## Workshop flow

The full step-by-step flow, including the extension exercises and agent-specific commands, is in [`materials/workshop-flow.md`](materials/workshop-flow.md). The summary is below.

### 1. Baseline implementation

1. Start a fresh coding-agent session with the workshop's baseline configuration.
2. Submit the prompt from [`materials/implementation-task.md`](materials/implementation-task.md) without changing it.
3. Wait for the root agent, implementation subagents, reviewers, corrections, and verification to finish.
4. Record the implementation session ID.

### 2. Baseline evaluation

Start a separate evaluator session and ask:

```text
Use the cost-statistics skill to create a baseline report for session <BASELINE_SESSION_ID>.
```

The report is saved under `workshop-results/`. The evaluator session is not part of the implementation cost.

### 3. Enhanced implementation

1. Return to a clean copy or worktree of the original starting state.
2. Enable the optimization techniques introduced during the workshop.
3. Submit the exact same implementation prompt in a fresh session.
4. Record the enhanced implementation session ID.

### 4. Final comparison

Start another evaluator session and ask:

```text
Use the cost-statistics skill to analyze enhanced session <ENHANCED_SESSION_ID> and compare it with the saved baseline report.
```

The final report compares observed statistics and workshop quality scores. It does not include estimated Prewalk or RTK savings and does not declare a single overall winner.

### 5. Manual verification

Run the five checks in [`materials/manual-verification.md`](materials/manual-verification.md) and record the result separately from the LLM-applied quality score.

## Skill discovery

The repository includes real copies of the same `cost-statistics` skill in both supported project locations:

- Felan and Codex: `.agents/skills/cost-statistics/SKILL.md`
- Claude Code: `.claude/skills/cost-statistics/SKILL.md`

Start a fresh agent session after cloning so the skill is discovered. If automatic discovery is unavailable, explicitly ask the agent to read the appropriate `SKILL.md` file.

## Verification commands

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

The prepared starting state has 21 automated tests. A production build should complete successfully before beginning the exercise.

## Environment variables

The default values in `.env.local.example` are suitable for the workshop:

```env
NEXT_PUBLIC_IMPROVED_CHECKOUT=false
NEXT_PUBLIC_ADD_TO_CART_BUG=false
CHECKOUT_PROVIDER_V2=false
POSTHOG_PROJECT_TOKEN=
POSTHOG_LOGS_ENDPOINT=https://eu.i.posthog.com/i/v1/logs
```

PostHog log delivery is optional and disabled when `POSTHOG_PROJECT_TOKEN` is empty. Never commit `.env.local` or place secrets in a `NEXT_PUBLIC_` variable.

## Privacy and demo safety

Preserve the application's operational logging contract. Logs must not contain credentials, search text, product content, checkout form values, raw cart contents, secrets, provider payloads, or raw errors.

Checkout is simulated and does not charge a payment method or persist orders. Do not enter real payment information.

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

## Claude Code participants only

Felan participants can skip this section. Felan turns the optimization extensions on and off through its own configuration; Claude Code has no equivalent switch, so the four tools are installed as standalone programs and enabled only through launch flags:

| Run | Model | RTK | Codebase Memory | Prewalk | MarkItDown |
|---|---|---|---|---|---|
| Baseline | `opus`, effort `high` | off | off | off | off |
| Enhanced | `opus`, effort `high` (Prewalk hands off to its executor) | on | on | on | on |

Do not install any of the tools into your global Claude Code configuration. Skip `rtk init -g`, `claude mcp add --scope user`, `claude plugin install`, and the Codebase Memory agent setup. Global installs would apply to the baseline run as well.

The commands below are for macOS and Linux. Windows equivalents are noted where they exist. Native Windows has not been tested for this workshop; WSL is recommended.

### Install the tools

- [ ] Confirm Claude Code 2.1.145 or later and Python 3.10 or later:

  ```bash
  claude --version
  python3 --version
  ```

- [ ] Install RTK and confirm it reports `rtk 1.1.0` or later. A different crate named `rtk` exists; if `rtk --help` does not mention token-optimized output, you have the wrong one.

  ```bash
  brew install rtk
  rtk --version
  ```

  Windows: `winget install rtk-ai.rtk`

- [ ] Install the Codebase Memory binary without its automatic agent configuration:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --skip-config
  codebase-memory-mcp --version
  ```

  Windows: download `install.ps1` as described in the [Codebase Memory README](https://github.com/DeusData/codebase-memory-mcp#quick-start) and run `.\install.ps1 --skip-config`.

  The binary is installed to `~/.local/bin`. If `codebase-memory-mcp` is not found, add that directory to your `PATH` and open a new terminal.

- [ ] Install `uv` and the MarkItDown MCP server:

  ```bash
  brew install uv
  uv tool install markitdown-mcp
  markitdown-mcp --help
  ```

  Windows: `winget install astral-sh.uv`, then the same `uv tool install` command.

- [ ] Download Prewalk 0.4.0. It is loaded only for the enhanced session and is never installed as a plugin:

  ```bash
  git clone --branch v0.4.0 --depth 1 https://github.com/TerenceLiu98/prewalk ~/.workshop-tools/prewalk
  ```

- [ ] Configure the model Prewalk hands off to after planning. Create `~/.claude/prewalk-presets.json`:

  ```json
  {
    "default": "workshop",
    "presets": {
      "workshop": {
        "description": "Workshop executor",
        "executor": "sonnet",
        "handoff_mode": "spawn",
        "require_model_routing": true,
        "max_todos": 12
      }
    }
  }
  ```

  Only Prewalk reads this file, so it does not affect the baseline run.

### Verify the baseline launch

- [ ] Start a baseline session from the baseline worktree:

  ```bash
  cd ../cost-opt-workshop-baseline
  claude --setting-sources project,local --strict-mcp-config --model opus --effort high
  ```

  `--setting-sources project,local` ignores your personal `~/.claude/settings.json`, including any hooks and plugins. `--strict-mcp-config` ignores every MCP server you registered yourself.

- [ ] Run `/mcp` and confirm no MCP servers are listed.
- [ ] Run `/hooks` and confirm no `rtk` or `codebase-memory-mcp` hooks are listed.
- [ ] Type `/prewalk` and confirm no Prewalk commands are suggested.
- [ ] Exit the session.

If something still appears, check `~/.claude/CLAUDE.md` and `~/.claude/skills/` for RTK, Codebase Memory, or Prewalk instructions left by an earlier global install. Those files load regardless of the flags above.

### Verify the enhanced launch

- [ ] Start an enhanced session from the enhanced worktree:

  ```bash
  cd ../cost-opt-workshop-enhanced
  claude --setting-sources project,local --strict-mcp-config --model opus --effort high \
    --settings materials/claude/enhanced-settings.json \
    --mcp-config materials/claude/enhanced-mcp.json \
    --plugin-dir ~/.workshop-tools/prewalk/claude-code
  ```

- [ ] Run `/mcp` and confirm `codebase-memory-mcp` and `markitdown` are both connected.
- [ ] Run `/hooks` and confirm `rtk hook claude` and `codebase-memory-mcp hook-augment` are listed.
- [ ] Type `/prewalk` and confirm the `/prewalk:prewalk` and `/prewalk:pw-go` commands are suggested.
- [ ] Ask the session to run `git status`, then confirm that `rtk gain --history` lists `rtk git status` with the current time.
- [ ] Exit the session.

RTK may print `No hook installed`. It only checks the global configuration, so the warning is expected.

If any check fails, resolve it before the workshop ( ask your agent for help ) or send the failure details to the facilitator.

# Pre-Workshop Checklist

Complete these steps before the workshop. Do not start the implementation task yet.

This checklist is the same for Felan, Claude Code, and Codex. Steps that apply to only some agents are marked **Felan**, **Claude Code**, or **Codex**.

## Tools

- [ ] Install Node.js 20.9.0 or later and confirm with `node --version`.
- [ ] Install pnpm and confirm with `pnpm --version`.
- [ ] Install and authenticate the coding agent you will use: Felan, Claude Code, or Codex.
- [ ] **Claude Code and Codex:** confirm the minimum versions required by the workshop tools, and Python 3.10 or later:

  ```bash
  claude --version     # Claude Code 2.1.145 or later
  codex --version      # Codex CLI 0.146.0 or later
  python3 --version
  ```

## Repository setup

- [ ] Clone the workshop repository and enter its directory:

  ```bash
  git clone https://github.com/felan-ai/cost-opt-workshop.git
  cd cost-opt-workshop
  ```

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

  ESLint is provided by the repository dependencies; a global installation is not required. The prepared starting state may report existing warnings, but it must finish with zero lint errors and exit successfully. If ESLint is missing or the command reports errors, contact the facilitator rather than changing the workshop dependencies locally.

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

## Prepare the optimization tools

**Felan** participants can skip this section: the four tools are built into Felan and are turned on through its configuration during the workshop.

**Claude Code and Codex:** download RTK, Codebase Memory, and MarkItDown now, but do not configure them. A downloaded program does nothing until it is configured; configuration happens during the workshop, after the baseline run, and works offline. Downloading now catches network and install problems before the workshop.

The workshop's manual Prewalk simulation is already included in the repository as an explicit-invocation skill. It does not require a plugin, marketplace, preset file, or separate installation.

The commands below are for macOS and Linux. Windows equivalents are noted where they exist. Native Windows has not been tested for this workshop; WSL is recommended.

- [ ] Install RTK and confirm it reports `rtk 1.1.0` or later. A different crate named `rtk` exists; if `rtk --help` does not mention token-optimized output, you have the wrong one. Do not run `rtk init` yet.

  ```bash
  brew install rtk
  rtk --version
  ```

  Windows: `winget install rtk-ai.rtk`

- [ ] Install the Codebase Memory binary without its agent configuration and confirm the command runs and reports a version. The workshop does not require a specific version:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --skip-config
  codebase-memory-mcp --version
  ```

  Windows: download `install.ps1` as described in the [Codebase Memory README](https://github.com/DeusData/codebase-memory-mcp#quick-start) and run `.\install.ps1 --skip-config`.

  The binary is installed to `~/.local/bin`. If `codebase-memory-mcp` is not found, add that directory to your `PATH` and open a new terminal.

  If `curl` reports `Couldn't connect to server`, retry with `curl -4`, or open the `install.sh` URL in a browser, save the file, and run `bash install.sh --skip-config`.

- [ ] Install `uv` and the MarkItDown MCP server:

  ```bash
  brew install uv
  uv tool install markitdown-mcp
  markitdown-mcp --help
  ```

  Windows: `winget install astral-sh.uv`, then the same `uv tool install` command.

  The first `markitdown-mcp --help` can take up to a minute before printing anything.

- [ ] Confirm the project-local Manual Prewalk skill files are present:

  ```bash
  test -f .claude/skills/manual-prewalk/SKILL.md
  test -f .agents/skills/manual-prewalk/SKILL.md
  ```

  Claude Code invokes it with `/manual-prewalk`; Codex invokes it with `$manual-prewalk`. The skill cannot activate automatically, and it must not be invoked during the baseline run.

## Confirm a clean starting state

The baseline runs with none of the optimization tools active. Earlier installs of these tools, or personal hooks that do the same job, would make the baseline look cheaper than it is.

- [ ] **Claude Code:** in a session, confirm none of the tools is configured:

  | Command | Must not list |
  |---|---|
  | `/mcp` | `codebase-memory-mcp`, `markitdown` |
  | `/hooks` | `rtk hook claude`, `codebase-memory-mcp hook-augment` |
  | `/plugin` | any separately installed third-party Prewalk plugin |
  | `/agents` | `codebase-memory` agents |
  | type `/codebase-memory` | the Codebase Memory skill as a suggestion |

  Then confirm your global instructions do not load RTK or Codebase Memory. Instructions do not show up in any of the commands above:

  ```bash
  grep -i -E "rtk|codebase-memory" ~/.claude/CLAUDE.md   # no output
  ```

- [ ] **Codex:** in a session, confirm none of the tools is configured:

  | Command | Must not list |
  |---|---|
  | `/mcp` | `codebase-memory-mcp`, `markitdown` |
  | `/hooks` | RTK or Codebase Memory hooks |
  | `/plugins` | any separately installed third-party Prewalk plugin |
  | `/skills`, if your Codex version has it | `codebase-memory` |

  Then confirm your global instructions do not load RTK or Codebase Memory:

  ```bash
  grep -i -E "rtk|codebase-memory" ~/.codex/AGENTS.md   # no output
  ```

- [ ] **Felan:** confirm the four `builtinExtensions` entries are set to `false`.

- [ ] If RTK, Codebase Memory, MarkItDown, or a third-party Prewalk plugin is already configured, remove it with the commands in the "After the workshop" section of [`workshop-flow.md`](workshop-flow.md) and repeat the check. Do not remove the repository's `manual-prewalk` skill; leaving it installed does not affect the baseline because it allows only explicit invocation.

- [ ] Review your personal agent configuration for hooks, plugins, or instructions that compress command output or add code context, such as other token-saving tools. Turn them off for the workshop. Hooks that do not change what the agent sees, such as status or notification hooks, can stay on.

## Verify the coding agent

- [ ] Start a fresh agent session from the repository root.
- [ ] Confirm the `cost-statistics` skill is available.
- [ ] Start a fresh Claude Code or Codex session from the enhanced worktree and confirm `manual-prewalk` is available. Do not invoke it yet.
- [ ] Exit that session. Start a new session for the baseline implementation during the workshop.

If any check fails, resolve it before the workshop (ask your agent for help) or send the failure details to the facilitator.

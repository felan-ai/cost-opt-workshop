# Pre-Workshop Checklist

Complete these steps before the workshop. Do not start the implementation task yet.

## Tools

- [ ] Install Node.js 20.9.0 or later and confirm with `node --version`.
- [ ] Install pnpm and confirm with `pnpm --version`.
- [ ] Install and authenticate the coding agent you will use: Felan, Claude Code, or Codex.

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

Felan participants can skip this section. Felan turns the optimization extensions on and off through its own configuration; Claude Code has no equivalent switch. Codebase Memory is installed globally with its full Claude Code setup and switched off for the baseline through `/mcp`; the other tools are enabled only through launch flags:

| Run | Model | RTK | Codebase Memory | Prewalk | MarkItDown |
|---|---|---|---|---|---|
| Baseline | `opus`, effort `high` | off | off | off | off |
| Enhanced | `opus`, effort `high` (Prewalk hands off to its executor) | on | on | on | on |

Codebase Memory is the only tool installed into your global Claude Code configuration (`~/.claude`): its installer adds an MCP server registration, hooks, a skill, and three agents. Do not install the other tools globally: skip `rtk init -g` and `claude plugin install`.

Both runs start with `--setting-sources project,local`, which ignores your personal `~/.claude/settings.json`, including the hooks Codebase Memory adds there and any plugins you enabled. MCP servers you registered, including Codebase Memory, still load; the baseline turns Codebase Memory off through `/mcp`. The Codebase Memory skill and agents in `~/.claude` also load in both runs. In the baseline they cannot reach the graph tools, and this is accepted.

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

- [ ] Install Codebase Memory with its full agent configuration and confirm it reports `0.12.1` or later:

  ```bash
  curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
  codebase-memory-mcp --version
  ```

  Windows: download `install.ps1` as described in the [Codebase Memory README](https://github.com/DeusData/codebase-memory-mcp#quick-start) and run `.\install.ps1`.

  The binary is installed to `~/.local/bin`. If `codebase-memory-mcp` is not found, add that directory to your `PATH` and open a new terminal. The installer also configures every other coding agent it detects (for example Codex or VS Code); remove that later with `codebase-memory-mcp uninstall`.

  If `curl` reports `Couldn't connect to server`, retry with `curl -4`, or open the `install.sh` URL in a browser, save the file, and run `bash install.sh`.

- [ ] Confirm the global Claude Code setup was created:

  ```bash
  claude mcp list
  ls ~/.claude/agents ~/.claude/skills
  ```

  `codebase-memory-mcp` should be listed as connected, and the `codebase-memory`, `codebase-memory-scout`, and `codebase-memory-auditor` agents and the `codebase-memory` skill should be present.

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
  claude --setting-sources project,local --model opus --effort high
  ```

- [ ] Run `/mcp`, select `codebase-memory-mcp`, and choose **Disable**. Claude Code remembers this for the baseline worktree, so later baseline sessions start with it off. Confirm it is shown as disabled.
- [ ] Run `/hooks` and confirm no `rtk` or `codebase-memory-mcp` hooks are listed.
- [ ] Type `/prewalk` and confirm no Prewalk commands are suggested.
- [ ] Exit the session.

The `codebase-memory` skill and agents are still listed in the baseline; that is expected. If a `codebase-memory-mcp` hook appears, confirm the session was started with `--setting-sources project,local`.

### Verify the enhanced launch

- [ ] Start an enhanced session from the enhanced worktree:

  ```bash
  cd ../cost-opt-workshop-enhanced
  claude --setting-sources project,local --model opus --effort high \
    --settings materials/claude/enhanced-settings.json \
    --mcp-config materials/claude/enhanced-mcp.json \
    --plugin-dir ~/.workshop-tools/prewalk/claude-code
  ```

  `codebase-memory-mcp` comes from the global install. `enhanced-settings.json` adds the Codebase Memory and RTK hooks that `--setting-sources project,local` skips, and `enhanced-mcp.json` adds MarkItDown.

- [ ] Run `/mcp` and confirm `codebase-memory-mcp` and `markitdown` are both connected. If `codebase-memory-mcp` is disabled, enable it there.
- [ ] Run `/hooks` and confirm `rtk hook claude` and `codebase-memory-mcp hook-augment` are listed.
- [ ] Run `/agents` and confirm the `codebase-memory`, `codebase-memory-scout`, and `codebase-memory-auditor` agents are listed.
- [ ] Type `/codebase-memory` and confirm the Codebase Memory skill is suggested.
- [ ] Type `/prewalk` and confirm the `/prewalk:prewalk` and `/prewalk:pw-go` commands are suggested.
- [ ] Ask the session to run `git status`, then confirm that `rtk gain --history` lists `rtk git status` with the current time.
- [ ] Exit the session.

RTK may print `No hook installed`. It only checks the global configuration, so the warning is expected.

If any check fails, resolve it before the workshop ( ask your agent for help ) or send the failure details to the facilitator.

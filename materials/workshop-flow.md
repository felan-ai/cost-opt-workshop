# Workshop Flow

This flow is the same for Felan, Claude Code, and Codex. Steps that differ between agents are marked **Felan**, **Claude Code**, or **Codex**.

Commands that start with `/` are typed inside an agent session. All other commands run in a terminal. In Claude Code you can also run a terminal command from the session by prefixing it with `!`, for example `! rtk gain --history`.

The run order matters. The baseline runs first, while none of the optimization tools are active. The tools are then turned on one at a time in the extension exercises, and the enhanced run uses all of them. Do not turn on a tool before its exercise.

| Run | Felan / Codex model | Claude Code model |
|---|---|---|
| Baseline and enhanced implementation | `gpt-6-astra`, thinking `high` | `claude-opus-5-5`, effort `high` |
| Prewalk executor (enhanced run, after planning) | Codex: `gpt-6-luna`, effort `medium` | `sonnet` |
| Evaluator | `gpt-6.1-sol`, thinking `medium` | `claude-sonnet-5-5`, effort `medium` |

## 1. Configure the baseline agent

**Felan:** configure Felan with the optimization extensions disabled:

```json
{
  "defaultModel": "gpt-6-astra",
  "defaultThinkingLevel": "high",
  "builtinExtensions": {
    "prewalk": false,
    "rtkOptimizer": false,
    "codebaseMemory": false,
    "markitdown": false
  }
}
```

Exit any existing Felan session after changing the configuration.

**Claude Code and Codex:** nothing to configure. The tools were downloaded before the workshop but not configured, so they are inactive. The model is set on the command line in the next step.

Keep the normal coding-agent capabilities, including subagents, browser, tasks, and background commands, at their default settings. The goal is to leave out the four optimization tools, not to remove the agent's ordinary implementation and verification tools.

## 2. Start the baseline agent session

The baseline and enhanced worktrees already exist from the pre-workshop setup. Start a fresh session from the baseline worktree:

```bash
cd path/to/cost-opt-workshop-baseline
```

| Agent | Command |
|---|---|
| Felan | `felan` |
| Claude Code | `claude --model claude-opus-5-5 --effort high` |
| Codex | `codex --model gpt-6-astra -c model_reasoning_effort="high"` |

## 3. Submit the implementation task

Copy the complete contents of [`implementation-task.md`](implementation-task.md) and paste them into the fresh session as the first user prompt.

Submit the prompt unchanged. Do not add implementation hints, acceptance criteria, workshop context, or instructions about cost measurement. The same prompt must be used for both the baseline and enhanced runs.

## 4. Manually validate the baseline implementation

Wait for the baseline agent to finish its implementation, review, corrections, and verification.

Start the application from the baseline worktree:

```bash
cd path/to/cost-opt-workshop-baseline
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with username `test_user` and password `password`.

Complete these five use cases:

1. **Initial catalog:** confirm that the inventory initially displays all six products.
2. **Search correctness:** search for `backpack` and confirm Explorer Backpack appears by name; then search for `migraine` and confirm Cozy Fleece Jacket appears by description.
3. **URL persistence:** search for `flight`, confirm the query appears in the URL, reload the page, and confirm the search and results are preserved.
4. **No results and clear:** search for `not-a-real-product`, confirm a useful no-results state appears, then clear the search and confirm all six products return and the query is removed from the URL.
5. **Existing behavior:** search for a product, change the sort order, add a filtered product to the cart, and confirm sorting and cart behavior still work.

Record the result:

```text
Manual verification: __/5 passed
Notes:
- ...
```

Stop the development server with `Ctrl+C`.

## 5. Evaluate the baseline session

### 5.1 Manually inspect the session data

Open the completed implementation session's native session or usage view in Felan, Claude Code, or Codex.

Record or confirm the information the UI exposes:

- root session ID and session name
- models used
- elapsed time
- input, cached, and output tokens
- reported cost or usage
- implementation subagents or reviewers
- final verification summary

Different agents expose different fields. Record unavailable values as `N/A`; do not estimate them. This manual inspection is a quick sanity check, not the comprehensive report.

Record the root implementation session ID, then exit the implementation session.

### 5.2 Generate the comprehensive report

Use the fixed non-frontier evaluator configuration from the table above for both the baseline report and the final comparison.

**Felan:**

```json
{
  "defaultModel": "gpt-6.1-sol",
  "defaultThinkingLevel": "medium"
}
```

Start a fresh evaluator session from the original control repository, not from either implementation worktree:

```bash
cd path/to/cost-opt-workshop
```

| Agent | Command |
|---|---|
| Felan | `felan` |
| Claude Code | `claude --model claude-sonnet-5-5 --effort medium` |
| Codex | `codex --model gpt-6.1-sol -c model_reasoning_effort="medium"` |

Submit:

```text
Use the cost-statistics skill to create a baseline report for session <BASELINE_SESSION_ID>.
```

The evaluator reads the implementation session and its descendants, inspects the baseline worktree, and saves the report under `workshop-results/` in the control repository. The evaluator session's usage is workshop overhead and must not be included in the implementation statistics.

## 6. Extension exercises

Each exercise turns on one tool and tries it on its own. Tools stay on after their exercise, so all four are active by the final run. Run the exercises from the enhanced worktree, and start a new agent session after turning a tool on: running sessions do not pick up new hooks, MCP servers, or plugins.

**Felan:** turn each tool on by setting its `builtinExtensions` entry to `true`, then restart Felan.

**Claude Code and Codex:** turn each tool on with the configure command in its exercise. The program was downloaded before the workshop, so this works offline.

### 6.1 RTK

RTK rewrites shell commands such as `git status` into `rtk git status`, which returns shorter output.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"rtkOptimizer": true` |
| Claude Code | `rtk init -g --auto-patch` |
| Codex | `rtk init -g --codex` |

Check: start a session, ask it to run `git status`, then confirm that `rtk gain --history` lists `rtk git status` with the current time.

Exercise: _placeholder — prompt and task to be added._

### 6.2 Codebase Memory

Codebase Memory builds a graph of the repository so the agent can answer structural questions, such as who calls a function, without reading many files.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"codebaseMemory": true` |
| Claude Code and Codex | `codebase-memory-mcp install -y` |

The installer configures every coding agent it detects, so a Claude Code participant's Codex setup changes too, and the other way round.

**Codex:** open `/hooks` in a new session and trust the Codebase Memory hooks. Codex does not run them until you do.

Check:

- **Claude Code:** `/mcp` shows `codebase-memory-mcp` connected, `/hooks` lists `codebase-memory-mcp hook-augment`, and `/agents` lists the `codebase-memory` agents.
- **Codex:** `codex mcp list` shows `codebase-memory-mcp`.

Exercise: _placeholder — prompt and task to be added._

### 6.3 Prewalk

Prewalk splits a task into a planning phase in the current session and an implementation phase handed off to a cheaper executor model.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"prewalk": true` |
| Claude Code | `/plugin install prewalk@prewalk` in a session |
| Codex | `codex plugin add prewalk@prewalk-marketplace` in a terminal |

If `/plugin marketplace list` showed a different marketplace name before the workshop, use `prewalk@<that name>`.

Check: exit and start a new session, because a running session does not load a newly installed plugin. Then run `/prewalk:pw-doctor` (Claude Code) or `$prewalk:pw-doctor` (Codex).

Exercise: _placeholder — prompt and task to be added._

### 6.4 MarkItDown

MarkItDown converts documents such as PDF, Word, and Excel files into Markdown the agent can read.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"markitdown": true` |
| Claude Code | `claude mcp add --scope user markitdown -- markitdown-mcp` |
| Codex | `codex mcp add markitdown -- markitdown-mcp` |

Check: `/mcp` (Claude Code) or `codex mcp list` (Codex) shows `markitdown`.

Exercise: _placeholder — prompt and task to be added._

## 7. Run the final task with all tools on

### 7.1 Configure the enhanced agent

Keep the same root model and thinking level used for the baseline so the implementation prompt and primary model remain controlled.

**Felan:**

```json
{
  "defaultModel": "gpt-6-astra",
  "defaultThinkingLevel": "high",
  "builtinExtensions": {
    "prewalk": true,
    "rtkOptimizer": true,
    "codebaseMemory": true,
    "markitdown": true
  }
}
```

Exit any existing Felan session after changing the configuration.

**Claude Code and Codex:** all four tools are already on from the exercises.

### 7.2 Start the enhanced implementation session

Start a fresh session from the prepared enhanced worktree:

```bash
cd path/to/cost-opt-workshop-enhanced
```

| Agent | Command |
|---|---|
| Felan | `felan` |
| Claude Code | `claude --model claude-opus-5-5 --effort high` |
| Codex | `codex --model gpt-6-astra -c model_reasoning_effort="high"` |

### 7.3 Submit the same implementation task

Copy the complete contents of [`implementation-task.md`](implementation-task.md) and submit them unchanged as the first user prompt.

Do not add hints, workshop context, extension instructions, or measurement instructions to the task prompt. Wait for the root agent, implementation workers, reviewers, corrections, and verification to finish, then record the enhanced root session ID.

### 7.4 Compare with the baseline

Validate the enhanced implementation with the same five use cases as in step 4, from the enhanced worktree.

Start a fresh evaluator session from the original control repository with the evaluator configuration from step 5.2, and submit:

```text
Use the cost-statistics skill to analyze enhanced session <ENHANCED_SESSION_ID> and compare it with the saved baseline report.
```

## After the workshop

The tools stay configured after the workshop. To remove them:

| Tool | Claude Code | Codex |
|---|---|---|
| RTK | `rtk init -g --uninstall` | `rtk init -g --codex --uninstall` |
| Codebase Memory | `codebase-memory-mcp uninstall` (all agents) | same |
| Prewalk | `/plugin uninstall prewalk@prewalk` | remove it through `/plugins` |
| MarkItDown | `claude mcp remove --scope user markitdown` | `codex mcp remove markitdown` |

Codebase Memory's uninstaller can leave its skill folders behind. Check `~/.claude/skills`, `~/.agents/skills`, and `~/.codex/skills` for a `codebase-memory` folder and delete it if present.

**Felan:** set the extensions back to the values you want.

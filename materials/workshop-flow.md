# Workshop Flow

This flow is the same for Felan, Claude Code, and Codex. Steps that differ between agents are marked **Felan**, **Claude Code**, or **Codex**.

The run order matters. The baseline runs first, while none of the optimization tools are active. The tools are then turned on one at a time in the extension exercises, and the enhanced run uses all of them. Do not turn on a tool before its exercise.

| Run | Felan / Codex model | Claude Code model |
|---|---|---|
| Baseline and enhanced implementation | `gpt-6-astra`, thinking `high` | `claude-opus-5-5`, effort `high` |
| Prewalk executor (Prewalk demo, and the enhanced run after planning) | `gpt-6-luna`, thinking `medium` | `sonnet` |
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

Each exercise turns on one tool and tries it on its own. Tools stay on after their exercise, so all four are active by the final run. Run the exercises from the enhanced worktree, and start a new agent session after turning a tool on: running sessions do not pick up new hooks, MCP servers, or newly discovered skills.

**Felan:** turn each tool on by setting its `builtinExtensions` entry to `true`, then restart Felan.

**Claude Code and Codex:** configure RTK, Codebase Memory, and MarkItDown with the command in each exercise. Manual Prewalk is already present as a project-local skill. The programs were downloaded before the workshop, so configuration works offline.

### 6.1 Prewalk

Prewalk separates planning from implementation so the implementation can continue on a cheaper executor model. Felan automates the transition; the Manual Prewalk skill pauses at a checkpoint so the user can switch models in the same root session.

Felan provides Prewalk as a built-in extension. For Claude Code and Codex, the repository already includes the explicit-invocation `manual-prewalk` skill; it does not require a plugin, marketplace, installation, or configuration.

| Agent | Preparation and invocation |
|---|---|
| Felan | `"prewalk": true` |
| Claude Code | No setup. Invoke it with `/manual-prewalk <implementation task>`. |
| Codex | No setup. Invoke it with `$manual-prewalk <implementation task>`. |

Check: start a fresh session from the enhanced worktree. Claude Code should suggest `/manual-prewalk`, and Codex should list `manual-prewalk` in `/skills` when that command is available. Do not invoke the skill until the enhanced implementation run.

#### Exercise: Prewalk by hand on a small bug

This exercise runs Prewalk with plain prompts, so it works the same way in every agent. It uses a small bug instead of the full task to save time, and it is not measured.

**Felan:** run this exercise before you set `"prewalk": true`, so the built-in extension does not take over. Turn it on after the exercise.

The bug: the payment form accepts the demo card only in one exact format. A card number typed with dashes, or an expiration with spaces around the slash, is rejected.

1. Start a fresh session from the enhanced worktree on the implementation model from the table at the top of this guide.

2. Send the planning prompt. The model explores, writes a short todo list, makes the first edit, and stops:

   ```text
   Plan this fix before you change any code. Explore the relevant code and tests, then write a todo list of at most five items, each with a check that proves it works. Make item 1 a small real code change that sets the direction, complete it, and run its check. Then stop and wait. Do not start item 2.

   The payment form rejects the demo card when the card number is typed with dashes, such as 4111-1111-1111-1111, or when the expiration has spaces around the slash, such as 12 / 34. Accept both formats. Keep the existing error messages for wrong values.
   ```

3. When the model stops after item 1, switch the same session to the Prewalk executor model from the table with `/model`. Do not start a new session.

4. Send the executor prompt:

   ```text
   Continue the task. Complete the remaining todo items in order and run each item's check before you move on. Do not repeat the exploration or redo item 1. When you finish, run pnpm test and pnpm lint, then list the changed files and the results.
   ```

5. Review the change in a fresh context. Start a second session from the same worktree on the implementation model, and send:

   ```text
   Review the uncommitted changes in this repository. You did not write them. The task was: the payment form rejects the demo card when the card number is typed with dashes, such as 4111-1111-1111-1111, or when the expiration has spaces around the slash, such as 12 / 34. Accept both formats, and keep the existing error messages for wrong values.

   Check that the change does this and does not break other checkout behavior. Run the relevant tests. List each problem with the file, the evidence, and a suggested fix. Do not edit files.
   ```

6. If the reviewer lists problems, return to the first session, which is still on the executor model, and send:

   ```text
   A reviewer found these problems. Fix them, then rerun pnpm test and pnpm lint:

   <paste the reviewer's findings>
   ```

7. Set the demo changes aside so the enhanced run starts from a clean worktree:

   ```bash
   git stash push --include-untracked -m prewalk-demo
   git status --short   # no output
   ```

What to notice: the frontier model only explored and made one edit. The cheaper model did the rest of the work with the files, test output, and todo list already in context. The planning prompt stays in the context after the switch, because a prompt cannot remove an earlier prompt. Felan's built-in Prewalk removes it.

### 6.2 Long sessions: context and compaction

This section does not turn on a tool. It shows where each agent reports how full the context is, when it compacts on its own, and how to compact or start fresh by hand.

Use the first session from the Prewalk exercise, the one that switched to the executor model, so there is real history to compact. If you closed it, reopen it with `/resume`. Compaction changes only the session context, not files, so the stashed demo changes do not matter here.

Undo every setting you change in this section before the final run (step 6), so the enhanced run compacts the same way as the baseline.

1. Check how full the context is.

   | Agent | Where to look |
   |---|---|
   | Claude Code | `/context` shows usage by category. |
   | Codex | The footer shows `N% context left`. `/status` shows the session's token usage. |
   | Felan | The footer shows the context percentage. `/context` shows usage by category and the free space. |

2. See when automatic compaction runs, and move it earlier.

   | Agent | Default | Compact earlier |
   |---|---|---|
   | Claude Code | Close to the model's context window. `/autocompact` without a value shows the current window. | `/autocompact 200k` saves the window for the current model in your user settings. `claude --autocompact 200k` uses it for one launch without saving it. |
   | Codex | At 90% of the model's context window. | Add `model_auto_compact_token_limit = 200000` to `~/.codex/config.toml`, or start with `codex -c model_auto_compact_token_limit=200000` for one launch. The setting can lower the limit, but never above 90% of the window. |
   | Felan | When the context comes within 16,384 tokens of the window. | Add `"compaction": { "enabled": true, "reserveTokens": <tokens> }` to `~/.felan/settings.json`, then restart Felan. The reserve is the gap left below the window, so a larger value compacts earlier: on a 400,000-token window, `200000` compacts at about 200,000 tokens. Read the window from `/context` first. A reserve close to the window makes Felan compact after every turn. |

   Felan also compacts on its own shortly before a known prompt-cache expiry, when the session is idle and the context has at least 200,000 tokens. Set `extensionConfig.sessionCompaction.compactBeforeCacheExpiry` to `false` to turn this off.

3. Compact now. Claude Code and Felan accept a focus that tells the summary what to keep:

   ```text
   /compact Keep the bug, the files you changed, the last test command and its exact result, the reviewer's findings, and what is left to do.
   ```

   **Codex:** run `/compact` without text. It does not accept a focus.

   Then check the context again as in step 1. Usage should be lower.

4. Check what survived. Send:

   ```text
   Without reading files or running commands, list the bug, the files you changed, the last test command and its exact result, any open reviewer findings, and what is left to do.
   ```

   Compare the answer with the session history above the compaction. Look for an exact error that became vague, a missing constraint, or a claim that tests pass with no test run behind it.

5. Start fresh. To carry the work over, first ask for a handoff, check it, and keep a copy:

   ```text
   Write a handoff for a new session that will continue this task. Include the goal, constraints, decisions and rejected approaches, changed files, the last test command and its exact result, and the next step. Print it here. Do not write a file.
   ```

   Then start a new session and paste the handoff as the first prompt:

   | Agent | Command |
   |---|---|
   | Claude Code | `/clear`. The previous conversation stays available in `/resume`. |
   | Codex | `/new` or `/clear` |
   | Felan | `/new` |

6. Undo the settings from step 2:

   | Agent | Undo |
   |---|---|
   | Claude Code | `/autocompact auto`. Nothing to undo if you used `--autocompact`. |
   | Codex | Remove `model_auto_compact_token_limit` from `~/.codex/config.toml`. Nothing to undo if you used `-c`. |
   | Felan | Restore `compaction.reserveTokens` in `~/.felan/settings.json` to its previous value, or remove it if you added it, then restart Felan. |

What to notice: all three agents compact on their own only when the context is close to full, long after context rot starts. Checking the context and compacting between phases is up to you.

### 6.3 RTK

RTK rewrites shell commands such as `git status` into `rtk git status`, which returns shorter output.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"rtkOptimizer": true` |
| Claude Code | `rtk init -g --auto-patch` |
| Codex | `rtk init -g --codex` |

**Codex:** answer yes if it asks to change a file. Then start a new session and open `/hooks`; Codex does not run new hooks until you trust them. Select `PreToolUse` — not `PostToolUse` or `PreModelRequest` — and press Enter. Find the entry with `Matcher: Bash` and `Command: rtk hook codex`. Confirm it is checked (`[x]`) and shows `Trust: Trusted`; otherwise use the action shown in that screen to enable and trust it.

#### Exercise: see what RTK removes

1. Before you turn RTK on, give `git status` something to report. In the enhanced worktree, run:

   ```bash
   echo "" >> README.md
   touch rtk-scratch-1.txt rtk-scratch-2.txt
   ```

2. Compare the two outputs in your terminal, not in the agent:

   ```bash
   git status
   rtk git status
   ```

   Both list the same changes. The RTK version drops the hints such as `(use "git add <file>..." to update what will be committed)`. That shorter text is what the agent would read.

3. Turn RTK on with the command from the table above. **Codex:** trust the hook as described above.

4. Start a new agent session and send:

   ```text
   Run git status and tell me which files changed.
   ```

   The agent types `git status`. The hook runs `rtk git status` instead, so the agent gets the short version.

5. Show the savings:

   ```bash
   rtk gain --history
   ```

   It lists `rtk git status` with the current time and the tokens it saved.

6. Undo the scratch changes:

   ```bash
   git checkout -- README.md
   rm rtk-scratch-1.txt rtk-scratch-2.txt
   git status --short   # no output
   ```

What to notice: the agent never asked for RTK. The hook changed the command, and the agent read the shorter output without knowing.

### 6.4 MarkItDown

MarkItDown converts documents such as PDF, Word, and Excel files into Markdown the agent can read.

Turn it on:

| Agent | Command |
|---|---|
| Felan | `"markitdown": true` |
| Claude Code | `claude mcp add --scope user markitdown -- markitdown-mcp` |
| Codex | `codex mcp add markitdown -- markitdown-mcp` |

Check: `/mcp` shows `markitdown`. **Felan:** `/markitdown` shows the status.

#### Exercise: read a Word file with and without MarkItDown

The document is `materials/agent-reading-test.docx`. It hides five facts with known answers, from the first section to the last word, so you can tell whether the agent read all of it.

1. Before you turn MarkItDown on, start a new session in the enhanced worktree and send:

   ```text
   Read materials/agent-reading-test.docx. What is the verification code word, who is the project lead, what is the total order value, when must the results be archived, and what is the last word of the document?
   ```

   Watch how the agent gets at the text. Claude Code's Read refuses binary Office files, so expect it to unzip the file or write a script, often over several turns. Then check `/context` (the footer or `/status` in Codex) and note the number.

2. Turn MarkItDown on with the command from the table above, and start a new session.

3. Send the same prompt. **Claude Code and Codex:** the agent has to choose the `convert_to_markdown` tool. If it reaches for a shell command instead, add `Use the markitdown tool.` to the prompt. **Felan:** the ordinary read converts the file on its own.

4. Check `/context` again and compare it with step 1. Compare the number of tool calls too.

The answers: `AMBER-FALCON-72`, Dr. Lorena Ipsova, EUR 6,543.50, 15 December 2026, and `pineapple`.

What to notice: the saving comes from the agent reaching a reader on the first try, not from a smaller document. A Word file is a zip of XML, so without a converter every agent improvises. MarkItDown reads only text, so a scanned page or a picture of a chart still needs the page image.

### 6.5 Codebase Memory

Codebase Memory builds a graph of the repository so the agent can answer structural questions, such as who calls a function, without reading many files.

#### Exercise: ask a structural question with and without Codebase Memory

The question only reads code, so it is fast and changes nothing. It asks for the lookups Codebase Memory is built for: a call trace, a list of callers, and test coverage. Use the same model for both sessions.

1. Ask the question without Codebase Memory. Start a new session in the enhanced worktree and send:

   ```text
   Answer without changing any files. I am about to add product search to the catalog API and need to know the conventions it must follow.

   1. Trace how the inventory page loads products: each function from the page to the API route and back, with file paths, in call order.
   2. List every call to emitOperationalLog with file:line and the event name it logs.
   3. What does GET /api/products do today when the request has query parameters?
   4. Which test files cover the catalog API and operational logging?

   Answer in at most 250 words.
   ```

   Watch how the agent explores: how many searches and file reads it makes. Then check `/context` (the footer or `/status` in Codex), note the number, record the session ID, and exit the session.

2. Install Codebase Memory:

   | Agent | Command |
   |---|---|
   | Felan | `"codebaseMemory": true` in `builtinExtensions`, then restart Felan |
   | Claude Code and Codex | `codebase-memory-mcp install -y` |

   The installer configures every coding agent it detects, so a Claude Code participant's Codex setup changes too, and the other way round.

   **Codex:** when Codex asks about the new hooks after installation, reply trust all hooks. Codex does not run new hooks until they are trusted. This trusts the two Codebase Memory hooks, both of which run `codebase-memory-mcp hook-augment`:

   - `SessionStart` with `Matcher: startup|resume|clear|compact`, which adds graph context when a session starts, resumes, clears, or compacts.
   - `SubagentStart` with `Matcher: *`, which adds graph context when a subagent starts.

   To check them later, open `/hooks`: both entries show `[x]` and `Trust: Trusted`.

3. Index the project. Start a new session in the enhanced worktree and check that Codebase Memory is connected:

   - **Claude Code:** `/mcp` shows `codebase-memory-mcp` connected, `/hooks` lists `codebase-memory-mcp hook-augment`, `/agents` lists the `codebase-memory` agents, and typing `/codebase-memory` suggests the Codebase Memory skill.
   - **Codex:** `/mcp` shows `codebase-memory-mcp`, and `/skills`, if your Codex version has it, lists `codebase-memory`.

   Then send `Index this project`. Building the graph takes a moment and happens once; afterwards the graph updates automatically when files change. Doing it in this session keeps the one-time build out of the session you measure. Exit the session when indexing is done.

4. Ask the same question with Codebase Memory. Start a new session and send the same prompt as in step 1. Watch which Codebase Memory tools the agent calls, such as `trace_path` or `search_graph`, and how many files it still reads.

5. Check `/context` again and compare it with step 1. Compare the number of tool calls too. For exact token and cost numbers, generate a cost-statistics report for each of the two sessions from the evaluator session, as in step 5.2.

6. Check both answers against the answer key below.

The answers:

1. `app/inventory/page.tsx`: `loadProducts` calls `fetch("/api/products")`. `GET` in `app/api/products/route.ts` returns `PRODUCTS` from `lib/products.ts` and logs the request. Back in the page, `parseCatalogResponse` in `lib/catalog.ts` validates the body, then `setProducts` stores the products; on failure the page sets `catalogError`.
2. Five calls: `app/api/products/route.ts:40` logs `catalog.retrieval.completed`; `app/api/checkout/route.ts:55` and `:68` log `payment.authorization.completed`; `app/api/checkout/route.ts:101` logs `checkout.request.completed`; `app/api/login/route.ts:54` logs `authentication.completed`. The function is defined in `lib/app-logger.ts:109`.
3. Any query string is rejected with status 400, outcome `invalid_request`, and the body `"Invalid catalog request."`. The request is still logged.
4. `lib/catalog-api.test.ts` and `lib/catalog-api-guardrails.test.ts` for the catalog API; `lib/app-logger.test.ts` and `lib/app-logger-configured.test.ts` for logging.

What to notice: Storzy is small, so a few searches and reads are already cheap, and the Codebase Memory tool definitions sit in the context of every call. A small or even negative saving is a valid result. Codebase Memory pays off on larger, less familiar repositories, where the agent would otherwise read many files to answer the same question.

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

**Claude Code and Codex:** RTK, Codebase Memory, and MarkItDown are configured from the exercises. Manual Prewalk is the project-local skill already included in the repository and runs only when explicitly invoked.

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

Use the complete contents of [`implementation-task.md`](implementation-task.md) without changing its task body:

| Agent | Submission |
|---|---|
| Felan | Paste the task as the first user prompt. The enabled built-in Prewalk extension manages the planning and executor handoff. |
| Claude Code | Invoke `/manual-prewalk`, passing the complete task as its argument. |
| Codex | Invoke `$manual-prewalk`, passing the complete task as its argument. |

For Claude Code and Codex, wait for the `MANUAL PREWALK PAUSED` checkpoint, switch the same root session to the executor model listed at the top of this guide, then invoke `manual-prewalk` again with `resume`. Do not start a separate implementation session.

Do not add hints, workshop context, acceptance criteria, or measurement instructions to the task body. Wait for the root agent, implementation work, review, corrections, and verification to finish, then record the enhanced root session ID.

### 7.4 Compare with the baseline

Validate the enhanced implementation with the same five use cases as in step 4, from the enhanced worktree.

Start a fresh evaluator session from the original control repository with the evaluator configuration from step 5.2, and submit:

```text
Use the cost-statistics skill to analyze enhanced session <ENHANCED_SESSION_ID> and compare it with the saved baseline report.
```

## After the workshop

The configured tools stay active after the workshop. The project-local Manual Prewalk skill remains available but inactive unless invoked. To remove the configured tools:

| Tool | Claude Code | Codex |
|---|---|---|
| RTK | `rtk init -g --uninstall` | `rtk init -g --codex --uninstall` |
| Codebase Memory | `codebase-memory-mcp uninstall` (all agents) | same |
| Manual Prewalk | No cleanup. The project-local skill is inactive unless explicitly invoked. | same |
| MarkItDown | `claude mcp remove --scope user markitdown` | `codex mcp remove markitdown` |

Codebase Memory's uninstaller can leave its skill folders behind. Check `~/.claude/skills`, `~/.agents/skills`, and `~/.codex/skills` for a `codebase-memory` folder and delete it if present.

After removing the MarkItDown MCP configuration from every agent that used it, uninstall the shared server binary once:

```bash
uv tool uninstall markitdown-mcp
```

**Felan:** set the extensions back to the values you want.

# Felan Workshop Flow

## 1. Configure the baseline agent

Before starting the baseline implementation, configure Felan with the optimization extensions disabled:

```json
{
  "builtinExtensions": {
    "prewalk": false,
    "rtkOptimizer": false,
    "codebaseMemory": false,
    "markitdown": false
  }
}
```

Keep the normal coding-agent capabilities, including subagents, browser, tasks, and background commands, at their default settings. The goal is to disable the four optimization extensions, not to remove the agent's ordinary implementation and verification tools.

For the workshop baseline used with Felan:

```json
{
  "defaultModel": "gpt-6-astra",
  "defaultThinkingLevel": "high"
}
```

After changing the configuration, exit any existing Felan session. Start the baseline session only after creating the baseline worktree below.

## 2. Start the baseline agent session

The baseline and enhanced worktrees should already exist from the pre-workshop setup. Start a fresh Felan session from the baseline worktree:

```bash
cd path/to/cost-opt-workshop-baseline
felan
```

## 3. Submit the implementation task

Copy the complete contents of [`implementation-task.md`](implementation-task.md) and paste them into the fresh Felan session as the first user prompt.

Submit the prompt unchanged. Do not add implementation hints, acceptance criteria, workshop context, or instructions about cost measurement. The same prompt must be used for both the baseline and enhanced runs.

## 4. Evaluate the baseline implementation

Wait for the baseline agent to finish its implementation, review, corrections, and verification.

### 4.1 Manually inspect the session data

Before leaving the implementation session, open the coding agent's native session or usage view. Use the corresponding console UI in Felan, Claude Code, or Codex.

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

### 4.2 Generate the comprehensive report

Use a fixed non-frontier evaluator configuration for both the baseline report and final comparison:

```json
{
  "defaultModel": "gpt-6.1-sol",
  "defaultThinkingLevel": "medium"
}
```

Start a fresh evaluator session from the original control repository, not from either implementation worktree:

```bash
cd path/to/cost-opt-workshop
felan
```

Submit:

```text
Use the cost-statistics skill to create a baseline report for session <BASELINE_SESSION_ID>.
```

The evaluator reads the implementation session and its descendants, inspects the baseline worktree, and saves the report under `workshop-results/` in the control repository. The evaluator session's usage is workshop overhead and must not be included in the implementation statistics.

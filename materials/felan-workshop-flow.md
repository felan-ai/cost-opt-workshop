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

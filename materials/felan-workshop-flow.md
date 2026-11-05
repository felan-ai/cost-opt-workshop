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

## 2. Create the baseline worktree

From the original workshop repository, create a dedicated baseline worktree:

```bash
cd path/to/cost-opt-workshop
git worktree add ../cost-opt-workshop-baseline -b workshop/baseline main

cd ../cost-opt-workshop-baseline
pnpm install --frozen-lockfile
```

Git worktrees do not share the ignored `node_modules/` directory. Run the installation before starting the measured implementation session so dependency setup is not included in the baseline time or agent activity. pnpm reuses packages from its global content store, so this should be faster than the initial repository installation.

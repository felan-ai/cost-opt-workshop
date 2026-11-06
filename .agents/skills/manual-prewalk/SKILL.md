---
name: manual-prewalk
description: Manually simulate same-session Prewalk for an implementation task. Use only when the user explicitly invokes this skill with a task or with "resume" after switching models.
argument-hint: "<implementation task | resume>"
disable-model-invocation: true
---

# Manual Prewalk

Simulate the same-session Prewalk technique without a plugin or executor subagent. The user performs the model switch; the existing root conversation, todo list, tool history, worktree, and first verified edit remain available to the executor model.

## Rules

- Run only after explicit user invocation. Never trigger implicitly.
- Stay in the root session. Do not spawn or delegate to an executor subagent.
- Do not create a separate plan document or handoff session.
- Use the host's native todo or task-list tool when available. Otherwise maintain a visible checklist in the conversation.
- Keep the task prompt, repository constraints, discoveries, todos, edits, and verification in the current conversation.
- The skill cannot run `/model`; the user must switch models manually.

## Select the phase

- If the invocation argument is `resume`, follow **Executor phase**.
- Otherwise treat the complete invocation argument as the implementation task and follow **Frontier phase**.
- If `resume` is requested without an existing Manual Prewalk checkpoint and remaining todos, stop and explain that no resumable checkpoint exists.

## Frontier phase

1. Restate the task boundary in one sentence without adding requirements.
2. Inspect the relevant entry points, tests, configuration, and existing patterns. Keep exploration focused on what the complete task requires.
3. Create a bounded todo list of no more than nine outcome-oriented implementation items. Every item must name concrete behavior or files and include a verification criterion.
4. Make item 1 a small foundational change that establishes the implementation direction. It must involve a real source mutation, not only documentation or planning.
5. Complete and verify item 1 only. Mark it completed.
6. Keep every remaining implementation item pending. Add a final `MANUAL PREWALK PAUSE` item and mark it in progress.
7. Stop immediately. Do not begin item 2, launch a reviewer, or perform broad final verification.

End with exactly this checkpoint structure:

```text
MANUAL PREWALK PAUSED

Completed first item:
- <item and verification>

Remaining items:
- <ordered remaining todos>

Next action:
1. Switch this same root session to the chosen executor with /model <executor-model>.
2. Invoke manual-prewalk again with: resume
```

## Executor phase

1. Treat the explicit `resume` invocation as confirmation that the user performed the model switch. Do not attempt to run `/model` or start another session.
2. Read the existing task, exploration, todo list, first edit, and verification from the current conversation and worktree. Do not repeat broad exploration or redo item 1.
3. Mark `MANUAL PREWALK PAUSE` completed or remove it.
4. Complete the remaining todos in order. Keep the todo list current and verify each item before moving on.
5. Preserve unrelated work and follow the repository's existing conventions.
6. Run the relevant final tests, typecheck, lint, build, and UI checks that are available and appropriate.
7. Finish with a concise summary of changed files, verification results, and remaining limitations.

## Limitations

- Previous planning instructions remain in conversation context; the resume instructions supersede them but cannot remove them.
- The model switch and resume invocation are human interventions and should be recorded in workshop evaluation.
- This workflow approximates the original same-context Prewalk technique but does not automate model selection, context pruning, checkpoint enforcement, or planner restoration.

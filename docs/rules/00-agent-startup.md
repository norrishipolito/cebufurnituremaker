# Agent Startup Rules

## Required Reading

At the start of every new chat, prompt, or implementation task, read the repository instructions and documentation before making changes.

Required sequence:

1. Read `AGENTS.md`.
2. Read every Markdown file under `docs/rules/`.
3. Read every Markdown file directly under `docs/`.
4. Read every relevant feature plan under `docs/feature/`.
5. If the task touches several areas or the scope is unclear, read all Markdown files under `docs/feature/`.

Recommended command:

```powershell
Get-ChildItem docs -Recurse -Filter *.md | Sort-Object FullName | ForEach-Object { Get-Content $_.FullName }
```

Use targeted reads only for follow-up prompts in the same chat when the relevant docs have already been read and the context is still fresh.

## Working Pattern

- Understand the current docs and code before proposing or editing.
- Research relevant current documentation and primary sources before implementing.
- Prefer official framework, platform, API, and security documentation when behavior may have changed.
- Inspect repository history, deployment evidence, or runtime behavior when they are relevant to the reported issue.
- Do not implement from assumptions or remembered platform behavior alone.
- Prefer existing local patterns over new abstractions.
- Keep changes scoped to the user request and the documented feature plan.
- If implementation changes behavior, update documentation in the same turn.
- If a bug is reported, add or update regression coverage when feasible before calling the fix complete.

## Completion Pattern

Before marking implementation work complete:

1. Confirm docs are synced.
2. Run `pnpm lint`.
3. Run `pnpm build`.
4. Run `pnpm test:e2e`, or clearly explain why it could not be run.

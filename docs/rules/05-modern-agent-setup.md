# Modern Agent Setup

## Sources Used

This repo uses a modern agent-instruction setup based on:

- AGENTS.md as the cross-agent repository instruction entrypoint: https://agents.md/
- Cursor project rules under `.cursor/rules` instead of legacy `.cursorrules`: https://docs.cursor.com/context/rules

## Repository Setup

- `AGENTS.md` is the first file an agent should read.
- `docs/rules/` stores durable project rules in normal Markdown.
- `.cursor/rules/*.mdc` mirrors the core startup rule for Cursor Agent and Inline Edit.
- Feature-specific implementation details stay in `docs/feature/`.
- Broad implementation memory stays in `docs/03-chat-implementation-summary.md`.

## Maintenance Rules

- Keep `AGENTS.md`, `docs/rules/`, and `.cursor/rules/` consistent.
- Prefer several focused rule files over one large instruction file.
- Keep rules actionable and concrete.
- When a repeated chat instruction becomes a durable project convention, add it to `docs/rules/` and reference it from `AGENTS.md`.
- Do not rely on chat memory for repository rules.


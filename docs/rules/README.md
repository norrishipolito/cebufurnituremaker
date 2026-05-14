# Rules Index

## Purpose

This directory contains standing implementation rules for AI coding agents and human maintainers working on Cebu Furniture Maker.

Read these files before planning or implementing any change:

1. `00-agent-startup.md`
2. `01-repository-standards.md`
3. `02-admin-and-content-rules.md`
4. `03-frontend-ui-rules.md`
5. `04-testing-and-documentation-rules.md`
6. `05-modern-agent-setup.md`

These rules complement, and do not replace:

- `AGENTS.md`
- `docs/00-application-architecture.md`
- `docs/01-component-architecture-rules.md`
- `docs/02-feature-implementation-rules.md`
- The relevant plan in `docs/feature/`

## Documentation Sync Rule

Whenever implementation behavior changes, update the matching docs in the same change. At minimum, check:

- `docs/rules/`
- `docs/02-feature-implementation-rules.md`
- The relevant `docs/feature/*.md`
- `docs/03-chat-implementation-summary.md` when the change affects future work broadly


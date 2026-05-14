# Testing And Documentation Rules

## Tests

- Add or update Playwright tests for admin/public behavior and edge cases.
- Every user-reported bug must receive a regression test when feasible.
- Use stable role, label, and test id selectors instead of brittle CSS selectors.
- Test public behavior after admin mutations, not only API responses.
- DB-mutating tests should avoid duplicate mobile runs when shared state would become flaky.

## Required Verification

Run before marking implementation complete:

```bash
pnpm lint
pnpm build
pnpm test:e2e
```

If one cannot be run because of environment or permission constraints, say exactly which command was not run and why.

## Documentation Sync

- Keep documentation changes in the same patch as implementation changes.
- Update feature docs when architecture, behavior, fields, routes, or tests change.
- Update `docs/03-chat-implementation-summary.md` when a decision is broad enough to affect future tasks.
- Update `docs/rules/` when a standing rule is added, removed, or clarified.
- Do not leave stale docs that contradict current behavior.

## Review Checklist

Before final response:

- Public pages still render with empty database defaults.
- Admin UI remains form-based and editor-friendly.
- APIs validate input and enforce roles.
- Tests cover the changed workflow.
- Docs match the implementation.


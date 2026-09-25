# Workflow Details for SudoCodo Agents

## When to trigger
Any file change outside `.git/` — including `src/**`, `public/**`, `*.md`, `*.json`, `*.mjs`, `*.ts`, `*.config.*`.

## Pre-PR Checklist
- [ ] `npm run build` succeeds (no type errors)
- [ ] App runs with `npm run dev` (quick visual smoke test if possible)
- [ ] Styling uses only Tailwind utilities (no raw CSS files)
- [ ] Portrait UI: canvas top + toolbox bottom on narrow viewports, no horizontal scroll
- [ ] `localStorage` progress preserved (keys: `sudocodo_*`)

## PR Body Template
```
## What
<brief>

## Why
<brief>

## Test
- [ ] npm run build passed
- [ ] Manual check on phone viewport (375px)

Closes #<issue> (if any)
```

## Branch Naming
- `feat/<name>-YYYYMMDD-HHMM`
- `fix/<name>-YYYYMMDD-HHMM`
- `chore/<name>-YYYYMMDD-HHMM`

## Merge Policy
- Squash merge only
- Delete branch immediately after merge (remote auto-deleted via `--delete-branch`, delete local with `git branch -d`)
- No direct commits to `main`

## Recovery
If PR fails checks, fix on same branch, amend/push, then merge. If push is rejected due to remote ahead, `git pull --rebase origin main` on the feature branch first.

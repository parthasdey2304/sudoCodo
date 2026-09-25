# AGENTS — SudoCodo

This file instructs any AI coding agent (OpenCode, Muse, Cursor, etc.) working in this repository.

## Project
- **Stack:** Next.js 15 (App Router) + React 19 + Tailwind CSS (no raw CSS) + TypeScript
- **Styling:** Tailwind CSS only. Do NOT add raw `.css` files except `src/app/globals.css` which contains only `@tailwind` directives. Use utility classes everywhere. Portrait-first, phone-responsive.
- **Games:** 8 routes — `/puzzle`, `/maze`, `/bird`, `/turtle`, `/movie`, `/music`, `/pond`, `/sequencing` (CodeMonkey-style). All progress is saved to `localStorage` — no auth.
- **Build:** `npm run build` must pass. Keep `npm run dev` working.

## Mandatory Git Workflow — Auto-PR + Squash Merge

> After **every** change that modifies code, docs, or config, you MUST push via a PR and squash-merge — never push directly to `main`.

### Steps (execute in order, no skipping):

1. **Verify:**
   ```bash
   git status
   git diff --stat
   git log --oneline -5
   ```

2. **Create isolated branch:**
   ```bash
   git checkout -b feat/<short-kebab>-$(date +%Y%m%d-%H%M)
   # or fix/<...>, chore/<...>
   ```

3. **Stage & commit (atomic, conventional):**
   ```bash
   git add <intended-files>
   git commit -m "feat: <what> — <why>"
   # Inspect: git diff --cached
   ```

4. **Push branch:**
   ```bash
   git push -u origin HEAD
   ```

5. **Create PR:**
   ```bash
   gh pr create --title "feat: <title>" --body "What/Why\n\n- bullet\n\nCloses #<issue> if any" --base main
   # Capture PR URL/number from output
   ```

6. **Wait for checks (if any) then squash-merge and delete branch:**
   ```bash
   gh pr merge <number> --squash --delete-branch --auto
   # or after checks: gh pr merge <number> --squash --delete-branch
   ```

7. **Sync local:**
   ```bash
   git checkout main
   git pull --ff-only origin main
   git branch -d <branch-name>   # if not already deleted remotely
   ```

### Rules
- **One PR per logical change.** No bundling unrelated changes.
- **Squash only.** Preserve linear history.
- **Delete branch** after merge (remote + local).
- **Never force-push to `main`.** If `gh` is unavailable, ask user for PAT/token.
- **Respect Tailwind-only styling** and responsive portrait UI guarantees during any change.

### Example (copy-paste)
```bash
git checkout -b feat/maze-level-11
git add src/app/maze/page.tsx
git commit -m "feat(maze): add level 11 with loop challenge"
git push -u origin HEAD
gh pr create --title "feat(maze): add level 11" --body "Adds loop challenge. Tested build passes."
gh pr merge --squash --delete-branch
git checkout main && git pull
```

This file is the source of truth for agent behavior in this repo. Keep it updated when the stack or workflow changes.

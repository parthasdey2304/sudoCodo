# .agents.md — Auto-PR + Squash Workflow

> **Instruction for any AI agent (OpenCode / Muse / Cursor / etc.) that makes a change in this repo:**

After **every** change that touches code, docs, or config:

**You MUST do GitHub PR → squash merge → delete branch. No direct push to `main`.**

## Required Sequence

```bash
# 1. Verify
git status
git diff --stat
git log --oneline -5

# 2. Isolated branch
git checkout -b feat/<kebab>-$(date +%Y%m%d-%H%M)

# 3. Stage & commit (conventional)
git add <files>
git commit -m "feat: <what> — <why>"

# 4. Push
git push -u origin HEAD

# 5. Create PR
gh pr create --title "feat: <title>" --body "What/Why bullet list" --base main

# 6. Squash merge + delete branch
gh pr merge <PR-NUMBER> --squash --delete-branch
# (use --auto if checks are pending)

# 7. Sync
git checkout main
git pull --ff-only origin main
git branch -d <branch-name>
```

## Rules

- **Tailwind CSS only** — `src/app/globals.css` holds only `@tailwind` directives. All other styling via utility classes. Keep portrait-first phone UI crisp and responsive.
- **Build must pass** before PR: `npm run build`.
- **One PR per logical change**, squash only, delete remote + local branch after merge.
- **Never force-push to `main`.**
- This folder (`.agents.md/`) and `AGENTS.md` are the canonical source of truth — if you change workflow, update both.

## Quick Copy-Paste for Agents

```bash
BRANCH="feat/$(date +%Y%m%d-%H%M)-update"
git checkout -b "$BRANCH"
git add .
git commit -m "feat: <describe change>"
git push -u origin HEAD
gh pr create --title "feat: <title>" --body "Automated PR — build passes ✅" --base main
gh pr merge --squash --delete-branch
git checkout main && git pull
```

> If `gh` is not authenticated, run `gh auth status` and request a token. Do not skip the PR step.

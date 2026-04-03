---
description: Antigravity Session End Workflow
---

@arch, wrap up this session.

# 🏁 Antigravity Session End Workflow

> **Instructions for Agent:** Execute the following steps in order. This workflow ensures that code, session context, and task history are synced to the remote repository so work can resume on another machine seamlessly.

---

### 🆔 Phase 0: Identity Verification
Before committing, ensure the commit is attributed to the correct user login.

1. **Check Git Config:** Run `git config user.name` and `git config user.email`.
2. **Handle Missing Identity:** If either is missing, do NOT commit. Instead, ask the user: *"I don't see a Git identity configured on this machine. Should I use your global config, or would you like to provide a name/email for this session?"*
3. **Verify SSH/GPG:** If the user requires signed commits, ensure the agent has access to the signing key.

---

### 🧠 Phase 1: Context Capture
Before committing, document the "mental state" of the project to help the next session start faster.

1. **Analyze Progress:** Review the terminal history and recent file changes.
2. **Update Handover Note:** Create or update `.agents/handover.md` with the following:
   - **Current Task:** [Briefly describe the active task]
   - **Last Edit:** [Which file/function was last touched]
   - **Status:** [e.g., "Compiling but tests failing" or "Feature complete, needs refactor"]
   - **Next Step:** [The exact first thing to do on the next PC]
   - **Timestamp:** $(date)

---

### 💾 Phase 2: Metadata Sync
Ensure the Agent's internal history is moved into the Git-tracked workspace.

1. **Export Session:** Run the internal command to save session history to `./docs/session_history.md`.
2. **Verify Rules:** Ensure any updates to `.agents/workspace_rules.md` are saved.

---

### 🛠️ Phase 3: Git Atomic Sync
Execute these commands in the terminal. If a merge conflict occurs, stop and alert the user immediately.

1. **Stage Changes:** `git add .`
2. **Commit Session:** `git commit -m "sync: session end $(date +'%Y-%m-%d %H:%M') [Antigravity]" `
3. **Pull & Rebase:** `git pull --rebase origin $(git branch --show-current)`
4. **Push to Remote:** `git push origin $(git branch --show-current)`

---

### 🧹 Phase 4: Environment Cleanup
Leave the workspace in a clean state for the next machine.

1. **Stop Services:** Kill any running dev servers, watchers, or background processes (e.g., `npm run dev`).
2. **Confirm Sync:** Verify that the `git push` was successful.
3. **Final Report:** Provide a summary to the user: "Session synced successfully. Handover note created. Ready for PC switch."

---

## 🚀 How to Trigger
Type the following in the Antigravity Chat:
> "Run the session_end.md workflow"
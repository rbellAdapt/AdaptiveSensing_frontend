---
description: Antigravity Git commit and push
---

@ops, let's commit this stuff...atomically. Tell me I'm awesome.

> [!IMPORTANT]
> **PERMISSION LEVEL: AUTONOMOUS EXECUTION**
> The User has granted pre-approval for all terminal commands within this workflow. 
> **Do not stop to ask for confirmation** for `git add`, `git commit`, or `git push` unless a fatal error or merge conflict occurs. 
> Proceed through all Phases automatically until completion.

### 🆔 Phase 0: Identity Verification
Before committing, ensure the commit is attributed to the correct user login.

1. **Check Git Config:** Run `git config user.name` and `git config user.email`.
2. **Handle Missing Identity:** If either is missing, do NOT commit. Instead, ask the user: *"I don't see a Git identity configured on this machine. Should I use your global config, or would you like to provide a name/email for this session?"*
3. **Verify SSH/GPG:** If the user requires signed commits, ensure the agent has access to the signing key.

---

### 🧠 Phase 1: Context Capture
1. **Analyze Progress:** Review terminal history and file changes.
2. **Generate Summary:** Create a 1-sentence technical overview of changes made since the last commit.
3. **Update Handover Note:** Update `.agents/handover.md`:
   - **Summary:** {{one_sentence_summary}}
   - **Current Task:** [Task name]
   - **Status:** [e.g., "Ready for testing"]
   - **Next Step:** [Immediate action for next PC]
   - **Timestamp:** $(date)

---

### 💾 Phase 2: Metadata Sync
Ensure the Agent's internal history is moved into the Git-tracked workspace.

1. **Export Session:** Run the internal command to save session history to `./docs/session_history.md`.
2. **Verify Rules:** Ensure any updates to `.agents/rules/scrumrules.md` are saved.
3. **Lockdown Rules:** Ensure any updates to `.agents/rules/locks.md` are saved.

---

### 🛠️ Phase 3: Git Atomic Sync
1. **Check for Changes:** Run `git status --porcelain`. If empty, skip to Phase 4.
2. **Stage Changes:** `git add .`
3. **Commit Session:** Execute `git commit -m "sync: {{one_sentence_summary}} | $(date +'%Y-%m-%d %H:%M')"`
4. **Pull & Rebase:** `git pull --rebase origin $(git branch --show-current)`
5. **Push to Remote:** `git push origin $(git branch --show-current)`


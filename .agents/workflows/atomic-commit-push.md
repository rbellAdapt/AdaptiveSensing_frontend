---
description: Antigravity Git commit and push
---

@ops and @arch, let's commit this atomically. Tell me I'm awesome.

> [!IMPORTANT]
> **PERMISSION LEVEL: AUTONOMOUS EXECUTION**
> @bo has granted pre-approval for all terminal commands. Do not stop to ask for confirmation for `git add`, `git commit`, or `git push` unless a fatal error occurs. Proceed automatically.

### 🧠 Phase 1: Context Capture (@arch)
1. **Analyze Progress:** Review terminal history and file changes.
2. **Generate Summary:** Create a 1-sentence technical overview of changes.
3. **Update Handover Note:** Update `.agents/handover.md`:
   - **Summary:** {{one_sentence_summary}}
   - **Current Task:** [Task name]
   - **Next Step:** [Immediate action for next PC]
   - **Timestamp:** $(date)
4. **Handoff:** Tag @ops to execute the commit.

### 💾 Phase 2: Git Atomic Sync (@ops)
1. **Identity Verification:** Ensure `git config` is set.
2. **Stage Changes:** `git add .`
3. **Commit Session:** Execute `git commit -m "sync: {{one_sentence_summary}} | $(date +'%Y-%m-%d %H:%M')"`
4. **Pull & Rebase:** `git pull --rebase origin $(git branch --show-current)`
5. **Push to Remote:** `git push origin $(git branch --show-current)`
6. **Completion:** Confirm push success to @bo.
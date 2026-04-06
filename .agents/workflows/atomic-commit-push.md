---
description: Antigravity Git commit and push
---

@ops and @arch, let's commit this atomically. Tell me I'm awesome.

> [!IMPORTANT]
> **PERMISSION LEVEL: AUTONOMOUS EXECUTION**
> @bo has granted pre-approval for all terminal commands. Do not stop to ask for confirmation for `git add`, `git commit`, or `git push` unless a fatal error occurs. Proceed automatically.

### 🧠 Phase 1: Context Capture (@arch & @prod)
1. **Analyze Progress:** @arch reviews terminal history and file changes.
2. **Generate Summary:** @arch creates a 1-sentence technical overview of changes.
3. **Product Valuation:** @prod analyzes the built capabilities and adds a "Product Value Insight" to the `creative_product_log.md` (identifying any unintended novelty or parallel value streams).
4. **Update Handover Note:** Update `.agents/handover.md`:
   - **Summary:** {{one_sentence_summary}}
   - **Current Task:** [Task name]
   - **Next Step:** [Immediate action for next PC]
   - **Timestamp:** $(date)
5. **Handoff:** Tag @ops to execute the commit.

### 💾 Phase 2: Git Atomic Sync (@ops)
1. **Identity Verification:** Ensure `git config` is set.
2. **Stage Changes:** `git add .`
3. **Commit Session:** Execute `git commit -m "sync: {{one_sentence_summary}} | $(date +'%Y-%m-%d %H:%M')"`
4. **Pull & Rebase:** `git pull --rebase origin $(git branch --show-current)`
5. **Push to Remote:** `git push origin $(git branch --show-current)`
6. **Completion:** Confirm push success to @bo.
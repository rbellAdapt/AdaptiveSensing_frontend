---
description: Antigravity Session End Workflow
---

@arch and @ops, wrap up this session collaboratively.

# 🏁 Antigravity Session End Workflow

> **Instructions for Agents:** Execute the following steps in order. @arch handles memory, @ops handles the repository.

---
### 🧠 Phase 1 &2: Context Capture & Memory Compression  and Git Atomic Sync
perform the /atomic-commit-push.md workflow
---

### 🧹 Phase 3: Environment Cleanup (@ops)
1. **Stop Services:** Kill any running dev servers, watchers, or background processes (e.g., `npm run dev`).
2. **Final Report:** Output: "Session synced successfully. Handover note created. Ready for PC switch."
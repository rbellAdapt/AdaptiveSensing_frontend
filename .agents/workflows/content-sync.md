---
description: Sync .agents markdown content down into the production codebase.
---

@dev and @ops, compile the decoupled writing drafts into the raw application bundle.

> [!IMPORTANT]
> **PERMISSION LEVEL: AUTONOMOUS VERIFICATION**
> @bo has explicitly instructed this workflow to isolate the `.agents` layer from the `src/` codebase. Do not import files from `.agents` directly into React components. Use the strict sync paradigm.

### 🧩 Phase 1: Markdown Compilation (@dev)
Execute the synchronization script. This sequentially parses the `.agents/content` tree and structures a minified `siteContent.json` inside the logic layer (`src/lib`).
// turbo
```powershell
node scripts/sync-content.js
```

### 🔬 Phase 2: React Structure Verification (@dev)
The frontend UI relies on strict interface typing. Ensure the newly distilled `.json` didn't break any prop drilling constraints. Run a local build test: 
// turbo
```powershell
npm run build
```

### 🚀 Phase 3: Commute Handover (@arch)
If Phase 2 clears seamlessly with 0 errors, draft the commit summary in `handover.md`, log any architectural insights to `creative_product_log.md`, and notify the user that the updated UI strings are ready to be published to Vercel via `[/atomic-commit-push]`.

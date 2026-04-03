---
description: Antigravity Session Start Workflow with Atomic Git Pull
---

@ops and @arch, we are starting a new session. @ops, pull the repo. @arch, rehydrate the memory.

# 🚀 Antigravity Session Start Workflow

> **Instructions for Agents:** Execute the following steps to re-hydrate the workspace. 

---

### 📥 Phase 1: Remote Sync (@ops)
1. **Fetch & Pull:** Execute in the terminal: `git pull --rebase origin $(git branch --show-current)`
2. **Handoff:** Verify the pull was successful and tag @arch to read the context.

---

### 🧠 Phase 2: Context Re-hydration (@arch)
Restore the "mental state" of the project.
1. **Read Handover:** Open and parse `.agents/handover.md`.
2. **Import Memory:** Load the compressed state from `./docs/session_history.md`.
3. **Internalize Goals:** Review `./docs/implementation_plan.md` for the current specs.

---

### 🛠️ Phase 3: Environment Preparation (@ops)
1. **Dependency Check:** Check for changes in `package.json`, `requirements.txt`, etc. Run installs if necessary.
2. **Start Services:** If the handover note suggests it, start the dev server.

---

### 📢 Phase 4: Ready Report (@arch)
Present a Status Report to @bo to bridge the gap between sessions:
> "Welcome back, @bo! The workspace is synced.
> **📍 Where we left off:** [Summarize 'Last Action' from handover]
> **🚧 Current Status:** [Summarize 'Status' from handover]
> **🎯 Next Recommended Step:** [State the 'Next Step' from handover]
> Should I tag the team to start the next step, or do you have a new Epic?"
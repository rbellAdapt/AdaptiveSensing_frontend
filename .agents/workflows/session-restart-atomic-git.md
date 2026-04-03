---
description: Antigravity Session Start Workflow with Atomic Git Pull
---

@team, we are starting a new session.


# 🚀 Antigravity Session Start Workflow

> **Instructions for Agent:** Execute the following steps to re-hydrate the workspace. This workflow ensures the local environment is synced with the remote repository and restores the mental context from the previous session.

---

### 📥 Phase 1: Remote Sync
Bring in the latest changes, including the code, handover notes, and session metadata.

1. **Fetch & Pull:** Execute the following in the terminal:
   `git pull --rebase origin $(git branch --show-current)`
2. **Verify Sync:** Confirm that `.agents/handover.md` and `./docs/session_history.md` have been updated.

---

### 🧠 Phase 2: Context Re-hydration
Restore the "mental state" of the project so we can pick up exactly where we left off.

1. **Read Handover:** Open and parse `.agents/handover.md`.
2. **Import Session History:** Load the state from `./docs/session_history.md` into the current active context.
3. **Read ./docs/implementation_plan.md for the current specs.
4. **Internalize Goals:** Review the "Next Step" identified in the handover note.

---

### 🛠️ Phase 3: Environment Preparation
Ensure the local machine is ready to run the code.

1. **Dependency Check:** Check for changes in `package.json`, `requirements.txt`, or `Gemfile`. If changes exist, ask the user if they'd like to run an install (e.g., `npm install`).
2. **Start Services:** If the handover note suggests it, offer to start the dev server (e.g., `npm run dev`).

---

### 📢 Phase 4: Ready to Work
Present a "Status Report" to the user to bridge the gap between sessions.

**Agent Output Template:**
> "Welcome back! I've synced the latest changes from the remote.
> 
> **📍 Where we left off:** [Summarize 'Last Action' from handover]
> **🚧 Current Status:** [Summarize 'Status' from handover]
> **🎯 Next Recommended Step:** [State the 'Next Step' from handover]
> 
> Should I start on the next step, or do you have a different priority?"

---

## 🚀 How to Trigger
Type the following in the Antigravity Chat:
> "Run the session_start.md workflow"
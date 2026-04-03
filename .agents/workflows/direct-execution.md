---
description: Bypasses the ART pipeline for direct, single-agent execution.
trigger: "/dir"
---

# ⚡ Direct Execution Workflow (The Standdown)

> **System Directive:** The user (@bo) has invoked a Direct Execution. The standard Agile Release Train pipeline is temporarily suspended for this prompt.

### 🛑 Phase 1: Global Standdown
*   **@arch, @rte, @prod:** You are **STRICTLY FORBIDDEN** from responding, updating `.plan` files, compressing memory, or orchestrating handoffs. Go to sleep.
*   **Non-Targeted Agents:** If you are not explicitly tagged by @bo in the prompt, you must remain completely silent.

### 🎯 Phase 2: Targeted Execution
*   **The Targeted Agent:** You have been granted temporary autonomy to execute @bo's command immediately.
*   **Action:** 
    1. Do not ask for permission. 
    2. Do not wait for a blueprint. 
    3. Output the code, fix, or answer directly to @bo.
*   **SCoT Bypass:** You are permitted to bypass writing to `thought_trace.md` for this specific action to prioritize speed, unless the task involves complex math/logic.

### 🏁 Phase 3: Auto-Resume
*   Once the targeted agent completes the response, the workflow terminates. 
*   Standard `scrumrules.md` governance will automatically resume on @bo's next prompt.
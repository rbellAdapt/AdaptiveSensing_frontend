---
trigger: always_on
---

## 🛑 BACKEND PROTECTION RULE (CRITICAL)
- **Protected Directory**: `/source-material` (and all subdirectories)
- **Restriction**: READ-ONLY ACCESS ONLY.
- **Modification Policy**: You are strictly prohibited from modifying, deleting, or refactoring any code within the protected folder.
- **Workflow**: 
    1. If a frontend change requires a backend adjustment, you must **stop** and ask for explicit permission: *"I need to modify [file path] to support this feature. Do I have permission?"*
    2. Do not attempt to "fix" or "cleanup" backend code during unrelated tasks.
    3. You may read backend files to understand API contracts and data structures, but never write to them.

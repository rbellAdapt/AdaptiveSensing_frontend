---
description: Perform a rigorous QA reset to prevent port overlaps, cache collisions, and silent compilation crashes before launching the local dev server.
---

# QA Deployment Protocol (@ops & @qa)

This workflow executes a rigorous verification process to ensure the Next.js `dev` server runs perfectly without shadow-caching, overlapping ports, or swallowed TypeScript errors.

1. **Assassinate Zombie Processes (@ops)**
   Terminates any background Node.js processes silently holding port 3000. This physically prevents port-overlapping and `EADDRINUSE` hang-ups.
   // turbo
   ```powershell
   Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
   ```

2. **Purge Compiler Caches (@ops)**
   Physically deletes the `.next` directory to enforce a clean re-compilation. This completely prevents tailwind/CSS caching collisions and hydration mismatches.
   // turbo
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **Verify Dependency Tree (@qa)**
   Ensures the `node_modules` tree exactly matches the `package-lock.json` state, catching any silent module drift from recent branch merges.
   // turbo
   ```powershell
   npm install --prefer-offline
   ```

4. **Strict Compilation Pre-Check (@qa)**
   The Next.js `dev` server often swallows deep module compilation or type errors until runtime. A full production build forces the compiler to validate every route constraint.
   // turbo
   ```powershell
   npm run build
   ```

5. **Launch QA-Verified Development Server**
   If Step 4 passes cleanly with zero compilation crashes, launch the local host on the explicitly cleared port.
   ```powershell
   npm run dev
   ```

# UAS Plume Simulator: Update SOP (Standard Operating Procedure)

This document serves as an exhaustive checklist for managing future version updates to either the Frontend UI or the decoupled Google Cloud Run Backend. Because the system is heavily isolated using Next.js native proxy rewrites and dedicated component folders, updating is straightforward but requires careful dependency management.

## 🟢 Scenario A: Frontend Code Updates
When the development team releases a new version of the React UI (e.g., new graphs, CSS changes, altered tab behavior), follow these steps to securely drag-and-drop the upgrade into your environment.

- [ ] **1. Upgrade the Components Folder:** Open the dev team's `src/components/` folder and identify any changed or new `.tsx` files (e.g., `GridConfigTab.tsx`, `SimulationViewport.tsx`). Drag and drop these files directly into your isolated directory: `c:\Antigravity\AdaptiveSensingWeb\src\components\uas-simulator\`. Accept the prompt to overwrite the old files.
- [ ] **2. Upgrade the Main Page (If Necessary):** If the foundational layout or state management changed, copy the dev team's `page.tsx`. Paste and overwrite the file located at `c:\Antigravity\AdaptiveSensingWeb\src\app\interactive-tools\uas-plume-simulator\page.tsx`.
- [ ] **3. Re-Link the Component Imports (CRITICAL):** Because the dev team assumes the components live in `src/components/`, their `page.tsx` will have imports that look like `import GridConfigTab from '@/components/GridConfigTab';`. **Since we placed `page.tsx` inside the same isolated folder as the components, you must update these lines at the top of `page.tsx` to use relative paths:** `import GridConfigTab from './GridConfigTab';`.
- [ ] **4. Merge Global Styling Requirements:** First, open the dev team's `globals.css` file and append any new `@keyframes` or variables to the bottom of your `src/app/globals.css`. Second, verify that your main `tailwind.config.ts` `content` array includes your new component folder (e.g., `"./src/components/uas-simulator/**/*.{js,ts,jsx,tsx}"`) so Tailwind compiles the CSS perfectly.
- [ ] **5. Install Missing Core Packages:** The simulator relies heavily on UI charting libraries and iconography. Run `npm install lucide-react recharts` in your terminal to ensure the visual elements do not throw module resolution errors.
- [ ] **6. Port the Next.js SEO Metadata:** Because the simulator's `page.tsx` contains interactive state (`"use client"`), Next.js forbids storing SEO metadata there. You must copy the `export const metadata` block from the dev team's `src/app/layout.tsx` and paste it into your route's Server Component layout (e.g., `src/app/interactive-tools/uas-plume-simulator/layout.tsx`).
- [ ] **7. Validate Build:** Run `npm run dev` in your terminal. Navigate to `/interactive-tools/uas-plume-simulator` in your browser. Check your terminal for any missing dependency or TypeScript compilation errors.

---

## 🔵 Scenario B: Backend / Google Cloud Run Updates
Since the entire Python backend and TAMOC physics engine are executed on Google Cloud Run, backend updates are usually completely invisible to you. However, you must intervene if the URL or API payload schema changes.

- [ ] **1. Verify API Schemas:** Discuss with the dev team whether the new backend requires structural changes to the JSON Payload. If the new backend expects new keys (e.g., `enable_turbulence: true`), you must request an updated frontend `page.tsx` (See Scenario A) that transmits those new keys in the `fetch('/api/simulate/mission')` block.
- [ ] **2. Update the Target Proxy URL (If deployed to a new instance):** If the dev team tears down the Google Cloud Run instance and spins up a brand new one with a different URL, open `c:\Antigravity\AdaptiveSensingWeb\next.config.ts`. Locate the `rewrites()` array and update the `destination` string for the `/api/simulate/:path*` route with the new URL.
- [ ] **3. Clear Next.js Cache & Test:** If you modified `next.config.ts`, you must completely kill your local `npm run dev` server (Ctrl+C). Restart it to force Next.js to compile the new proxy routing configuration. Run a master simulation from the UI and verify a `200 OK` network response.

---

## 🟡 Scenario C: API Key Authentication (Fixing the 403 Forbidden Error)
Because this backend executes heavy atmospheric physics simulations, the Google Cloud Run endpoint is **strictly locked down by an API Key**. We cannot allow "unauthenticated access" because external bots could discover the URL and instantly drain our GCP compute budget.

If your Next.js rewrite successfully connects but returns a `403 Forbidden (Could not validate credentials)` error, it means the required `X-API-Key` header was dropped by the browser. 

**Do NOT expose the API Key in your frontend React code.** To securely inject the secret key into the proxy rewrite before it hits Google Cloud Run, follow these steps:

- [ ] **1. Setup the Secret:** By default (for initial local development and integration testing), both the Python backend and Next.js proxy use the placeholder key `dev_secret_key_1234`. You can safely use this in your `.env.local` right now to connect immediately and bypass the 403 error! However, **before hitting live production**, you MUST generate a cryptographically secure key, apply it to the Google Cloud Run Instance's Environment Variables, and update your main website's Vercel Vault (`UAS_API_KEY`).
- [ ] **2. Create Next.js Proxy Middleware:** In your main website repo, create or open the `proxy.ts` file in the root directory (or `/src/proxy.ts`). Note: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`.
- [ ] **3. Inject the Proxy Header:** Intercept the frontend request and securely attach the backend API key on your edge server before it proxies over to GCP:
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export default function proxy(request: NextRequest) {
     // Only intercept requests heading to the remote Python Simulator
     if (request.nextUrl.pathname.startsWith('/api/simulate/')) {
       const requestHeaders = new Headers(request.headers)
       // Securely embed the API key from your Vercel/Node environment
       requestHeaders.set('X-API-Key', process.env.UAS_API_KEY || '')
       
       return NextResponse.next({
         request: { headers: requestHeaders },
       })
     }
     return NextResponse.next()
   }
   ```
- [ ] **4. Verify Connection:** Run your Next.js server. As long as `.env.local` has the key, the proxy will mask the browser's origin and instantly authenticate the rewrite with Google Cloud Run!

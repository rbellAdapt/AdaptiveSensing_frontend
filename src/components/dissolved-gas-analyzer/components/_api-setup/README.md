# Next.js API Proxy Configuration

To maintain strict security compliance, the React Component logic in this folder does not emit the `X-API-KEY` header directly from the browser. Instead, all computational payloads are internally forwarded to a Next.js Serverless Gateway (`/api/bca-calculate`), which intercepts the payload, securely injects your hidden API Key, and bridges the execution seamlessly to the backend Cloud Run service.

## Integration Instructions

1. **Move this Gateway File**
   Drag and drop the enclosed `route.ts` file into your Next.js application's native API directory at exactly:
   ```
   app/api/bca-calculate/route.ts
   ```
   *(If you are using the older Pages Router, rename the file to `calculate.ts` and place it in `pages/api/bca-calculate/`.)*

2. **Set Your Environment Variables**
   Once the proxy is placed, assign these exact variable names inside your server deployment pipeline (e.g. Vercel / Azure dashboard) or your `.env.local`:
   
   ```env
   BCA_API_URL=https://bca-dissolved-gas-calculator-720721335459.us-central1.run.app
   BCA_API_KEY=ADAPT_CLOUD_KEY_2026
   ```

Because these variables lack a `NEXT_PUBLIC_` prefix, they will remain mathematically hidden from any client-side JavaScript bundle.

---

## UI Architecture: Tab Toggling & CSS Mounting

Because these React Calculators execute an isolated `useEffect` cascade to retrieve their initial default data natively from the API exactly once upon mounting, **you must not use React conditional rendering to swap tabs!**

If your website builds a tab interface using strict React boolean short-circuit logic:
```tsx
// ❌ WRONG (Prevents background initialization)
{activeTab === 'gas' && <GasToConc />}
```
The inactive calculators will functionally not exist in the DOM, meaning they will absolutely not initialize their mathematical states until the user physically visits them!

To force all three calculators to fetch their backend defaults seamlessly in parallel the exact second your webpage opens, you must use **CSS Visibility Toggling**:
```tsx
// ✅ CORRECT (Forces simultaneous execution)
<div className={activeTab === 'gas' ? 'block' : 'hidden'}>
   <GasToConc />
</div>
```
Mounting all 3 explicitly with CSS toggle overlays (`display: none`) identically fulfills visual aesthetics while allowing the React `useEffect` engines to hydrate their results continuously in the background!

---

## Required Dependencies

Because the React Components in this directory utilize advanced visual graphing and geographic coordinate mapping, your Next.js workspace must physically install the following exact NPM packages before you attempt a production build:

```bash
npm install leaflet @types/leaflet react-leaflet plotly.js-basic-dist react-plotly.js @types/react-plotly.js
```

If these are not installed, the `LocationMap` and `ResultsTable` components will fail to compile.

---

## Troubleshooting: Vercel Compilation Artifacts

If you push the new components to Vercel but the browser still attempts to hit the backend directly (e.g., you see a `GET` request to the Cloud Run URL in the Network Inspector throwing a `404`), Vercel's Build Cache is heavily persisting older Webpack compiled chunks. 

**To resolve this immediately:**
1. Open your Vercel Dashboard and go to your **Project -> Deployments** tab.
2. Click the three dots (`...`) next to your most recent deployment.
3. Select **Redeploy**.
4. In the confirmation modal, **strictly UNCHECK** the box that says "Use existing Build Cache".
5. Click **Redeploy**.

This forces Vercel to spin up a clean node, bypass the old `.next` cache, and correctly construct the strict Next.js API Proxy routing boundaries.

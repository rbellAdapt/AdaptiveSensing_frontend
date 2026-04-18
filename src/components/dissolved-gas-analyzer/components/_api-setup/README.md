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

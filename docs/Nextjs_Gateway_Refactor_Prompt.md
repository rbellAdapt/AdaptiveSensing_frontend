# API Gateway Refactor Requirements

**Attention Next.js Backend / API Route Team:**

We have just completed a security patch on the React Client Components (`GasToConc`, `ConcToGas`, `SeawaterProperties`). Previously, these components were mistakenly modified to fetch directly from the FastAPI Python server, which required passing the `X-API-KEY` directly into the browser bundle (a severe security vulnerability).

We have refactored the frontend components back to the internal proxy architecture. The React components now send POST requests to `/api/gateway` without any secret keys.

Your team needs to update the logic inside the Next.js API Route handler (e.g., `src/app/api/gateway/route.ts` or similar) to accommodate the new payloads and endpoint routing.

### Required Changes for `/api/gateway`

1. **Proxy Injection Logic:**
   - The gateway must securely read `process.env.DG_API_KEY` from the server environment.
   - It must inject this key into the outgoing fetch request using the header: `'X-API-KEY'`.

2. **Endpoint Mapping Updates:**
   The frontend is now sending payloads shaped like `{ engine: '<engine_name>', parameters: { ... } }`. You need to map these `engine` strings to the new FastAPI endpoints:
   - `engine: 'seawater_properties'` &#8594; proxy to `/bca-seawater`
   - `engine: 'gas_mixing'` &#8594; proxy to `/bca-gas-mixing` *(Note: The endpoint was renamed from `/bca-dissgas-calculator`)*
   - `engine: 'conc_to_gas'` &#8594; proxy to `/bca-partial-pressure-calculator`

3. **Payload / Schema Changes (FYI):**
   - For `gas_mixing`, the frontend has updated keys: `moleFractions` is now `gasInputMoleFractions`. They also added a `systemType` parameter and various origin states for closed volume systems. Ensure the gateway blindly passes the `parameters` object straight through to the FastAPI edge without stripping unknown keys.

4. **Edge URL:**
   - Ensure the server-side proxy directs traffic to the true FastAPI URL, utilizing `process.env.NEXT_PUBLIC_API_URL` or whichever internal environment variable your Next.js server utilizes to define the Cloud Run instance.

Please execute these updates on the Next.js server-side route so the frontend Calculators can resume operation securely.

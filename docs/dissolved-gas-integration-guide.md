# BCA Dissolved Gas Calculators: React Porting Guide

This module (`/bca-calculators/`) contains the complete React integration of the Beaver Creek Analytical dissolved gas calculators, refactored into modular Next.js properties.

## 1. Quick Start
Drop the entire `bca-calculators` folder into your standard React/Next.js `components` (or `src/components`) directory.

Inside your target page or route, simply import the master wrapper, which encapsulates all three mathematical tools under unified internal tabs:
```tsx
import DissolvedGasSuite from '@/components/bca-calculators/DissolvedGasSuite';

export default function MyPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
       <DissolvedGasSuite />
    </div>
  )
}
```

## 2. Dependencies
Ensure the following packages are installed via `npm` or `yarn` in your global project:
- **`lucide-react`**: Standard icon library (used for the Sources modal toggle).
- **`leaflet` & `react-leaflet`**: Required for the interactive location map coordinate picker.
- **`@types/leaflet`**: Types for TypeScript.

```bash
npm install lucide-react leaflet react-leaflet
npm install -D @types/leaflet
```

## 3. Environment Variables
The module securely leverages the Next.js Edge proxy to prevent API key leakage to the browser. All requests are routed through `/api/bca-[tool]`. 

Ensure your production environment (Vercel) and backend securely share the following exact variable:
```env
DG_API_KEY=your_secure_64_byte_hash
```
*(Do NOT use `NEXT_PUBLIC_` prefixes!)*

## 4. CSS & Tailwind Integration

### Tailwind Config
We utilize a bespoke `#00E5FF` high-contrast `cyan` matching the AdaptiveSensing web brand. Ensure your `tailwind.config.ts` extends standard colors:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        cyan: '#00E5FF',
      },
    },
  },
}
```

### Global Styles Omission Warning
To ensure the `<select>` HTML elements format cleanly without ugly browser-default unreadable grey options, we used global attribute overrides. **You must** check your own global CSS to ensure standard inputs are darkened properly or explicitly inject these into your main CSS file:
```css
/* Recommend dropping into your globals.css */
select option {
  background-color: #0C1B33 !important; 
  color: white !important; 
}
```

## Need Help?
Contact the architectural team or ping `@arch` inside the repo!

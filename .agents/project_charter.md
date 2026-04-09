# 🚀 Project Charter: AdaptiveSensing.io Platform

## 1. Project Overview
*   **Mission:** To serve as the digital headquarters and high-conversion SaaS funnel for Dr. Ryan Bell's independent engineering consulting practice. The platform translates complex physical phenomena (atmospheric plumes, subsea fluid dynamics, dissolved gas chemistry) into interactive web applications, demonstrating engineering authority to capture high-value enterprise leads.
*   **Target Audience:** R&D Directors, Defense Contractors (DARPA/IARPA), Corporate Oil & Gas Executives, Environmental Agencies (NOAA), and Enterprise Engineering teams.

## 2. Tech Stack Boundaries (For @dev & @ops)
*   **Frontend:** Next.js 16 (App Router), Tailwind CSS, Plotly.js, React-Leaflet, NextAuth. Hosted on Vercel Edge Network.
*   **Backend (Decoupled):** Python, FastAPI, Docker. Hosted on Google Cloud Run.
*   **Infrastructure / Data:** Upstash Redis (Edge rate limiting), Google Sheets Webhooks (Enterprise CRM), Resend (Transactional emails).
*   **Core Architectural Constraint:** The Next.js frontend acts strictly as a UI and Edge Proxy Gateway. Proprietary physics algorithms and math models must NEVER touch the client bundle. They are isolated behind API Key-locked Google Cloud Run instances via the `proxy.ts` Edge interceptor.

## 3. SME Domain Focus (For @sme)
*   **Primary Engineering Fields:** Systems Engineering, Digital Signal Processing, Multi-Agent AI Orchestration, Hardware Integration, Atmospheric Dispersion, and Chemical Oceanography.
*   **Core Simulator Math:** TAMOC (Texas A&M Oilspill Calculator), CO2SYS/TEOS-10 (Seawater properties), Gaussian Plume Modeling, and Fickian Diffusion models.
*   **Strict Constraints:** Validate all API payload boundaries before transmission. Maintain scientific fidelity across all Plotly visualizations.

## 4. Brand Tone (For @brand & @prod)
*   **Active Styling Guide:** `docs/design/adaptive-styling-guide.md` (Read this file for all aesthetic rules).
*   **Identity:** The "Engineering-First" aesthetic. Deep carbon backgrounds, stark cyan/amber accents, sharp geometric components, and terminal-style interactions.
*   **Voice:** Academic, precise, authoritative, and direct. Treat all website copy as a technical white paper. Zero marketing fluff.
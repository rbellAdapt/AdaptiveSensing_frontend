# 🚀 Project Charter: EXAMPLE>>>>>, TAMOC Web Interface

## 1. Project Overview
*   **Mission:** EXAMPLE>>>>>, Expose the Python-based TAMOC (Texas A&M Oilspill Calculator) simulator via a modern, performant web interface without modifying the core TAMOC logic.
*   **Target Audience:** Research scientists, Corperate Oil and Gas, Environmental engineers, and marine biologists.

## 2. Tech Stack Boundaries (For @dev & @ops)
*   **Frontend:** Next.js (App Router), Tailwind CSS, Plotly.js. Hosted on Vercel (free).
*   **Backend:** Python, FastAPI. Hosted on Google Cloud Run (free).
*   **Core Logic:** EXAMPLE>>>>>, Unmodified, read-only local hard fork of `socolofs/tamoc`.

## 3. SME Domain Focus (For @sme)
*   **Primary Science:** EXAMPLE>>>>>, Marine fluid dynamics, multiphase plumes, thermodynamics, and chemical dissolution in seawater.
*   **Key Equations/Models:** EXAMPLE>>>>>, Ambient stratification profiles, buoyant plume dynamics, droplet trajectory.
*   **Strict Constraints:** EXAMPLE>>>>>, Never alter the underlying TAMOC physics engine. Only validate the API translation and parameter boundaries (e.g., Salinity, Temperature, Depth).

## 4. Brand Tone (For @brand & @prod)
*   **Active Styling Guide:** EXAMPLE>>>>>`docs/design/adaptive-styling-guide.md` (Read this file for all aesthetic rules).
*   **Voice:** Scientifically rigorous, objective, and highly professional. No marketing fluff.
# Goal Description

The primary objective is to develop a lead-generating, highly technical consulting website for AdaptiveSensing.io. The system requires a decoupled architecture with a frontend (Next.js/React) for user interaction and a secure Python/FastAPI backend to protect proprietary IP and physics models. This technical blueprint maps the requirements to the rigid workspace standards.

## User Review Required

- Confirm if Next.js vs. Vue is strictly decided, or if the development team (@dev) has discretion.
- Confirm any specific authentication strategies for "Lead Capture" to integrate into the backend infrastructure.

## Proposed Changes

---

### Frontend UI & Client Logic
Handles UI components, state, data visualization, and client-side logic. The frontend must NEVER contain proprietary algorithms.

#### [NEW] `src/frontend/package.json`
Dependencies for the application, including React, Next.js, and Plotly.js/D3.js for data visualization.
#### [NEW] `src/frontend/pages/index.tsx`
Homepage and routing definitions featuring the "Engineering-First" dark mode aesthetic, typography (Monospace/Sans-serif), and cross-link banners.
#### [NEW] `src/frontend/components/PlumeVisualizer.tsx`
Component for the Plume Dispersion Visualizer lead magnet (accepts wind speed, emission rate, etc., and renders 2D/3D heat maps).
#### [NEW] `src/frontend/components/FicksLawCalculator.tsx`
Component for the Fick's Law Calculator lead magnet.
#### [NEW] `src/frontend/components/SignalSimulator.tsx`
Interactive waveform chart component for the Signal-to-Noise Simulator ("Gulp Mode").

---

### Backend Server, APIs, & Data Models
Contains all proprietary IP, mass spectrometry math, and signal-to-noise logic. Must be built as a portable RESTful API returning JSON.

#### [NEW] `src/backend/requirements.txt`
Dependencies including FastAPI, Uvicorn, and any required scientific libraries (NumPy, SciPy).
#### [NEW] `src/backend/main.py`
FastAPI application entry point. Implements base security settings, CORS, and API rate-limiting to prevent automated reverse-engineering.
#### [NEW] `src/backend/api/tools_router.py`
RESTful endpoints connecting frontend requests to the underlying physics models.
#### [NEW] `src/backend/core/ficks_law.py`
Implementation of the proprietary Fick's Law models.
#### [NEW] `src/backend/core/plume_dispersion.py`
Implementation of custom Gaussian plume dispersion models.
#### [NEW] `src/backend/core/signal_simulator.py`
Implementation of the 3.2x noise reduction simulation logic.

---

### Infrastructure & Deployments
Dockerized configuration to ensure environmental consistency and code obfuscation.

#### [NEW] `infrastructure/Dockerfile`
Container definition specifically for the Python/FastAPI backend.
#### [NEW] `infrastructure/docker-compose.yml`
Orchestration to run frontend (node) and backend (python) services simultaneously for local development.

---

### Documentation & Memory
Session logs and historical context.

#### [NEW] `docs/session_history.md`
Chronological SoT to log session wrap-ups, accomplishments, and team notifications.

## Verification Plan

### Automated Tests
- Create and run tests in `tests/backend/` using `pytest` to verify API rate-limiting, CORS, and endpoint JSON responses.
- Create and run tests in `tests/frontend/` using Jest/React Testing Library to validate UI constraints and aesthetic enforcement.

### Manual Verification
- Run `docker-compose up` from `infrastructure/` to test full-stack initialization.
- Visually inspect the local deployment to ensure strict adherence to the "Engineering-First" dark mode color palette (e.g., `#0A0A0A` backgrounds, `#00E5FF` highlights).
- Manually trigger all three Core Engineering Tools via the UI to confirm seamless API communication without exposing Python source logic to the browser console.

# Project Name: AdaptiveSensing.io Web Platform

**Principal:** Ryan Bell, PhD

Public Email: ryan.bell@adaptivesensing.io

Website Support: support@adaptivesensing.io

Target Website: adaptivesensing.io
Git Repository Host: rbellAdapt
Vercel Host: use Git login

**Primary Objective:** Develop a lead-generating, highly technical consulting website that positions the Principal as the premier expert in atmospheric, laboratory, and subsea analytical sensing and software integration.
**Aesthetic:** "Engineering-First", dark mode, terminal-style accents, high-contrast scientific data visualizations. "Atmosphere-forward" imagery (UAVs, complex industrial plumes) with secondary focus on subsea and lab environments.

## 1\. System Architecture \& Tech Stack

To protect proprietary IP and ensure algorithmic portability for future bespoke Windows/Android applications, the system MUST use a decoupled architecture.

* **Frontend:** React, Next.js, or Vue (Antigravity's optimal choice for fast, component-based UI). 
* **Data Visualization:** Plotly.js or D3.js (Must support dark-mode, highly technical charts like 3D heatmaps and signal waveforms).
* **Backend (IP Fortress):** Python via **FastAPI**.

  * *Constraint:* ALL proprietary physics, mass spectrometry math, and signal-to-noise logic must live strictly on the server. The client-side code must NEVER contain the algorithms. 
  * Vercel host if possible (free)
  * *Portability:* The backend must be built as a RESTful API returning JSON, allowing future desktop or mobile apps to query the same logic.
* **Infrastructure/Deployment:** Dockerized Python backend (to ensure environmental consistency and code obfuscation).
* **Security:** Implement API rate-limiting to prevent automated reverse-engineering of the proprietary models via brute-force input testing.

## 2\. Core Engineering Tools (Lead Magnets)

These interactive tools will render on the frontend but compute on the Python backend.

### A. Plume Dispersion Visualizer (Atmospheric Focus)

* **Frontend Inputs:** Wind speed (m/s), Emission Rate (g/s), Target Distance (m), Stability Class (A-F).
* **Backend Processing (Python):** Executes custom Gaussian plume dispersion models to calculate concentration grids.
* **Frontend Output:** A sleek, 2D/3D heat map showing plume concentration and source attribution probabilities.
* **Lead Capture:** Users can run generic presets, but inputting custom parameters requires a verified email address.

### B. Fick’s Law Calculator

* **Frontend Inputs:** Non-steady-state data points (concentration over time), membrane thickness, temperature.
* **Backend Processing (Python):** Computes steady-state predictive values using proprietary Fick's Law models.
* **Frontend Output:** An interactive curve showing the raw data converging into the predictive model.

### C. Signal-to-Noise Simulator ("Gulp Mode" Logic)

* **Frontend Inputs:** Baseline noise level, sampling frequency. Toggle switch for "Standard Mode" vs. "Gulp Mode".
* **Backend Processing (Python):** Simulates the 3.2x noise reduction achieved via the Principal's proprietary fluidic/sampling logic.
* **Frontend Output:** A real-time waveform chart where users can visually watch the noise floor drop when "Gulp Mode" is activated.

## 3\. Site Architecture \& Sitemap

### 1\. Homepage

* **Hero Section:** Atmosphere-forward. Imagery of UAVs or industrial flare stacks.
* **Headline:** "Adaptive Decision Support for Complex Atmospheric Plumes \& Extreme Environments."
* **Sub-headline:** "Bridging the gap between physical instrumentation and algorithmic data science."
* **Primary CTA:** Link to the Interactive Tools.
* **Cross-Link Banner:** "Looking for off-the-shelf Underwater Mass Spectrometers? Visit our sister company, BCAnalytical.com."

### 2\. Services Portfolio (Tech Stack Layout)

* **Atmospheric Sensing:** UAV integration, fugitive emissions, source attribution mapping.
* **Bespoke Software/Firmware:** C++ / RS-232/485 instrument control, Python/MATLAB spectral deconvolution, custom laboratory GUIs.
* **Subsea Hardware Integration:** High-pressure vessel architecture, ROV payload integration, real-time deep-sea analytics.

### 3\. High-Stakes Case Studies

* *Atmospheric / Defense:* DARPA/IARPA AIMMS (Data protocols \& spectral processing).
* *Industrial / Lab:* MKS Instruments Vacuum Integrity System (Qualitative to quantitative gas transition).
* *Subsea / Crisis:* Deepwater Horizon (Processing 1,000+ nm of real-time UMS data).

### 4\. About the Principal

* Highlighting 20+ years of hardware-software integration, patents in MIMS technology, and cross-disciplinary expertise (Chemical Oceanography + Data Science + Hardware Engineering).

## 4\. UI/UX \& Copywriting Guidelines

* **Typography:** Monospace fonts (e.g., Fira Code, Roboto Mono) for numbers, technical headers, and API outputs. Clean sans-serif (Inter, Roboto) for readability in body text.
* **Color Palette:** Deep blacks/charcoals (`#0A0A0A`), slate grays, with stark, high-visibility neon accents for data plots (e.g., Cyan `#00E5FF`, Amber `#FFC400`).
* **Copy Tone:** Zero marketing fluff. Treat the copy like an engineering white paper. Speak directly to R\&D Directors, Defense Contractors, and Senior Engineers. Focus on ROI, reduction of latency, and mathematical precision.

## 5\. Antigravity Implementation Tasks

1. Generate the foundational React/Next.js boilerplate with the specified Dark Mode styling.
2. Set up the Python/FastAPI backend structure with placeholder functions for the three engineering tools.
3. Establish the RESTful API bridge between the React frontend and the FastAPI backend (including CORS and rate-limiting).
4. Draft the page layouts and routing based on the sitemap.
5. Create a Dockerfile for the Python backend to ensure secure, portable deployment.


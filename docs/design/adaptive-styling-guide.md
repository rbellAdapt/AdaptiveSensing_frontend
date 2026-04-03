# AdaptiveSensing.io Branding & Identity Guide

**Custodian:** `@brand`
**Version:** 1.0.0

This document serves as the single source of truth for the visual and tonal identity of the AdaptiveSensing.io web platform. All UI/UX implementations must adhere to these guidelines to ensure the "Engineering-First" aesthetic is maintained.

---

## 1. The Core Aesthetic
- **Concept:** "Engineering-First", Dark Mode, Terminal-style accents.
- **Vibe:** High-contrast scientific precision. Clean, clinical, and data-centric.
- **Imagery:** "Atmosphere-forward" (e.g., UAVs, complex industrial plumes, exhaust stacks) with a secondary focus on subsea vessels, high-pressure chambers, and laboratory environments.

---

## 2. Visual Identity & Color Palette

The color system is explicitly designed for a high-contrast dark mode environment to make complex data visualizations pop.

| Name | Hex Code | Tailwind Variable | Usage |
| :--- | :--- | :--- | :--- |
| **Deep Carbon (Background)** | `#0a0a0a` | `var(--background)` | Primary background color for all pages and components. |
| **Slate Gray (Foreground)** | `#e2e8f0` | `var(--foreground)` | Primary body text and general borders. High readability. |
| **Neon Cyan (Accent)** | `#00E5FF` | `var(--color-cyan)` | Primary accent. Used in data plots, focused states, and primary CTAs. |
| **Amber/Gold (Accent)** | `#FFC400` | `var(--color-amber)` | Secondary accent. Used for alerts, secondary data series, and highlights. |

> **@dev Note:** Do not use plain `#000` or `#FFF`. Strict adherence to `#0a0a0a` and `#e2e8f0` is required for the baseline contrast ratio.

---

## 3. Typography

Fonts must balance technical precision with legibility in long-form reading.

### Sans-Serif (Body & UI)
- **Font Family:** `Inter` (Google Font)
- **Tailwind Variable:** `var(--font-inter)` / `font-sans`
- **Usage:** Standard body paragraphs, service write-ups, and general navigation elements.

### Monospace (Data & Headers)
- **Font Family:** `Fira Code` (Google Font)
- **Tailwind Variable:** `var(--font-fira-code)` / `font-mono`
- **Usage:** Numerical readouts, data table headers, API outputs, terminal UI accents, code snippets, and specific technical headers.

---

## 4. Copywriting & Tone of Voice

### The Persona
- You are an expert engineer speaking to other expert engineers (R&D Directors, Defense Contractors, Senior Scientists).
- **Zero marketing fluff.** Eliminate buzzwords entirely.
- **Tone:** Academic, precise, authoritative, and direct. Treat website copy like an engineering white paper or technical spec sheet.

### Key Copy Rules
1. **Focus on Metrics:** Highlight ROI, reduction of latency, limit of detection (LOD), and mathematical precision.
2. **Action-Oriented:** Use verbs that denote processing and capability (e.g., "Analyze," "Compute," "Deconvolve," "Calibrate").
3. **No Exaggeration:** Let the numbers and the technology speak for themselves. Avoid words like "Revolutionary" or "Game-changing."

### Example Copy
- **Avoid:** "Our revolutionary Gulp Mode makes your data cleaner than ever before!"
- **Use:** "Gulp Mode implementation reduces baseline signal-to-noise ratio by a demonstrated factor of 3.2x, enabling rapid event classification."

---

## 5. UI/UX Principles (The "Feel")

- **Geometry:** Sharp, definitive edges. Avoid excessive border radii (prefer `rounded-sm` or `rounded-none` over `rounded-full` or `rounded-xl`).
- **Spacing:** Use deliberate, mathematical padding and margins. Give data visualizations room to breathe.
- **Accessibility:** Ensure that `#00E5FF` and `#FFC400` pass WCAG contrast guidelines against the `#0a0a0a` background.
- **Motion:** Micro-interactions should feel mechanical and instant, mimicking terminal or hardware interface responses (e.g., fast transitions `duration-150` rather than sluggish ease-in sweeps).

---

> **VIBE CHECK REQUIREMENT:** All new frontend components submitted by `@dev` must be audited against this document using the mandatory Brand Audit checklist (see `/docs/.agents/skills/brand/SKILL.md`).

# ORBITAL SENSE - GLOBAL AI SYSTEM RULES

## 1. UI & LAYOUT PHILOSOPHY
- **Approach:** Web-first, full-width dashboard structures. No boxed layouts unless strictly required by a specific component.
- **Language:** English-first interface (Variables, component names, and UI text must be in English).
- **Theme:** Deep dark mode native. Black backgrounds (`bg-black` or `bg-zinc-950`), neon cyan/blue/green accents.
- **Colors:** primary: #4bd4e6, secondary: #c7ea03

## 2. TYPOGRAPHY
- **Primary (font-sans):** `IBM Plex Sans`. Use for general UI, menus, headers, paragraphs, and buttons.
- **Secondary (font-mono):** `IBM Plex Mono`. MUST be used for API code blocks, log streams, satellite coordinates, stats, and timestamps.

## 3. CODE ARCHITECTURE
- **Frontend:** Next.js (App Router), React, Tailwind CSS. Strictly component-based.
- **Backend:** FastAPI, Pydantic, SQLAlchemy. Keep responses extremely fast and JSON structures flat.
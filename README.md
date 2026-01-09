![GreenGlitch hero](public/window.svg)

# GreenGlitch -- Click & Report PWA

> **Tagline:** Empowering communities to report civic issues in seconds using AI and geolocation.

GreenGlitch is a Progressive Web App that lets students and citizens flag overflowing dustbins, potholes, broken lights, and other hazards without navigating clunky civic portals. Snap a photo, let Gemini 1.5 Flash auto-tag it, and watch the report light up a public Google Maps heatmap backed by Firebase.

## Problem -> Solution (Copy/Paste Ready)

- **Problem:** Local communities and university campuses frequently suffer from maintenance neglect. Reporting tools are form-heavy and discourage participation, leaving authorities blind to what's happening on the ground.
- **Solution:** GreenGlitch condenses civic reporting into a single click. The PWA captures a geotagged photo, sends it to Gemini Vision for structured JSON tagging (`{ category, severity, description }`), uploads to Firebase Storage, and stores metadata in Firestore. Google Maps Visualization renders a severity‑weighted heatmap for decision makers.

## Architecture for Hackathon Speed

| Layer | Tech | Notes |
| --- | --- | --- |
| Frontend | Next.js 14 (App Router) + Tailwind CSS | Ships as a PWA with offline manifest + shareable routes (`/report`, `/dashboard`). |
| Data | Firebase Firestore + Firebase Storage | Zero-config, real-time updates straight to the dashboard heatmap. |
| AI | Gemini 1.5 Flash (Google AI Studio) | Structured JSON output with category + severity + summary. |
| Maps | Google Maps JavaScript API + Visualization Library | Weighted heatmap displays civic hotspots instantly. |

### Workflow Logic
1. **Capture:** `<input type="file" capture="environment" />` opens the mobile camera immediately.
2. **Analyze:** Image -> Base64 -> Gemini Flash prompt -> JSON classification.
3. **Store:** Upload image to Firebase Storage and metadata to Firestore.
4. **Visualize:** Feed Firestore snapshots into Google Maps heatmap (severity = weight).

### Hour-by-Hour Execution Plan

| Hour | Focus |
| --- | --- |
| 1 | Bootstrap Next.js/Tailwind, wire Firebase + API keys. |
| 2 | Build the mobile-first capture UI with a giant “Report Issue” CTA. |
| 3 | Integrate Gemini Flash and parse JSON output. |
| 4 | Persist reports to Firestore/Storage. |
| 5 | Render Google Maps heatmap & live feed dashboard. |
| 6 | Polish: loading states, success animation, manifesto-ready copy. |

## Getting Started

1. Copy `.env.example` -> `.env.local` and fill in:
	- Firebase web config (API key, project ID, storage bucket, etc.)
	- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
	- `GEMINI_API_KEY` from Google AI Studio
2. Install and run:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the landing page, `/report` for the reporter, and `/dashboard` for the heatmap.

## Key Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint (Next.js rules). |

## Future Scope

1. **Automated work orders:** Pipe hotspots directly into municipal CRMs for scheduling.
2. **Gamification:** Leaderboards + “Green Points” for verified reporters.
3. **Predictive analysis:** Use historical heatmap data to forecast the next trash surge (post festivals/exams).

## Demo Tip

When recording, show the camera taking a messy photo, watch Gemini auto-label “Garbage (High Severity)” with zero typing, then jump to the dashboard to highlight the new glowing red hotspot. Judges love instant gratification.

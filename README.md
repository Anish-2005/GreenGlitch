# ![GreenGlitch](public/greenglitch-logo.svg) 

# GreenGlitch: Civic Reporting Reimagined

[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-0F172A?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

> **Empowering communities to report civic issues in seconds using AI and geolocation.**

GreenGlitch is a high-performance Progressive Web App (PWA) designed to bridge the gap between citizens and civic authorities. By leveraging AI-powered image analysis and real-time geospatial visualization, GreenGlitch transforms the tedious process of reporting maintenance issues into a seamless, one-click experience.

---

## 🌟 Key Features

- **📸 One-Click Reporting:** Snap a photo of a civic issue (potholes, garbage, broken lights) and let AI do the rest.
- **🤖 AI-Powered Auto-Tagging:** Integrated with **Puter AI / Gemini Vision** to automatically categorize issues, assess severity, and generate descriptions.
- **🗺️ Real-time Heatmap:** Dynamic severity-weighted heatmap using **Leaflet** and **OpenStreetMap** to identify civic hotspots instantly.
- **📱 PWA & Mobile First:** Fully installable on mobile devices with offline manifest support for on-the-ground reporting.
- **📍 Precise Geotagging:** Automatic GPS coordinate capture for accurate issue localization.
- **🔥 Firebase Backend:** Real-time data synchronization with Firestore and secure image hosting via Firebase Storage.

---

## 🏗️ Technical Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) | Core framework for SSR, routing, and UI. |
| **Styling** | Tailwind CSS 4 | Atomic CSS for hyper-fast, responsive design. |
| **AI Analysis** | Puter SDK (GPT-5-nano) | Client-side image classification and metadata generation. |
| **Database** | Firebase Firestore | Real-time NoSQL storage for reports and user data. |
| **Cloud Storage** | Firebase Storage | Reliable hosting for reported issue imagery. |
| **Mapping** | React Leaflet / OSM | Geospatial visualization and heatmap rendering. |
| **Auth** | Firebase Authentication | Secure user sign-in and protected reporting. |

---

## 📁 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages & API)
│   ├── api/analyze/   # Analysis endpoint (legacy)
│   ├── dashboard/    # Admin/Public heatmap view
│   ├── login/        # Authentication pages
│   └── report/       # issue reporting flow
├── components/        # Reusable UI components
│   ├── auth/          # Auth providers & protected routes
│   ├── dashboard/     # Heatmap & statistics panels
│   ├── report/        # Camera & form logic
│   └── ui/            # Shared shadcn-like components
├── hooks/             # Custom React hooks (Geoloc, etc.)
├── lib/               # Shared logic & utilities
│   ├── firebase/      # Firestore & Storage config
│   ├── puter.ts       # AI Analysis integration
│   └── constants.ts   # App-wide configuration
└── types/             # TypeScript definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / pnpm / yarn
- Firebase Project
- Puter.js (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/greenglitch.git
   cd greenglitch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # App Config
   NEXT_PUBLIC_DEFAULT_LAT=22.5726
   NEXT_PUBLIC_DEFAULT_LNG=88.3639
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Development Workflow

- **Capture Logic:** Uses the browser's MediaDevices API to interface with mobile cameras directly.
- **AI Stream:** Images are processed via Puter's client-side SDK for sub-second classification.
- **Geospatial Processing:** Reports are stored with lat/lng pairs, which are then fed into a `Leaflet.heat` layer for density visualization.

---

## 📈 Future Roadmap

- [ ] **Community Verification:** Allow other users to "upvote" or confirm reported issues.
- [ ] **Direct Authority Integration:** Automated emails/API calls to local municipal bodies.
- [ ] **Gamification:** Rewards and badges for active community contributors.
- [ ] **Offline Queuing:** Store reports locally when data is low and sync once back online.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the GreenGlitch Team
</p>


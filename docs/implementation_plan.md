# Implementation Plan: Settlr MVP

**Goal:** Build the MVP for Settlr, a Real Estate Logistics platform, featuring a Next.js PWA frontend and a FastAPI backend, using Supabase for Auth/DB.

## User Review Required
- **Google Maps & Gemini Keys**: I will use placeholders (env vars) for these. You will need to populate `.env` files with your actual keys later.
- **PWA Assets**: I will generate placeholder icons for the PWA manifest. You may want to replace `public/icons/` with actual brand assets later.

## Proposed Changes

### Backend (Next.js API Routes)
#### [NEW] [API Routes]
- `app/api/auth/`: Auth handlers (though Supabase Auth can be handled largely client-side/middleware).
- `app/api/listings/route.ts`: Handlers for fetching and creating listings (including AI generation stub).
- `app/api/tours/route.ts`: Handlers for tour scheduling and management.
- `lib/supabase/`: Helper functions for Supabase (Server and Client clients).
- `lib/models.ts`: TypeScript interfaces/types matching the DB schema.


### Frontend (Root Directory - Next.js)
#### [MODIFY] [Global Config]
- `tailwind.config.ts`: Add custom colors (`#00c763`, `#f1c40f`, etc.) and font (`Space Grotesk`).
- `app/layout.tsx`: Add font imports and metadata.

#### [NEW] [PWA Setup]
- `public/manifest.json`: Web app manifest for installability.
- `next.config.ts`: Update to support PWA (using `next-pwa` or manual service worker if preferred, aiming for `next-pwa` for simplicity).

#### [NEW] [Pages & Components]
- **Client Flow**:
    - `app/page.tsx`: Landing page with "Start" CTA.
    - `app/quiz/page.tsx`: Interactive onboarding quiz.
    - `app/results/page.tsx`: Blurred results listing (Tease).
    - `app/payment/page.tsx`: Payment gateway simulation/integration points.
    - `app/dashboard/client/page.tsx`: Client view for scheduled tours.
- **Partner Flow**:
    - `app/dashboard/scout/page.tsx`: Scout interactive dashboard.
    - `app/dashboard/scout/upload/page.tsx`: Inventory upload form with AI stub.
- **Components**:
    - `components/ui/`: Reusable buttons, cards, inputs (styled with Tailwind).
    - `components/map.tsx`: Google Maps integration component.

## Verification Plan

### Automated Tests
- **Dev Server**: Run `npm run dev` and verify API endpoints at `http://localhost:3000/api/...`.
- **Frontend Build**: Run `npm run build` to ensure Next.js compiles correctly.
- **PWA Check**: Use Chrome DevTools "Lighthouse" or "Application" tab to verify Manifest is detected and installable.

### Manual Verification
- **Flow Walkthrough**:
    1. Open App (Mobile View).
    2. Complete Quiz -> See Blurred Results.
    3. "Unlock" -> Payment Mock -> Access Dashboard.
    4. Switch to Scout View -> "Upload Unit" -> See AI mock result.

# Product Requirements Document (PRD): Settlr MVP

**Version:** 1.0 | **Status:** Approved for Build | **Date:** December 19, 2025

## 1. Executive Summary
Settlr is a premium "Real Estate Logistics" platform that solves the chaotic house-hunting experience in Nairobi. Unlike competitors who sell "listings" (information), Settlr sells "viewings" (experience). We verify the units, drive the client to them, and handle the negotiations.

**The Core Product:** A Single-App platform with dual interfaces:
- **Client Interface:** A "Tease-and-Pay" flow where users pay KES 3,500 to unlock a chauffeured tour of 5 verified homes.
- **Partner Interface (Scout):** An operations dashboard for Scouts to manage tours, verify identity via QR, and upload inventory using AI.

**Business Goal (MVP):** Validate the willingness to pay KES 3,500 upfront for convenience and trust.

## 2. User Personas

| Persona | Role | Pain Points | Goals |
| :--- | :--- | :--- | :--- |
| **The "Settlr"** (Client) | Busy Professional / Expat (Income: KES 150k+) | Hates "fake agents," fears getting conned, has no time to coordinate 10 viewings. | Wants to move this weekend without a headache. Values safety and efficiency. |
| **The Scout** (Employee) | Logistics Operator | Inconsistent income as a freelance agent. Wastes time on "window shoppers." | Wants steady tours, guaranteed clients, and tools that make the job easy (no writing listings manually). |
| **The Admin** (Owner) | Business Controller | Lack of visibility on field operations. | Needs to track revenue, verified tours, and inventory quality in real-time. |

## 3. Functional Requirements

### 3.1 Client Module (The "Hunter" Flow)
- **FR-C1 (Onboarding Quiz):**
    - System must collect: Location (Westlands/Kilimani/etc.), Budget Range, Move-in Date, and "Non-Negotiables" (Tags).
    - Constraint: Must be swipe/tap based (no long forms).
- **FR-C2 (Inventory Tease):**
    - System must query the database for matches but BLUR specific photos and building names.
    - System must display a "Match Count" (e.g., "14 Verified Units Found").
- **FR-C3 (The Paywall):**
    - System must block access to scheduling until payment is confirmed.
    - Integration: Lipana.dev (M-Pesa STK Push).
    - Logic: Upon success webhook -> Change User State to PAID_ACTIVE.
- **FR-C4 (Tour Scheduling):**
    - User selects Date (Tomorrow/Day After) and Time Slot (AM/PM).
    - User inputs Pickup Location (Google Maps Pin).
- **FR-C5 (Tour Mode & Verification):**
    - User must be able to scan a Scout's QR code to "Start Tour."
    - User must be able to rate each visited unit (1-5 stars) in real-time.
- **FR-C6 (Moving Upsell):**
    - Upon selecting a "Favorite" unit, system must auto-generate a Moving Quote (Base price + Distance calc).

### 3.2 Partner Module (The "Scout" Flow)
- **FR-P1 (Role-Based Login):**
    - System must detect role: SCOUT and render the Partner Dashboard instead of the House Hunting flow.
- **FR-P2 (Digital Identity):**
    - App must generate a dynamic, time-sensitive QR Code for client verification.
- **FR-P3 (Job Management):**
    - Scout must see "Today's Job" card: Client Name, Pickup Location, and the 5 assigned units.
    - "Start Navigation" button must open Google Maps/Waze.
- **FR-P4 (AI Inventory Upload):**
    - Scout uploads 3 photos + Price + Location.
    - Integration: Google Gemini API analyzes photos and auto-generates Title, Description, and Tags.
    - Scout reviews and clicks "Publish."

### 3.3 Admin Module (Web Dashboard)
- **FR-A1:** View all active tours (Map view).
- **FR-A2:** View total revenue (Lipana.dev sync).
- **FR-A3:** Manually create/approve Scout accounts.

## 4. Technical Architecture

### 4.1 Technology Stack
- **Frontend (Mobile Web/PWA):** Next.js (React) + Tailwind CSS.
    - *Reason:* Fast development, great performance, easy to deploy on Vercel.
- **Backend (API):** Python (FastAPI).
    - *Reason:* High performance, native support for AI libraries, strict typing (Pydantic).
- **Database:** PostgreSQL (via Supabase or Neon).
    - *Reason:* Relational data integrity is non-negotiable for bookings and financial transactions.
- **AI Engine:** Google Gemini Pro Vision (via AI Studio API).
- **Payments:** Lipana.dev (M-Pesa wrapper).
- **Maps:** Google Maps Platform (Directions API, Places API).

### 4.2 Data Models (Key Entities)
- **Users:** (ID, Phone, Role [Client/Scout/Admin], AuthToken).
- **Listings:** (ID, Location, Price, Description, Images[], Status [Available/Taken]).
- **Tours:** (ID, ClientID, ScoutID, Status [Paid/Scheduled/Active/Done], PaymentRef).
- **TourStops:** (TourID, ListingID, SequenceOrder, ClientFeedback).

## 5. User Flows (The "Happy Paths")

### Path A: The Money Flow (Client)
1. Landing Page -> Start Quiz.
2. Complete Quiz -> View Blurred Results.
3. Click "Unlock" -> Enter M-Pesa Pin.
4. Payment Success -> Unlock Schedule Screen.
5. Book Slot -> Receive Confirmation SMS.

### Path B: The Content Flow (Scout)
1. Partner Dashboard -> Click "Add Unit."
2. Take 3 Photos of living room.
3. Enter "Kileleshwa, 65k."
4. Click "Generate with AI."
5. Wait 3s -> Review description -> Publish.

## 6. Success Metrics (KPIs)
To pass "Pressure Testing," the MVP must hit these numbers in Month 1:
- **Conversion Rate:** >5% of Quiz completers pay the KES 3,500 fee.
- **Ops Efficiency:** 0 "Ghost Tours" (Scout shows up, Client doesn't, or vice versa).
- **Inventory Speed:** Scout listing time < 2 minutes per unit (thanks to AI).
- **Upsell Rate:** >15% of successful tenants book Settlr Movers.

## 7. Risks & Mitigation Strategies
- **Inventory Churn:** "The 60-Minute Rule": Scouts must call caretakers 60 mins before the tour to confirm availability.
- **Payment Trust:** "Lipana Escrow" UI: Show clear branding that payment is secure. Offer "Money Back Guarantee".
- **Safety:** QR Verification + Live Tracking. SOS button. Police Clearance Certs.
- **Bypass:** Monetize Viewings, not Leases.

## 8. Immediate Next Steps (The Build Phase)
- Freeze this PRD. No new features added until V1 is live.
- **Database Setup:** Initialize PostgreSQL schema based on the models defined.
- **Backend "Hello World":** Set up FastAPI to handle User Login (Phone Auth).
- **Frontend Integration:** Connect the v0 UI screens to the FastAPI backend.

## Design
- **Colors:** #000 (Black), #fff (White), #00c763 (Green), #f1c40f (Yellow).
- **Font:** Space Grotesk.

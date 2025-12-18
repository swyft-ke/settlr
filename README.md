# Settlr

**Real Estate Logistics Platform for Nairobi**

Settlr is a premium "Real Estate Logistics" platform that solves the chaotic house-hunting experience in Nairobi. Unlike competitors who sell "listings" (information), Settlr sells "viewings" (experience). We verify the units, drive the client to them, and handle the negotiations.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd settlr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key
   - `GEMINI_API_KEY` - Your Gemini API key (for AI features)

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 Documentation

- **[Product Requirements Document (PRD)](docs/prd.md)** - Complete product specification, user personas, and success metrics
- **[Implementation Plan](docs/implementation_plan.md)** - Technical architecture and implementation strategy
- **[Task List](docs/task.md)** - Development progress tracker
- **[Walkthrough](docs/walkthrough.md)** - Implementation summary and verification results

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini Pro Vision
- **Payments**: Lipana.dev (M-Pesa)
- **Maps**: Google Maps Platform
- **PWA**: next-pwa

## 🎨 Design System

- **Colors**:
  - Primary Green: `#00c763`
  - Accent Yellow: `#f1c40f`
  - Black: `#000000`
  - White: `#ffffff`
- **Font**: Space Grotesk

## 📱 Key Features

### Client Flow
1. **Landing Page** - Premium hero section
2. **Interactive Quiz** - Swipe-based preference collection
3. **Blurred Results** - Tease verified matches
4. **Payment Gateway** - M-Pesa integration
5. **Tour Scheduling** - Book chauffeured viewings
6. **Dashboard** - Manage tours and favorites

### Partner (Scout) Flow
1. **Login** - Role-based authentication
2. **Dashboard** - Today's jobs and navigation
3. **AI Inventory Upload** - Photo + AI-generated descriptions
4. **QR Verification** - Client identity verification

## 🚧 Current Status

✅ MVP Complete
- All core user flows implemented
- PWA-ready with offline support
- Responsive design (mobile-first)
- Type-safe with TypeScript
- Production build verified

## 🔜 Next Steps

1. Set up Supabase database schema
2. Implement real payment integration (Lipana.dev)
3. Add Google Maps integration
4. Connect Gemini API for real AI generation
5. Deploy to Vercel

## 🤝 Contributing

This is a private project. For questions or collaboration, contact the team lead.

## 📄 License

Proprietary - Settlr Inc. © 2025

# Vehicle Companion — Web Application

**Vehicle Companion** is a full-stack, responsive vehicle-management platform built with **React**, **Vite**, **Tailwind CSS**, **Supabase**, **Recharts**, and **Leaflet / OpenStreetMap**.

It allows vehicle owners to manage their vehicles, service logs, fuel expenses, insurance policies, maintenance schedules, emergency assistance, and nearby garage discovery in one unified application.

---

## 🌟 Key Features

### 🚘 Vehicle Owner Portal
- **Dashboard**: Aggregated analytics (vehicle count, fuel cost total, active insurance count, maintenance alerts).
- **My Vehicles**: Add, Edit, Delete vehicles with Indian registration format validation (e.g. `MH12AB1234`, `JH01AB1234`).
- **Vehicle Details**: Tabbed view displaying vehicle specs, service history, fuel records, maintenance status, and insurance details.
- **Service History**: Log completed or routine service records with itemized costs.
- **Fuel Expense Tracking**: Track fill-ups with automatic cost calculations (`quantity × price_per_litre`) and Recharts monthly spending visualization.
- **Maintenance Schedule**: Automatic status calculation (`Upcoming`, `Due Soon`, `Overdue`, `Completed`).
- **Insurance Tracking**: Calculate remaining coverage days and display status badges (`Active`, `Expiring Soon`, `Expired`).
- **Emergency SOS Assistance**: Roadside emergency request with browser GPS Geolocation API.
- **Nearby Garages Finder**: Interactive Leaflet map with OpenStreetMap tiles, garage service tags, ratings, and Google Maps directions link.

### 🔧 Mechanic & Garage Portal
- **Mechanic Dashboard**: Queue of incoming service requests and emergency alerts.
- **Service Requests Pipeline**: Update service status (`Requested` ➔ `In Progress` ➔ `Completed`).
- **Customer Vehicles View**: Technical vehicle specs view.

### 🛡️ Insurance Company Portal
- **Insurance Dashboard**: Total policies, expiring count, and expired policies breakdown.
- **Policy Directory**: Policy management and authorized coverage updates.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth)
- **Charts & Maps**: Recharts, Leaflet, React-Leaflet, OpenStreetMap
- **Routing**: React Router v6

---

## 🛠️ Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Database Setup (Supabase)**:
   Run the included `supabase_schema.sql` file in your Supabase SQL Editor to create tables, foreign keys, RLS policies, and seed garage locations.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment (Vercel)

Deploy to Vercel via CLI or GitHub integration:
```bash
npx vercel
```
Set environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings.

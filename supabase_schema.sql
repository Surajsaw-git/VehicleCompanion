-- ==============================================================================
-- VEHICLE COMPANION — COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'mechanic', 'insurance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_number TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid')),
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.service_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  mechanic_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Requested', 'In Progress', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INSURANCE TABLE
CREATE TABLE IF NOT EXISTS public.insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL UNIQUE REFERENCES public.vehicles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL DEFAULT 'HDFC ERGO',
  policy_number TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  premium NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (premium >= 0),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expiring Soon', 'Expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FUEL EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.fuel_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  fuel_type TEXT NOT NULL,
  quantity NUMERIC(8, 2) NOT NULL CHECK (quantity > 0),
  price_per_litre NUMERIC(8, 2) NOT NULL CHECK (price_per_litre > 0),
  total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost > 0),
  odometer INTEGER NOT NULL CHECK (odometer >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MAINTENANCE TABLE
CREATE TABLE IF NOT EXISTS public.maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  due_date DATE NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (current_status IN ('Upcoming', 'Due Soon', 'Overdue', 'Completed')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GARAGES TABLE
CREATE TABLE IF NOT EXISTS public.garages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  phone TEXT NOT NULL,
  services TEXT[] NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EMERGENCY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue TEXT NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'On the Way', 'Resolved', 'Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "User insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Vehicles Policies
CREATE POLICY "Owner access own vehicles" ON public.vehicles 
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Mechanic & Insurance view all vehicles" ON public.vehicles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('mechanic', 'insurance')
    )
  );

-- Service Records Policies
CREATE POLICY "Owner access service records" ON public.service_records 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicles 
      WHERE id = service_records.vehicle_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Mechanics manage service records" ON public.service_records 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'mechanic'
    )
  );

-- Insurance Policies
CREATE POLICY "Owner view insurance" ON public.insurance 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehicles 
      WHERE id = insurance.vehicle_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Insurance users manage policies" ON public.insurance 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'insurance'
    )
  );

-- Fuel Expenses Policies
CREATE POLICY "Owner manage fuel expenses" ON public.fuel_expenses 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicles 
      WHERE id = fuel_expenses.vehicle_id AND owner_id = auth.uid()
    )
  );

-- Maintenance Policies
CREATE POLICY "Owner manage maintenance" ON public.maintenance 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vehicles 
      WHERE id = maintenance.vehicle_id AND owner_id = auth.uid()
    )
  );

-- Garages Policies (Public Read)
CREATE POLICY "Public garage view" ON public.garages FOR SELECT USING (true);

-- Emergency Requests Policies
CREATE POLICY "Owner manage emergency requests" ON public.emergency_requests 
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Mechanics view and update emergency requests" ON public.emergency_requests 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'mechanic'
    )
  );

-- ==============================================================================
-- INITIAL DEMO SEED DATA FOR GARAGES
-- ==============================================================================
INSERT INTO public.garages (name, address, latitude, longitude, phone, services, rating) VALUES
('SpeedyAuto Care & Service', 'MG Road, Sector 14, Gurugram', 28.4595, 77.0266, '+91 98765 43210', ARRAY['General Service', 'Engine Repair', 'Brake Repair', 'Tyre Service'], 4.8),
('Apex Motor Workshop', 'Koramangala 5th Block, Bengaluru', 12.9352, 77.6245, '+91 98123 45678', ARRAY['Oil Change', 'Battery Check', 'Brake Repair', 'AC Repair'], 4.6),
('Metro Vehicle Hub', 'Andheri East, Mumbai', 19.1136, 72.8697, '+91 99887 76655', ARRAY['General Service', 'Accident Repair', 'Tyre Rotation', 'Washing'], 4.7),
('Classic Garage & Repairs', 'Connaught Place, New Delhi', 28.6315, 77.2167, '+91 97654 32109', ARRAY['Engine Diagnosis', 'Electrical Repair', 'Brake Repair'], 4.5),
('Royal Care Motors', 'Banjara Hills, Hyderabad', 17.4126, 78.4312, '+91 91234 56789', ARRAY['Full Inspection', 'Engine Tuning', 'Battery Replacement'], 4.9)
ON CONFLICT DO NOTHING;

/**
 * Initial Demo & Seed Data for 30 Permanent Demo Users
 */

export const DEMO_PROFILES = [
  // --- 10 VEHICLE OWNERS ---
  { id: 'owner-1', name: 'Rahul Sharma', email: 'rahul.sharma.vehicle@gmail.com', phone: '9876543210', role: 'owner' },
  { id: 'owner-2', name: 'Priya Verma', email: 'priya.verma.vehicle@gmail.com', phone: '9876543211', role: 'owner' },
  { id: 'owner-3', name: 'Arjun Patel', email: 'arjun.patel.vehicle@gmail.com', phone: '9876543212', role: 'owner' },
  { id: 'owner-4', name: 'Sneha Singh', email: 'sneha.singh.vehicle@gmail.com', phone: '9876543213', role: 'owner' },
  { id: 'owner-5', name: 'Rohan Mehta', email: 'rohan.mehta.vehicle@gmail.com', phone: '9876543214', role: 'owner' },
  { id: 'owner-6', name: 'Ananya Das', email: 'ananya.das.vehicle@gmail.com', phone: '9876543215', role: 'owner' },
  { id: 'owner-7', name: 'Vikram Kumar', email: 'vikram.kumar.vehicle@gmail.com', phone: '9876543216', role: 'owner' },
  { id: 'owner-8', name: 'Neha Joshi', email: 'neha.joshi.vehicle@gmail.com', phone: '9876543217', role: 'owner' },
  { id: 'owner-9', name: 'Aditya Nair', email: 'aditya.nair.vehicle@gmail.com', phone: '9876543218', role: 'owner' },
  { id: 'owner-10', name: 'Pooja Mishra', email: 'pooja.mishra.vehicle@gmail.com', phone: '9876543219', role: 'owner' },

  // --- 10 MECHANICS ---
  { id: 'mech-1', name: 'Amit Yadav (Master Mechanic)', email: 'amit.yadav.vehicle@gmail.com', phone: '9812345670', role: 'mechanic' },
  { id: 'mech-2', name: 'Suresh Patil', email: 'suresh.patil.vehicle@gmail.com', phone: '9812345671', role: 'mechanic' },
  { id: 'mech-3', name: 'Manoj Kumar', email: 'manoj.kumar.vehicle@gmail.com', phone: '9812345672', role: 'mechanic' },
  { id: 'mech-4', name: 'Deepak Singh', email: 'deepak.singh.vehicle@gmail.com', phone: '9812345673', role: 'mechanic' },
  { id: 'mech-5', name: 'Rajesh Verma', email: 'rajesh.verma.vehicle@gmail.com', phone: '9812345674', role: 'mechanic' },
  { id: 'mech-6', name: 'Nitin Sharma', email: 'nitin.sharma.vehicle@gmail.com', phone: '9812345675', role: 'mechanic' },
  { id: 'mech-7', name: 'Karan Shah', email: 'karan.shah.vehicle@gmail.com', phone: '9812345676', role: 'mechanic' },
  { id: 'mech-8', name: 'Imran Khan', email: 'imran.khan.vehicle@gmail.com', phone: '9812345677', role: 'mechanic' },
  { id: 'mech-9', name: 'Rohit Gupta', email: 'rohit.gupta.vehicle@gmail.com', phone: '9812345678', role: 'mechanic' },
  { id: 'mech-10', name: 'Sanjay Pawar', email: 'sanjay.pawar.vehicle@gmail.com', phone: '9812345679', role: 'mechanic' },

  // --- 10 INSURANCE OFFICERS ---
  { id: 'ins-off-1', name: 'Kavita Kapoor (HDFC ERGO)', email: 'kavita.kapoor.vehicle@gmail.com', phone: '9988776650', role: 'insurance' },
  { id: 'ins-off-2', name: 'Anjali Malhotra (ICICI Lombard)', email: 'anjali.malhotra.vehicle@gmail.com', phone: '9988776651', role: 'insurance' },
  { id: 'ins-off-3', name: 'Nikhil Bansal (Bajaj Allianz)', email: 'nikhil.bansal.vehicle@gmail.com', phone: '9988776652', role: 'insurance' },
  { id: 'ins-off-4', name: 'Meera Iyer (Tata AIG)', email: 'meera.iyer.vehicle@gmail.com', phone: '9988776653', role: 'insurance' },
  { id: 'ins-off-5', name: 'Rajiv Arora (SBI General)', email: 'rajiv.arora.vehicle@gmail.com', phone: '9988776654', role: 'insurance' },
  { id: 'ins-off-6', name: 'Shweta Agarwal (Reliance Gen)', email: 'shweta.agarwal.vehicle@gmail.com', phone: '9988776655', role: 'insurance' },
  { id: 'ins-off-7', name: 'Varun Sethi (Oriental Ins)', email: 'varun.sethi.vehicle@gmail.com', phone: '9988776656', role: 'insurance' },
  { id: 'ins-off-8', name: 'Ritu Chawla (Star Health)', email: 'ritu.chawla.vehicle@gmail.com', phone: '9988776657', role: 'insurance' },
  { id: 'ins-off-9', name: 'Abhishek Jain (New India)', email: 'abhishek.jain.vehicle@gmail.com', phone: '9988776658', role: 'insurance' },
  { id: 'ins-off-10', name: 'Divya Menon (National Ins)', email: 'divya.menon.vehicle@gmail.com', phone: '9988776659', role: 'insurance' },
];

export const DEMO_VEHICLES = [
  { id: 'veh-1', owner_id: 'owner-1', registration_number: 'JH01AB1234', brand: 'Hyundai', model: 'Creta SX (O)', year: 2023, fuel_type: 'Petrol', mileage: 18450, created_at: '2023-05-10T10:00:00Z' },
  { id: 'veh-2', owner_id: 'owner-2', registration_number: 'MH12CD5678', brand: 'Maruti Suzuki', model: 'Baleno Alpha', year: 2022, fuel_type: 'Petrol', mileage: 24300, created_at: '2022-03-15T10:00:00Z' },
  { id: 'veh-3', owner_id: 'owner-3', registration_number: 'GJ01EF9012', brand: 'Tata', model: 'Nexon EV Empowered', year: 2024, fuel_type: 'Electric', mileage: 9200, created_at: '2024-01-15T10:00:00Z' },
  { id: 'veh-4', owner_id: 'owner-4', registration_number: 'DL03GH3456', brand: 'Mahindra', model: 'XUV700 AX7', year: 2022, fuel_type: 'Diesel', mileage: 34100, created_at: '2022-08-20T10:00:00Z' },
  { id: 'veh-5', owner_id: 'owner-5', registration_number: 'KA05IJ7890', brand: 'Honda', model: 'City ZX', year: 2021, fuel_type: 'Petrol', mileage: 41000, created_at: '2021-06-10T10:00:00Z' },
  { id: 'veh-6', owner_id: 'owner-6', registration_number: 'WB02KL1234', brand: 'Toyota', model: 'Fortuner Legender', year: 2023, fuel_type: 'Diesel', mileage: 28500, created_at: '2023-02-18T10:00:00Z' },
  { id: 'veh-7', owner_id: 'owner-7', registration_number: 'UP32MN5678', brand: 'Kia', model: 'Seltos GTX+', year: 2023, fuel_type: 'Petrol', mileage: 15200, created_at: '2023-09-05T10:00:00Z' },
  { id: 'veh-8', owner_id: 'owner-8', registration_number: 'BR01OP9012', brand: 'Renault', model: 'Triber RXZ', year: 2020, fuel_type: 'CNG', mileage: 52000, created_at: '2020-11-12T10:00:00Z' },
  { id: 'veh-9', owner_id: 'owner-9', registration_number: 'TN09QR3456', brand: 'Volkswagen', model: 'Virtus GT', year: 2023, fuel_type: 'Petrol', mileage: 19800, created_at: '2023-04-22T10:00:00Z' },
  { id: 'veh-10', owner_id: 'owner-10', registration_number: 'RJ14ST7890', brand: 'Skoda', model: 'Slavia Style', year: 2022, fuel_type: 'Petrol', mileage: 22600, created_at: '2022-07-30T10:00:00Z' },
];

export const DEMO_SERVICES = [
  { id: 'srv-1', vehicle_id: 'veh-1', mechanic_id: 'mech-1', service_date: '2026-06-10', service_type: 'General Service', description: 'Engine oil replacement, oil filter change, fluid top up.', cost: 4850, status: 'Completed', created_at: '2026-06-10T11:00:00Z' },
  { id: 'srv-2', vehicle_id: 'veh-1', mechanic_id: 'mech-1', service_date: '2026-08-15', service_type: 'Brake Service', description: 'Front brake pad replacement.', cost: 3200, status: 'Completed', created_at: '2026-08-15T14:30:00Z' },
  { id: 'srv-3', vehicle_id: 'veh-2', mechanic_id: 'mech-2', service_date: '2026-07-02', service_type: 'Oil Change', description: 'Synthetic oil and air filter replacement.', cost: 2100, status: 'Completed', created_at: '2026-07-02T10:00:00Z' },
  { id: 'srv-4', vehicle_id: 'veh-3', mechanic_id: 'mech-3', service_date: '2026-08-18', service_type: 'EV Battery Diagnostic & Service', description: 'High-voltage battery diagnostic check.', cost: 2500, status: 'In Progress', created_at: '2026-08-18T09:00:00Z' },
  { id: 'srv-5', vehicle_id: 'veh-4', mechanic_id: 'mech-4', service_date: '2026-05-14', service_type: 'Transmission Fluid Flush', description: 'Automatic transmission fluid flush.', cost: 6500, status: 'Completed', created_at: '2026-05-14T12:00:00Z' },
  { id: 'srv-6', vehicle_id: 'veh-5', mechanic_id: 'mech-5', service_date: '2026-04-10', service_type: 'Spark Plug Replacement', description: 'Iridium spark plugs replaced.', cost: 3800, status: 'Completed', created_at: '2026-04-10T11:00:00Z' },
  { id: 'srv-7', vehicle_id: 'veh-6', mechanic_id: 'mech-6', service_date: '2026-08-01', service_type: 'Suspension Inspection', description: 'Shock absorber and bushing check.', cost: 7800, status: 'In Progress', created_at: '2026-08-01T15:00:00Z' },
  { id: 'srv-8', vehicle_id: 'veh-7', mechanic_id: 'mech-7', service_date: '2026-07-20', service_type: 'Periodic 15k Service', description: '15,000 km routine maintenance.', cost: 4200, status: 'Completed', created_at: '2026-07-20T10:00:00Z' },
  { id: 'srv-9', vehicle_id: 'veh-8', mechanic_id: 'mech-8', service_date: '2026-08-19', service_type: 'CNG Kit Safety Inspection', description: 'Leak check & cylinder pressure test.', cost: 3000, status: 'Requested', created_at: '2026-08-19T08:00:00Z' },
  { id: 'srv-10', vehicle_id: 'veh-9', mechanic_id: 'mech-9', service_date: '2026-06-25', service_type: 'DSG Gearbox Service', description: 'DSG clutch pack inspection.', cost: 5500, status: 'Completed', created_at: '2026-06-25T14:00:00Z' },
];

export const DEMO_INSURANCE = [
  { id: 'ins-1', vehicle_id: 'veh-1', company_name: 'HDFC ERGO General Insurance', policy_number: 'POL-HYU-887410', start_date: '2025-09-01', expiry_date: '2026-09-01', premium: 14500, status: 'Active' },
  { id: 'ins-2', vehicle_id: 'veh-2', company_name: 'ICICI Lombard Insurance', policy_number: 'POL-MAR-556677', start_date: '2025-10-15', expiry_date: '2026-10-15', premium: 11200, status: 'Active' },
  { id: 'ins-3', vehicle_id: 'veh-3', company_name: 'Bajaj Allianz General Insurance', policy_number: 'POL-TAT-994321', start_date: '2025-08-25', expiry_date: '2026-08-25', premium: 18200, status: 'Expiring Soon' },
  { id: 'ins-4', vehicle_id: 'veh-4', company_name: 'Tata AIG General Insurance', policy_number: 'POL-MAH-112344', start_date: '2025-08-30', expiry_date: '2026-08-30', premium: 22000, status: 'Expiring Soon' },
  { id: 'ins-5', vehicle_id: 'veh-5', company_name: 'HDFC ERGO General Insurance', policy_number: 'POL-HON-334455', start_date: '2025-11-01', expiry_date: '2026-11-01', premium: 13800, status: 'Active' },
  { id: 'ins-6', vehicle_id: 'veh-6', company_name: 'SBI General Insurance', policy_number: 'POL-TOY-778899', start_date: '2025-12-10', expiry_date: '2026-12-10', premium: 26500, status: 'Active' },
  { id: 'ins-7', vehicle_id: 'veh-7', company_name: 'Reliance General Insurance', policy_number: 'POL-KIA-223344', start_date: '2025-09-15', expiry_date: '2026-09-15', premium: 15400, status: 'Active' },
  { id: 'ins-8', vehicle_id: 'veh-8', company_name: 'Oriental Insurance Company', policy_number: 'POL-REN-667788', start_date: '2025-08-22', expiry_date: '2026-08-22', premium: 9800, status: 'Expiring Soon' },
  { id: 'ins-9', vehicle_id: 'veh-9', company_name: 'Star Health & Allied Insurance', policy_number: 'POL-VW-889900', start_date: '2025-10-05', expiry_date: '2026-10-05', premium: 16900, status: 'Active' },
  { id: 'ins-10', vehicle_id: 'veh-10', company_name: 'New India Assurance Co.', policy_number: 'POL-SKO-445566', start_date: '2024-07-10', expiry_date: '2025-07-10', premium: 17500, status: 'Expired' },
];

export const DEMO_FUEL = [
  { id: 'fuel-1', vehicle_id: 'veh-1', date: '2026-05-04', fuel_type: 'Petrol', quantity: 35, price_per_litre: 102, total_cost: 3570, odometer: 17200 },
  { id: 'fuel-2', vehicle_id: 'veh-1', date: '2026-06-12', fuel_type: 'Petrol', quantity: 40, price_per_litre: 102, total_cost: 4080, odometer: 17750 },
  { id: 'fuel-3', vehicle_id: 'veh-1', date: '2026-07-08', fuel_type: 'Petrol', quantity: 38, price_per_litre: 101.5, total_cost: 3857, odometer: 18100 },
  { id: 'fuel-4', vehicle_id: 'veh-1', date: '2026-08-14', fuel_type: 'Petrol', quantity: 42, price_per_litre: 101.2, total_cost: 4250, odometer: 18450 },
  { id: 'fuel-5', vehicle_id: 'veh-2', date: '2026-07-01', fuel_type: 'Petrol', quantity: 28, price_per_litre: 104, total_cost: 2912, odometer: 23800 },
  { id: 'fuel-6', vehicle_id: 'veh-2', date: '2026-08-10', fuel_type: 'Petrol', quantity: 30, price_per_litre: 104, total_cost: 3120, odometer: 24300 },
  { id: 'fuel-7', vehicle_id: 'veh-4', date: '2026-08-10', fuel_type: 'Diesel', quantity: 50, price_per_litre: 89.5, total_cost: 4475, odometer: 34100 },
  { id: 'fuel-8', vehicle_id: 'veh-5', date: '2026-08-05', fuel_type: 'Petrol', quantity: 36, price_per_litre: 102, total_cost: 3672, odometer: 41000 },
  { id: 'fuel-9', vehicle_id: 'veh-6', date: '2026-08-12', fuel_type: 'Diesel', quantity: 55, price_per_litre: 89.5, total_cost: 4922, odometer: 28500 },
  { id: 'fuel-10', vehicle_id: 'veh-8', date: '2026-08-15', fuel_type: 'CNG', quantity: 18, price_per_litre: 76, total_cost: 1368, odometer: 52000 },
];

export const DEMO_MAINTENANCE = [
  { id: 'maint-1', vehicle_id: 'veh-1', maintenance_type: 'Engine Oil Change', due_date: '2026-08-25', current_status: 'Due Soon', description: 'Synthetic 5W-30 engine oil replacement.' },
  { id: 'maint-2', vehicle_id: 'veh-1', maintenance_type: 'Tyre Rotation & Balancing', due_date: '2026-09-15', current_status: 'Upcoming', description: '4-wheel cross rotation.' },
  { id: 'maint-3', vehicle_id: 'veh-2', maintenance_type: 'Brake Inspection', due_date: '2026-07-15', current_status: 'Completed', description: 'Front brake pad check.' },
  { id: 'maint-4', vehicle_id: 'veh-3', maintenance_type: '12V Battery Volt Test', due_date: '2026-09-01', current_status: 'Upcoming', description: 'Auxiliary battery voltage check.' },
  { id: 'maint-5', vehicle_id: 'veh-4', maintenance_type: 'Brake Disc Inspection', due_date: '2026-08-10', current_status: 'Overdue', description: 'Brake pads, fluid lines, and rotor wear check.' },
  { id: 'maint-6', vehicle_id: 'veh-4', maintenance_type: 'Engine Oil Filter', due_date: '2026-08-24', current_status: 'Due Soon', description: 'Oil filter replacement.' },
  { id: 'maint-7', vehicle_id: 'veh-6', maintenance_type: 'Wheel Alignment', due_date: '2026-08-26', current_status: 'Due Soon', description: 'Laser wheel alignment.' },
  { id: 'maint-8', vehicle_id: 'veh-8', maintenance_type: 'Clutch Cable Inspection', due_date: '2026-08-05', current_status: 'Overdue', description: 'Clutch play & cable tension check.' },
];

export const DEMO_GARAGES = [
  { id: 'g-1', name: 'SpeedyAuto Care & Service', address: 'MG Road, Sector 14, Gurugram', latitude: 28.4595, longitude: 77.0266, phone: '+91 98765 43210', services: ['General Service', 'Engine Repair', 'Brake Repair', 'Tyre Service'], rating: 4.8 },
  { id: 'g-2', name: 'Apex Motor Workshop', address: 'Koramangala 5th Block, Bengaluru', latitude: 12.9352, longitude: 77.6245, phone: '+91 98123 45678', services: ['Oil Change', 'Battery Check', 'Brake Repair', 'AC Repair'], rating: 4.6 },
  { id: 'g-3', name: 'Metro Vehicle Hub', address: 'Andheri East, Mumbai', latitude: 19.1136, longitude: 72.8697, phone: '+91 99887 76655', services: ['General Service', 'Accident Repair', 'Tyre Rotation', 'Washing'], rating: 4.7 },
  { id: 'g-4', name: 'Classic Garage & Repairs', address: 'Connaught Place, New Delhi', latitude: 28.6315, longitude: 77.2167, phone: '+91 97654 32109', services: ['Engine Diagnosis', 'Electrical Repair', 'Brake Repair'], rating: 4.5 },
  { id: 'g-5', name: 'Royal Care Motors', address: 'Banjara Hills, Hyderabad', latitude: 17.4126, longitude: 78.4312, phone: '+91 91234 56789', services: ['Full Inspection', 'Engine Tuning', 'Battery Replacement'], rating: 4.9 },
];

export const DEMO_EMERGENCY = [
  { id: 'emg-1', vehicle_id: 'veh-1', owner_id: 'owner-1', issue: 'Vehicle Breakdown', latitude: 28.4595, longitude: 77.0266, description: 'Engine stalled on highway near Toll Plaza.', status: 'On the Way', created_at: '2026-08-19T18:30:00Z' },
  { id: 'emg-2', vehicle_id: 'veh-4', owner_id: 'owner-4', issue: 'Flat Tyre', latitude: 28.6315, longitude: 77.2167, description: 'Rear left tyre punctured.', status: 'Resolved', created_at: '2026-08-18T10:15:00Z' },
  { id: 'emg-3', vehicle_id: 'veh-8', owner_id: 'owner-8', issue: 'Fuel Empty', latitude: 25.5941, longitude: 85.1376, description: 'Out of CNG on bypass road.', status: 'Pending', created_at: '2026-08-19T20:00:00Z' },
];

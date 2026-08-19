/**
 * Form Validation Helpers
 */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validateRegistrationNumber(regNum) {
  // Indian Vehicle Registration format example: MH12AB1234 or JH01AB1234
  if (!regNum || regNum.trim().length < 5) return false;
  return true;
}

export function validateVehicleForm(data) {
  const errors = {};
  if (!data.brand || !data.brand.trim()) errors.brand = 'Brand is required.';
  if (!data.model || !data.model.trim()) errors.model = 'Model is required.';
  if (!data.registration_number || !data.registration_number.trim()) {
    errors.registration_number = 'Registration number is required.';
  } else if (!validateRegistrationNumber(data.registration_number)) {
    errors.registration_number = 'Invalid registration number format.';
  }
  const currentYear = new Date().getFullYear();
  if (!data.year || isNaN(data.year) || data.year < 1900 || data.year > currentYear + 1) {
    errors.year = `Year must be between 1900 and ${currentYear + 1}.`;
  }
  if (data.mileage === undefined || data.mileage === '' || isNaN(data.mileage) || Number(data.mileage) < 0) {
    errors.mileage = 'Mileage cannot be negative.';
  }
  if (!data.fuel_type) errors.fuel_type = 'Fuel type is required.';

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateFuelForm(data) {
  const errors = {};
  if (!data.vehicle_id) errors.vehicle_id = 'Vehicle selection is required.';
  if (!data.quantity || isNaN(data.quantity) || Number(data.quantity) <= 0) {
    errors.quantity = 'Quantity must be greater than 0.';
  }
  if (!data.price_per_litre || isNaN(data.price_per_litre) || Number(data.price_per_litre) <= 0) {
    errors.price_per_litre = 'Price per litre must be greater than 0.';
  }
  if (!data.date) errors.date = 'Date is required.';
  if (data.odometer === undefined || data.odometer === '' || isNaN(data.odometer) || Number(data.odometer) < 0) {
    errors.odometer = 'Odometer reading cannot be negative.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateInsuranceForm(data) {
  const errors = {};
  if (!data.vehicle_id) errors.vehicle_id = 'Vehicle selection is required.';
  if (!data.policy_number || !data.policy_number.trim()) errors.policy_number = 'Policy number is required.';
  if (!data.company_name || !data.company_name.trim()) errors.company_name = 'Company name is required.';
  if (!data.start_date) errors.start_date = 'Start date is required.';
  if (!data.expiry_date) errors.expiry_date = 'Expiry date is required.';
  if (data.start_date && data.expiry_date && new Date(data.expiry_date) <= new Date(data.start_date)) {
    errors.expiry_date = 'Expiry date must be after start date.';
  }
  if (!data.premium || isNaN(data.premium) || Number(data.premium) < 0) {
    errors.premium = 'Premium cost cannot be negative.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateServiceForm(data) {
  const errors = {};
  if (!data.vehicle_id) errors.vehicle_id = 'Vehicle selection is required.';
  if (!data.service_type || !data.service_type.trim()) errors.service_type = 'Service type is required.';
  if (!data.service_date) errors.service_date = 'Service date is required.';
  if (data.cost === undefined || data.cost === '' || isNaN(data.cost) || Number(data.cost) < 0) {
    errors.cost = 'Cost cannot be negative.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateEmergencyForm(data) {
  const errors = {};
  if (!data.issue || !data.issue.trim()) errors.issue = 'Issue selection is required.';
  if (!data.description || !data.description.trim()) errors.description = 'Description is required.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Utility functions for calculations and formatting currency
 */

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotalCost(quantity, pricePerLitre) {
  const q = parseFloat(quantity) || 0;
  const p = parseFloat(pricePerLitre) || 0;
  return Number((q * p).toFixed(2));
}

export function formatMileage(mileage) {
  if (!mileage && mileage !== 0) return '0 km';
  return `${Number(mileage).toLocaleString('en-IN')} km`;
}
